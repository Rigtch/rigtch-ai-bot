import { TypeORMVectorStore } from '@langchain/community/vectorstores/typeorm'
import { Logger, type OnModuleInit } from '@nestjs/common'
import type { DataSourceOptions } from 'typeorm'
import { OpenAIEmbeddings } from '@langchain/openai'

import { typeOrmConfig } from '@config/database'

export class ChatVectorStore implements OnModuleInit {
  private readonly logger = new Logger(ChatVectorStore.name)

  private vectorStore: TypeORMVectorStore

  get retriever() {
    return this.vectorStore.asRetriever()
  }

  get embeddings() {
    return this.vectorStore.embeddings
  }

  addDocuments(...args: Parameters<TypeORMVectorStore['addDocuments']>) {
    return this.vectorStore.addDocuments(...args)
  }

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
}
