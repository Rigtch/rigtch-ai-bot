import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { Collection } from 'discord.js'

import { ChatFormatter } from './chat.formatter'

import { messageMockFactory } from '@common/mocks'

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
      const messagesCollection = new Collection([
        ['1', messageMockFactory({ bot: false, username: 'user' }, 'test')],
        ['2', messageMockFactory({ bot: true }, 'test')],
        ['3', messageMockFactory({ bot: false, username: 'user' }, 'test')],
        ['4', messageMockFactory({ bot: true }, 'test')],
      ])

      const formattedHistory = chatFormatter.formatHistory(messagesCollection)

      expect(formattedHistory).toHaveLength(3)
      expect(formattedHistory).toEqual([
        new AIMessage('test'),
        new HumanMessage({
          content: 'test',
          name: 'user',
        }),
        new AIMessage('test'),
      ])
    })
  })

  describe('splitResponse', () => {
    test('should split response', async () => {
      const response = Array.from({ length: 10 })
        .map(() => Array.from({ length: 1000 }).join('a'))
        .join('\n\n')

      console.log(response)

      const splitResponse = await chatFormatter.splitResponse(response)

      expect(splitResponse).toHaveLength(5)
    })
  })
})
