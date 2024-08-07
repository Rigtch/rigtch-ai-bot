import type { AIMessageChunk } from '@langchain/core/messages'

import type { ChatHistory } from './chat-history.type'

export interface ChatResponse {
  input: string
  output: string
  chatHistory: ChatHistory
  intermediateSteps: IntermediateStep[]
}

export interface IntermediateStep {
  action: Action
  observation: string
}

export interface Action {
  tool: string
  toolInput: string
  log: string
  messageLog: AIMessageChunk[]
}

export interface ToolInput {
  input: string
}
