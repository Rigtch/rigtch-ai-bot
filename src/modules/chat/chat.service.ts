import { Injectable, Logger } from '@nestjs/common'
import type { Collection, Message } from 'discord.js'

import { ChatModel } from './chat.model'
import { formatHistory } from './helpers'

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)

  constructor(private readonly chatModel: ChatModel) {}

  async call(message: string, chatHistory: Collection<string, Message<true>>) {
    try {
      const response = await this.chatModel.invoke({
        input: message,
        chat_history: formatHistory(chatHistory),
      })

      return response.output.content as string
    } catch (error) {
      this.logger.error(error)
    }
  }
}
