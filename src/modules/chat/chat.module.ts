import { Module } from '@nestjs/common'

import { ChatModel } from './chat.model'
import { ChatService } from './chat.service'
import { ChatFormatter } from './chat.formatter'

@Module({
  providers: [ChatModel, ChatService, ChatFormatter],
  exports: [ChatService, ChatFormatter],
})
export class ChatModule {}
