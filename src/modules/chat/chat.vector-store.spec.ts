import { Test, type TestingModule } from '@nestjs/testing'
import { mock } from 'vitest-mock-extended'
import type { Document } from '@langchain/core/documents'

import { ChatVectorStore } from './chat.vector-store'

vi.stubEnv('OPENAI_API_KEY', 'test')

vi.mock('@langchain/community/vectorstores/typeorm', () => {
  const TypeORMVectorStore = vi.fn().mockReturnValue({
    asRetriever: vi.fn().mockReturnValue({}),
    addDocuments: vi.fn(),
    embeddings: {},
    ensureTableInDatabase: vi.fn(),
  })

  return {
    TypeORMVectorStore: Object.assign(TypeORMVectorStore, {
      fromDataSource: vi.fn().mockResolvedValue(TypeORMVectorStore()),
    }),
  }
})

describe('ChatVectorStore', () => {
  let moduleRef: TestingModule
  let chatVectorStore: ChatVectorStore

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [ChatVectorStore],
    }).compile()

    chatVectorStore = moduleRef.get(ChatVectorStore)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(chatVectorStore).toBeDefined()
  })

  describe('onModuleInit', () => {
    test('should initialize the vector store', async () => {
      await chatVectorStore.onModuleInit()

      expect(chatVectorStore.retriever).toBeDefined()
      expect(chatVectorStore.embeddings).toBeDefined()
    })
  })

  describe('addDocuments', () => {
    test('should add documents to the vector store', async () => {
      const documents = [
        mock<Document>({
          pageContent: 'test',
        }),
      ]

      await chatVectorStore.onModuleInit()
      await chatVectorStore.addDocuments(documents)

      // @ts-expect-error Mocking private method
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatVectorStore.vectorStore.addDocuments).toHaveBeenCalledWith(
        documents
      )
    })
  })
})
