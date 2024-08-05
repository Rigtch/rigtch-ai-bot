import { AIMessage, HumanMessage } from '@langchain/core/messages'
import type { Collection, Message } from 'discord.js'
import { CharacterTextSplitter } from 'langchain/text_splitter'

export class ChatFormatter {
  private readonly MESSAGES_LIMIT = 4
  private readonly CHUNK_SIZE = 2000
  private readonly CHUNK_SEPARATOR = '\n'

  formatHistory(messagesCollection: Collection<string, Message<true>>) {
    const firstMessages = messagesCollection.first(this.MESSAGES_LIMIT + 1)

    firstMessages.shift()

    return firstMessages.map(({ content, author }) => {
      if (author.bot) return new AIMessage(content)

      return new HumanMessage({ content, name: author.username })
    })
  }

  async splitResponse(response: string) {
    const splitter = new CharacterTextSplitter({
      chunkSize: this.CHUNK_SIZE,
      separator: this.CHUNK_SEPARATOR,
    })

    const messageChunks = await splitter.createDocuments([response])

    return messageChunks.map(({ pageContent: content }) => content)
  }
}
