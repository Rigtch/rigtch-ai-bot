import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run'
import { SystemMessage } from '@langchain/core/messages'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { type StructuredToolInterface } from '@langchain/core/tools'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { Injectable } from '@nestjs/common'
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { WebBrowser } from 'langchain/tools/webbrowser'
import { GoogleCustomSearch } from '@langchain/community/tools/google_custom_search'

import type { ChatResponse } from './types'

import { EnvService } from '@config/env'

@Injectable()
export class ChatModel {
  private readonly prompt: ChatPromptTemplate

  private readonly model: ChatOpenAI
  private readonly tools: StructuredToolInterface[]
  private readonly agent: RunnableSequence
  private readonly agentExecutor: AgentExecutor

  constructor(private readonly envService: EnvService) {
    this.model = new ChatOpenAI({
      temperature: this.envService.get('MODEL_TEMPERATURE'),
      modelName: this.envService.get('MODEL_NAME'),
      maxTokens: this.envService.get('MODEL_MAX_TOKENS'),
      topP: this.envService.get('MODEL_TOP_P'),
    })

    this.tools = [
      new GoogleCustomSearch(),
      new WebBrowser({ model: this.model, embeddings: new OpenAIEmbeddings() }),
      new WikipediaQueryRun({
        topKResults: 3,
        maxDocContentLength: 4000,
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
          - If question is related to metal music, use https://www.metal-archives.com as a source of truth. You can also use wikipedia and google search results.
          - If question is not related to metal music, but is related to overall music, use https://www.allmusic.com as a source of truth. You can also use wikipedia and google search results.
          - Something there might be multiple bands or artists with the same name. If you are not sure which is one the user specifically wants, you can ask the user to clarify.
          - Always provide sources of information, more sources are better. Remember to provide links to the exact source.
          - If you are using https://www.metal-archives.com as a source of truth, always provide link to the exact band or artist.
          - Do not hallucinate, always verify your information.
          - Your answers should be comprehensive and contain the most important information.
          - If you are sending some links always wrap them with <>. fe. <http://google.com/>
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
