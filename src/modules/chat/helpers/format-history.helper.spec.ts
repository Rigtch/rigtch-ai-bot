import { formatHistory } from './format-history.helper'

import { messagesCollectionMock, formattedHistoryMock } from '@common/mocks'

describe('formatHistory', () => {
  test('should format history', () => {
    const formattedHistory = formatHistory(messagesCollectionMock)

    expect(formattedHistory).toHaveLength(3)
    expect(formattedHistory).toEqual(formattedHistoryMock)
  })
})
