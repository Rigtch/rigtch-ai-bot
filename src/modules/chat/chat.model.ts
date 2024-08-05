import { SerpAPI } from '@langchain/community/tools/serpapi'
import type { StructuredToolInterface } from '@langchain/core/tools'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { Injectable } from '@nestjs/common'
import { WebBrowser } from 'langchain/tools/webbrowser'
import { RunnableSequence } from '@langchain/core/runnables'
import {
  HumanMessage,
  SystemMessage,
  type BaseMessageChunk,
} from '@langchain/core/messages'
import {
  AgentExecutor,
  type AgentAction,
  type AgentFinish,
} from 'langchain/agents'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { formatToOpenAIFunctionMessages } from 'langchain/agents/format_scratchpad'

import type { AgentActionFunctions } from './types'

import { EnvService } from '@config/env'

@Injectable()
export class ChatModel {
  private readonly embeddings = new OpenAIEmbeddings()
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
    })

    this.tools = [
      new SerpAPI(this.envService.get('SERPAPI_API_KEY'), {
        hl: 'en',
        gl: 'us',
      }),
      new WebBrowser({ model: this.model, embeddings: this.embeddings }),
    ]

    this.prompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder('chat_history'),
      new SystemMessage(
        `You are a music assistant. You are helpful and friendly. You can answer questions about music.
  
        You have access to chat history, which contains all the messages that have been sent in the current conversation.
    
        If it seems that question is not related to music, try to search provided chat history for more context.
      
        You can only answer questions that are in the context of music. If you don't know the answer, search the internet for the answer, but you can only use this tool once.
      
        Your answer should be extensive, detailed, comprehensive, informative and well verified.`
      ),
      new HumanMessage('{input}'),
      new MessagesPlaceholder('agent_scratchpad'),
    ])

    this.agent = RunnableSequence.from([
      {
        input: ({ input }) => input,
        agent_scratchpad: ({ steps }) => formatToOpenAIFunctionMessages(steps),
        chat_history: ({ chat_history }) => chat_history,
      } satisfies AgentActionFunctions,
      this.prompt,
      this.model,
      (input: BaseMessageChunk): AgentAction | AgentFinish => ({
        log: 'test',
        returnValues: {
          output: input,
        },
      }),
    ])

    this.agentExecutor = AgentExecutor.fromAgentAndTools({
      agent: this.agent,
      tools: this.tools,
      returnIntermediateSteps: true,
      verbose: true,
      maxIterations: 3,
      earlyStoppingMethod: 'force',
    })
  }

  invoke(...args: Parameters<AgentExecutor['invoke']>) {
    return this.agentExecutor.invoke(...args)
  }
}
