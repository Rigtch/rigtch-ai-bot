import { Module } from '@nestjs/common'

import { ChatModel } from './chat.model'
import { ChatService } from './chat.service'
import { ChatVectorStore } from './chat.vector-store'

@Module({
  providers: [ChatModel, ChatService, ChatVectorStore],
  exports: [ChatService],
})
export class ChatModule {}
