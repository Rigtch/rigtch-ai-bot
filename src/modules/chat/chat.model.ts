import { GoogleCustomSearch } from '@langchain/community/tools/google_custom_search'
import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run'
import { Document } from '@langchain/core/documents'
import { SystemMessage } from '@langchain/core/messages'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import {
  DynamicStructuredTool,
  type StructuredToolInterface,
} from '@langchain/core/tools'
import { ChatOpenAI } from '@langchain/openai'
import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common'
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { createRetrieverTool } from 'langchain/tools/retriever'
import { WebBrowser } from 'langchain/tools/webbrowser'
import { z } from 'zod'

import type { ChatResponse } from './types'

import { EnvService } from '@config/env'
import { DocumentsVectorStore } from '@modules/documents'

@Injectable()
export class ChatModel implements OnApplicationBootstrap {
  private readonly logger = new Logger(ChatModel.name)

  private prompt: ChatPromptTemplate

  private model: ChatOpenAI
  private tools: StructuredToolInterface[]
  private agent: RunnableSequence
  private agentExecutor: AgentExecutor

  constructor(
    private readonly envService: EnvService,
    private readonly documentsVectorStore: DocumentsVectorStore
  ) {}

  onApplicationBootstrap() {
    this.model = new ChatOpenAI({
      temperature: this.envService.get('MODEL_TEMPERATURE'),
      modelName: this.envService.get('MODEL_NAME'),
      maxTokens: this.envService.get('MODEL_MAX_TOKENS'),
      topP: this.envService.get('MODEL_TOP_P'),
    })

    this.tools = [
      createRetrieverTool(this.documentsVectorStore.retriever, {
        name: 'searchVectorStore',
        description:
          'Searches the vector store for various information about music.',
      }),
      new GoogleCustomSearch(),
      new WebBrowser({
        model: this.model,
        embeddings: this.documentsVectorStore.embeddings,
      }),
      new WikipediaQueryRun({
        topKResults: 3,
        maxDocContentLength: 4000,
      }),
      new DynamicStructuredTool({
        name: 'saveToVectorStore',
        description: 'Saves the input to the vector store',
        schema: z.object({
          correction: z
            .string()
            .describe(
              'Correction from the user that should include a link to the source'
            ),
        }),
        func: async ({ correction }) => {
          this.logger.log(`Saving correction to vector store: ${correction}`)

          const document = new Document({
            pageContent: correction,
          })

          await this.documentsVectorStore.addDocuments([document])

          return 'success'
        },
      }),
    ]

    this.model.bindTools(this.tools)

    this.prompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder('chatHistory'),
      new SystemMessage(
        `# Your personality:
          - You are a music assistant named Henry, who is providing accurate information about music.

        # Answering rules:
          - You can only answer questions that are in the context of music.
          - You have access to the chat history, which contains all the messages that have been sent in the current conversation.
          - Refer always to the nearest message in the chat history.
          - You can use the "searchVectorStore" tool to search the vector store for various information about music. If you found what you were looking for, use other tools to extend your knowledge.
          - If question is related to metal music, use https://www.metal-archives.com as a source of truth. You can also use wikipedia and google search results.
          - If question is not related to metal music, but is related to overall music, use https://www.allmusic.com as a source of truth. You can also use wikipedia and google search results.
          - Something there might be multiple bands or artists with the same name. If you are not sure which is one the user specifically wants, you can ask the user to clarify.
          - Always provide sources of information, more sources are better. Remember to provide links to the exact source.
          - If you are using https://www.metal-archives.com as a source of truth, always provide link to the exact band or artist.
          - Do not hallucinate, always verify your information.
          - Your answers should be comprehensive and contain the most important information.
          - If you are sending some links always wrap them with <>. fe. <http://google.com/>
          - If there was some misunderstanding in user input and not chat history, someone corrected you or provided you a link to the band that he was referring to, use "saveToVectorStore" tool to save the correction with valid links to the vector store.
        `
      ),
      ['user', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ])

    this.agent = createToolCallingAgent({
      tools: this.tools,
      llm: this.model,
      prompt: this.prompt,
    })

    this.agentExecutor = AgentExecutor.fromAgentAndTools({
      agent: this.agent,
      tools: this.tools,
      returnIntermediateSteps: true,
      // verbose: true,
      maxIterations: 10,
      earlyStoppingMethod: 'force',
    })
  }

  invoke(...args: Parameters<AgentExecutor['invoke']>) {
    return this.agentExecutor.invoke(...args) as Promise<ChatResponse>
  }
}
