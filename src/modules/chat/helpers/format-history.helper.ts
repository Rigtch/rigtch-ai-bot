import { AIMessage, HumanMessage } from '@langchain/core/messages'
import type { Collection, Message } from 'discord.js'

export const MESSAGES_LIMIT = 10

export function formatHistory(
  messagesCollection: Collection<string, Message<true>>
) {
  const firstMessages = messagesCollection.first(MESSAGES_LIMIT + 1)

  firstMessages.shift()

  firstMessages.reverse()

  return firstMessages.map(({ content, author }) => {
    if (author.bot) return new AIMessage(content)

    return new HumanMessage({ content, name: author.username })
  })
}
