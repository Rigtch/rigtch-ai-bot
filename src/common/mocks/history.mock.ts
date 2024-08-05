import { Collection } from 'discord.js'
import { AIMessage, HumanMessage } from '@langchain/core/messages'

import { messageMockFactory } from './message.mock'

export const messagesCollectionMock = new Collection([
  ['1', messageMockFactory({ bot: false, username: 'user' }, 'test')],
  ['2', messageMockFactory({ bot: true }, 'test')],
  ['3', messageMockFactory({ bot: false, username: 'user' }, 'test')],
  ['4', messageMockFactory({ bot: true }, 'test')],
])

export const formattedHistoryMock = [
  new AIMessage('test'),
  new HumanMessage({
    content: 'test',
    name: 'user',
  }),
  new AIMessage('test'),
]
