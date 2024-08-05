import type { AIMessage, HumanMessage } from '@langchain/core/messages'

export type ChatHistory = (AIMessage | HumanMessage)[]
