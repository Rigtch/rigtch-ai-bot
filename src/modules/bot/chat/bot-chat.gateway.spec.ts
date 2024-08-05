import { Test, TestingModule } from '@nestjs/testing'
import type { MockInstance } from 'vitest'

import { BotChatGateway } from './bot-chat.gateway'

import {
  formattedHistoryMock,
  messageMockFactory,
  messagesCollectionMock,
} from '@common/mocks'
import { ChatFormatter, ChatService } from '@modules/chat'

describe('BotChatGateway', () => {
  let moduleRef: TestingModule
  let botChatGateway: BotChatGateway
  let chatService: ChatService
  let chatFormatter: ChatFormatter

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        BotChatGateway,
        {
          provide: ChatService,
          useValue: {
            call: vi.fn(),
          },
        },
        ChatFormatter,
      ],
    }).compile()

    botChatGateway = moduleRef.get(BotChatGateway)
    chatService = moduleRef.get(ChatService)
    chatFormatter = moduleRef.get(ChatFormatter)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(botChatGateway).toBeDefined()
  })

  describe('onMessageCreate', () => {
    let callSpy: MockInstance
    let formatHistorySpy: MockInstance
    let splitResponseSpy: MockInstance

    beforeEach(() => {
      callSpy = vi.spyOn(chatService, 'call')
      formatHistorySpy = vi.spyOn(chatFormatter, 'formatHistory')
      splitResponseSpy = vi.spyOn(chatFormatter, 'splitResponse')
    })

    test('should call the chat service with the message content and the history', async () => {
      const responseMock = 'Hello, World!'
      const content = 'Hello, Henry!'

      const messageMock = messageMockFactory(
        {
          bot: false,
        },
        content
      )

      callSpy.mockResolvedValue(responseMock)

      expect(
        await botChatGateway.onMessageCreate(
          messageMock,
          messagesCollectionMock
        )
      ).toEqual(responseMock)
      expect(formatHistorySpy).toHaveBeenCalledWith(messagesCollectionMock)
      expect(callSpy).toHaveBeenCalledWith(content, formattedHistoryMock)
      expect(splitResponseSpy).not.toHaveBeenCalled()
    })

    test('should split the response into chunks if it is longer than 2000 characters', async () => {
      const content = 'Hello, Henry!'
      const response = Array.from({ length: 10 })
        .map(() => Array.from({ length: 1000 }).join('a'))
        .join('\n\n')

      const sendSpy = vi.fn()
      const replySpy = vi.fn()

      const messageMock = messageMockFactory(
        {
          bot: false,
        },
        content,
        {
          send: sendSpy,
        },
        replySpy
      )

      callSpy.mockResolvedValue(response)

      await botChatGateway.onMessageCreate(messageMock, messagesCollectionMock)

      expect(formatHistorySpy).toHaveBeenCalledWith(messagesCollectionMock)
      expect(callSpy).toHaveBeenCalledWith(content, formattedHistoryMock)
      expect(splitResponseSpy).toHaveBeenCalledWith(response)
      expect(sendSpy).toHaveBeenCalledTimes(4)
      expect(replySpy).toHaveBeenCalledTimes(1)
    })
  })
})
