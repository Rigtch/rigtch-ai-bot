import { Test, TestingModule } from '@nestjs/testing'
import type { MockInstance } from 'vitest'

import { BotChatGateway } from './bot-chat.gateway'

import { messageMockFactory, messagesCollectionMock } from '@common/mocks'
import { ChatService } from '@modules/chat'

describe('BotChatGateway', () => {
  let moduleRef: TestingModule
  let botChatGateway: BotChatGateway
  let chatService: ChatService

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
      ],
    }).compile()

    botChatGateway = moduleRef.get(BotChatGateway)
    chatService = moduleRef.get(ChatService)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(botChatGateway).toBeDefined()
  })

  describe('onMessageCreate', () => {
    const sendTypingSpy = vi.fn()

    let callSpy: MockInstance

    beforeEach(() => {
      callSpy = vi.spyOn(chatService, 'call')
    })

    test('should call the chat service with the message content and the history', async () => {
      const responseMock = 'Hello, World!'
      const content = 'Hello, Henry!'

      const messageMock = messageMockFactory(
        {
          bot: false,
        },
        content,
        {
          sendTyping: sendTypingSpy,
        }
      )

      callSpy.mockResolvedValue(responseMock)

      expect(
        await botChatGateway.onMessageCreate(
          messageMock,
          messagesCollectionMock
        )
      ).toEqual(responseMock)

      expect(sendTypingSpy).toHaveBeenCalled()
      expect(callSpy).toHaveBeenCalledWith(content, messagesCollectionMock)
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
          sendTyping: sendTypingSpy,
        },
        replySpy
      )

      callSpy.mockResolvedValue(response)

      await botChatGateway.onMessageCreate(messageMock, messagesCollectionMock)

      expect(sendTypingSpy).toHaveBeenCalled()
      expect(callSpy).toHaveBeenCalledWith(content, messagesCollectionMock)
      expect(sendSpy).toHaveBeenCalledTimes(4)
      expect(replySpy).toHaveBeenCalledTimes(1)
    })
  })
})
