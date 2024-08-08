import { Controller, Delete, Get, Param } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { DocumentsVectorStore } from './documents.vector-store'
import type { SuccessDocument } from './docs'

export const documentsSelect = ['id', 'pageContent', 'metadata']

@Controller('documents')
@ApiTags('documents')
export class DocumentsController {
  constructor(private readonly documentsVectorStore: DocumentsVectorStore) {}

  @Get()
  @ApiOperation({
    summary: 'Get all documents.',
    description: 'Get all documents from the vector store.',
  })
  @ApiOkResponse({
    description: 'All documents from the vector store.',
  })
  getAll() {
    return this.documentsVectorStore.repository.find({
      select: ['id', 'pageContent', 'metadata'],
    })
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a document by id.',
    description: 'Get a document from the vector store by id.',
  })
  @ApiOkResponse({
    description: 'A document from the vector store.',
  })
  getOne(@Param('id') id: string) {
    return this.documentsVectorStore.repository.findOne({
      where: { id },
      select: ['id', 'pageContent', 'metadata'],
    })
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a document by id.',
    description: 'Delete a document from the vector store by id.',
  })
  @ApiOkResponse({
    description: 'The document has been deleted.',
  })
  async deleteOne(@Param('id') id: string): Promise<SuccessDocument> {
    await this.documentsVectorStore.repository.delete(id)

    return { success: true }
  }
}
