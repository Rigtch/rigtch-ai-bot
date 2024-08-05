import { type TestingModule, Test } from '@nestjs/testing'

import { ChatModel } from './chat.model'
import { ChatService } from './chat.service'

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
      const content = 'test content'

      const message = 'test message'

      const invokeSpy = vi.spyOn(chatModel, 'invoke').mockResolvedValue({
        output: {
          content,
        },
      })

      expect(await chatService.call(message, messagesCollectionMock)).toEqual(
        content
      )
      expect(invokeSpy).toHaveBeenCalledWith({
        input: message,
        chat_history: formattedHistoryMock,
      })
    })
  })
})
