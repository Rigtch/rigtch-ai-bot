import { CharacterTextSplitter } from 'langchain/text_splitter'

export const CHUNK_SIZE = 2000
export const CHUNK_SEPARATOR = '\n'

export async function splitResponse(response: string) {
  const splitter = new CharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: 1,
    separator: CHUNK_SEPARATOR,
  })

  const messageChunks = await splitter.createDocuments([response])

  return messageChunks.map(({ pageContent: content }) => content)
}
