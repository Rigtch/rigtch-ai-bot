import { type TestingModule, Test } from '@nestjs/testing'

import { ChatModel } from './chat.model'
import { ChatService } from './chat.service'
import type { ChatResponse } from './types'

import { formattedHistoryMock, messagesCollectionMock } from '@common/mocks'

describe('ChatService', () => {
  let moduleRef: TestingModule
  let chatService: ChatService
  let chatModel: ChatModel

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: ChatModel,
          useValue: {
            invoke: vi.fn(),
          },
        },
      ],
    }).compile()

    chatService = moduleRef.get(ChatService)
    chatModel = moduleRef.get(ChatModel)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(chatService).toBeDefined()
  })

  describe('call', () => {
    test('should call the chat model with the message and chat history', async () => {
      const output = 'test content'

      const message = 'test message'

      const invokeSpy = vi.spyOn(chatModel, 'invoke').mockResolvedValue({
        output,
        intermediateSteps: [],
        input: message,
        chatHistory: formattedHistoryMock,
      } as ChatResponse)

      expect(await chatService.call(message, messagesCollectionMock)).toEqual(
        output
      )
      expect(invokeSpy).toHaveBeenCalledWith({
        input: message,
        chatHistory: formattedHistoryMock,
      })
    })
  })
})
