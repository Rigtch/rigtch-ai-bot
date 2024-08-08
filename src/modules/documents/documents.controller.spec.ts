import { Test, type TestingModule } from '@nestjs/testing'
import { mock } from 'vitest-mock-extended'
import { Document } from '@langchain/core/documents'

import { DocumentsController, documentsSelect } from './documents.controller'
import { DocumentsVectorStore } from './documents.vector-store'

describe('DocumentsController', () => {
  let moduleRef: TestingModule
  let documentsController: DocumentsController
  let documentsVectorStore: DocumentsVectorStore

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsVectorStore,
          useValue: {
            repository: {
              find: vi.fn(),
              findOne: vi.fn(),
              delete: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    documentsController = moduleRef.get(DocumentsController)
    documentsVectorStore = moduleRef.get(DocumentsVectorStore)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(documentsController).toBeDefined()
  })

  describe('getAll', () => {
    test('should return all documents', async () => {
      const documents = mock<Document[]>()

      const findSpy = vi
        .spyOn(documentsVectorStore.repository, 'find')
        .mockResolvedValue(documents)

      expect(await documentsController.getAll()).toEqual(documents)
      expect(findSpy).toHaveBeenCalledWith({
        select: documentsSelect,
      })
    })
  })

  describe('getOne', () => {
    test('should return a document', async () => {
      const document = mock<Document>()

      const findOneSpy = vi
        .spyOn(documentsVectorStore.repository, 'findOne')
        .mockResolvedValue(document)

      expect(await documentsController.getOne('test')).toEqual(document)
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 'test' },
        select: documentsSelect,
      })
    })
  })

  describe('deleteOne', () => {
    test('should delete a document', async () => {
      const deleteSpy = vi.spyOn(documentsVectorStore.repository, 'delete')

      expect(await documentsController.deleteOne('test')).toEqual({
        success: true,
      })
      expect(deleteSpy).toHaveBeenCalledWith('test')
    })
  })
})
