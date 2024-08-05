import type { AgentStep } from 'langchain/agents'

export interface AgentActionParam {
  input: string
  steps: AgentStep[]
  chat_history: string
}

export type AgentActionFunctions = Record<
  string,
  (params: AgentActionParam) => unknown
>
