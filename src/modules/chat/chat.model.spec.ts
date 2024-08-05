import { Test, type TestingModule } from '@nestjs/testing'

import { ChatModel } from './chat.model'

import { EnvService } from '@config/env'

vi.stubEnv('OPENAI_API_KEY', 'test')
vi.stubEnv('SERPAPI_API_KEY', 'test')

vi.mock('langchain/agents', () => {
  const AgentExecutor = vi.fn().mockReturnValue({
    invoke: vi.fn(),
  })

  return {
    AgentExecutor: Object.assign(AgentExecutor, {
      fromAgentAndTools: AgentExecutor,
    }),
  }
})

describe('ChatModel', () => {
  let moduleRef: TestingModule
  let chatModel: ChatModel

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ChatModel,
        {
          provide: EnvService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    chatModel = moduleRef.get(ChatModel)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(chatModel).toBeDefined()
  })

  describe('invoke', () => {
    test('should invoke the agent executor with the correct arguments', () => {
      const chainValues = {
        input: 'test',
      }

      chatModel.invoke(chainValues)

      // @ts-expect-error Mocking private method
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(chatModel.agentExecutor.invoke).toHaveBeenCalledWith(chainValues)
    })
  })
})
