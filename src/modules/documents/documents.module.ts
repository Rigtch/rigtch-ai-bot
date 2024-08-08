import { Module } from '@nestjs/common'

import { DocumentsVectorStore } from './documents.vector-store'
import { DocumentsController } from './documents.controller'

@Module({
  providers: [DocumentsVectorStore],
  exports: [DocumentsVectorStore],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
