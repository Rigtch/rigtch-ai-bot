import { ChatFormatter } from './chat.formatter'

import { formattedHistoryMock, messagesCollectionMock } from '@common/mocks'

describe('ChatFormatter', () => {
  let chatFormatter: ChatFormatter

  beforeEach(() => {
    chatFormatter = new ChatFormatter()
  })

  test('should be defined', () => {
    expect(chatFormatter).toBeDefined()
  })

  describe('formatHistory', () => {
    test('should format history', () => {
      const formattedHistory = chatFormatter.formatHistory(
        messagesCollectionMock
      )

      expect(formattedHistory).toHaveLength(3)
      expect(formattedHistory).toEqual(formattedHistoryMock)
    })
  })

  describe('splitResponse', () => {
    test('should split response', async () => {
      const response = Array.from({ length: 10 })
        .map(() => Array.from({ length: 1000 }).join('a'))
        .join('\n\n')

      const splitResponse = await chatFormatter.splitResponse(response)

      expect(splitResponse).toHaveLength(5)
    })
  })
})
