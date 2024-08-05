import { type TestingModule, Test } from '@nestjs/testing'
import { AIMessage, HumanMessage } from '@langchain/core/messages'

import { ChatModel } from './chat.model'
import { ChatService } from './chat.service'
import type { ChatHistory } from './types'

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

      const chatHistory: ChatHistory = [
        new HumanMessage({ content: 'test chat history' }),
        new AIMessage({ content: 'test chat history' }),
        new HumanMessage({ content: 'test chat history' }),
        new AIMessage({ content: 'test chat history' }),
      ]

      const message = 'test message'

      const invokeSpy = vi.spyOn(chatModel, 'invoke').mockResolvedValue({
        output: {
          content,
        },
      })

      expect(await chatService.call(message, chatHistory)).toEqual(content)
      expect(invokeSpy).toHaveBeenCalledWith({
        input: message,
        chat_history: chatHistory,
      })
    })
  })
})
