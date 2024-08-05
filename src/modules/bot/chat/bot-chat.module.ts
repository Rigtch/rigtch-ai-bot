import { Module } from '@nestjs/common'
import { DiscordModule } from '@discord-nestjs/core'

import { BotChatGateway } from './bot-chat.gateway'

import { ChatModule } from '@modules/chat'

@Module({
  imports: [DiscordModule.forFeature(), ChatModule],
  providers: [BotChatGateway],
  exports: [BotChatGateway],
})
export class BotChatModule {}
