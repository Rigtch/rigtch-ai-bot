import { Injectable, Logger } from '@nestjs/common'

import { ChatModel } from './chat.model'
import type { ChatHistory } from './types'

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)

  constructor(private readonly chatModel: ChatModel) {}

  async call(message: string, chatHistory: ChatHistory) {
    try {
      const response = await this.chatModel.invoke({
        input: message,
        chat_history: chatHistory,
      })

      return response.output.content as string
    } catch (error) {
      this.logger.error(error)
    }
  }
}
