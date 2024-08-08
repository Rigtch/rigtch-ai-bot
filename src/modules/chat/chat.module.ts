import { Module } from '@nestjs/common'

import { ChatModel } from './chat.model'
import { ChatService } from './chat.service'

import { DocumentsModule } from '@modules/documents'

@Module({
  imports: [DocumentsModule],
  providers: [ChatModel, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
