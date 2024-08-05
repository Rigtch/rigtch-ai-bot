import { Module } from '@nestjs/common'

import { ChatModel } from './chat.model'
import { ChatService } from './chat.service'

@Module({
  providers: [ChatModel, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
