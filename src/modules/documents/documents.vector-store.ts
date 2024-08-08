import { TypeORMVectorStore } from '@langchain/community/vectorstores/typeorm'
import { Logger, type OnModuleInit } from '@nestjs/common'
import type { DataSourceOptions } from 'typeorm'
import { OpenAIEmbeddings } from '@langchain/openai'
import type { Document } from '@langchain/core/documents'

import { typeOrmConfig } from '@config/database'

export class DocumentsVectorStore implements OnModuleInit {
  private readonly logger = new Logger(DocumentsVectorStore.name)

  private vectorStore: TypeORMVectorStore

  async onModuleInit() {
    this.vectorStore = await TypeORMVectorStore.fromDataSource(
      new OpenAIEmbeddings(),
      {
        postgresConnectionOptions: typeOrmConfig as DataSourceOptions,
      }
    )

    await this.vectorStore.ensureTableInDatabase()

    this.logger.log('Vector Store initialized')
  }

  get retriever() {
    return this.vectorStore.asRetriever()
  }

  get embeddings() {
    return this.vectorStore.embeddings
  }

  get entity() {
    return this.vectorStore.documentEntity
  }

  get repository() {
    return this.vectorStore.appDataSource.getRepository<Document>(this.entity)
  }

  addDocuments(...args: Parameters<TypeORMVectorStore['addDocuments']>) {
    return this.vectorStore.addDocuments(...args)
  }
}
