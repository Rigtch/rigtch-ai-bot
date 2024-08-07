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
      this.logger.log(`User input: ${message}`)

      const response = await this.chatModel.invoke({
        input: message,
        chatHistory: formatHistory(chatHistory),
      })

      if (response.intermediateSteps.length > 0) {
        this.logger.log(
          `Used tools: ${response.intermediateSteps.map(({ action }) => action.tool).join(', ')}`
        )
      }

      return response.output
    } catch (error) {
      this.logger.error(error)
    }
  }
}
