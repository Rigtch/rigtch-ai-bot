import { mock } from 'vitest-mock-extended'
import { Collection, type Message } from 'discord.js'

import {
  ChannelMessagesHistory,
  getChannelMessagesHistory,
} from './channel-messages-history.decorator'

import { contextMockFactory, messageMockFactory } from '@common/mocks'

describe('ChannelMessagesHistoryDecorator', () => {
  test('should be defined', () => {
    expect(ChannelMessagesHistory).toBeDefined()
  })

  test('should return the channel messages history', async () => {
    const messagesCollectionMock = new Collection<string, Message<true>>([
      [
        '1',
        messageMockFactory(
          {
            bot: false,
          },
          'test message'
        ),
      ],
      [
        '2',
        messageMockFactory(
          {
            bot: true,
          },
          'test message'
        ),
      ],
    ])

    const messageMock = mock({
      channel: {
        messages: {
          fetch: vi.fn().mockResolvedValue(messagesCollectionMock),
        },
      },
    } as unknown as Message<true>)

    const contextMock = contextMockFactory(messageMock)

    expect(await getChannelMessagesHistory(undefined, contextMock)).toEqual(
      messagesCollectionMock
    )
  })
})
