import { MessageEvent, On } from '@discord-nestjs/core'
import { Injectable, UseGuards } from '@nestjs/common'
import { Collection, type Message } from 'discord.js'

import { ChannelMessagesHistory } from '../decorators'
import { MessageFromUserGuard } from '../guards'

import { ChatFormatter, ChatService } from '@modules/chat'

@Injectable()
export class BotChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatFormatter: ChatFormatter
  ) {}

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard)
  async onMessageCreate(
    @MessageEvent() message: Message<true>,
    @ChannelMessagesHistory()
    messagesHistory: Collection<string, Message<true>>
  ) {
    const response = await this.chatService.call(
      message.content,
      this.chatFormatter.formatHistory(messagesHistory)
    )

    if (!response) return

    if (response.length >= 2000) {
      const responseChunks = await this.chatFormatter.splitResponse(response)

      for (const [index, content] of responseChunks.entries()) {
        await (index === 0
          ? message.reply({
              content,
            })
          : message.channel.send({
              content,
            }))
      }
    } else return response
  }
}
