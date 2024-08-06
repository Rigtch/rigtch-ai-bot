import { Test, type TestingModule } from '@nestjs/testing'
import type { MockInstance } from 'vitest'
import type { Message } from 'discord.js'
import type { ExecutionContext } from '@nestjs/common'

import { MessageFromRestrictedChannelGuard } from './message-from-restricted-channel.guard'

import { EnvService } from '@config/env'
import { contextMockFactory, messageMockFactory } from '@common/mocks'

describe('MessageFromRestrictedChannelGuard', () => {
  let moduleRef: TestingModule
  let messageFromRestrictedChannelGuard: MessageFromRestrictedChannelGuard
  let envService: EnvService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        MessageFromRestrictedChannelGuard,
        {
          provide: EnvService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    messageFromRestrictedChannelGuard = moduleRef.get(
      MessageFromRestrictedChannelGuard
    )
    envService = moduleRef.get(EnvService)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(messageFromRestrictedChannelGuard).toBeDefined()
  })

  describe('canActivate', () => {
    const CHANNEL_ID = 'test'

    let getSpy: MockInstance
    let messageMock: Message
    let contextMock: ExecutionContext

    beforeEach(() => {
      getSpy = vi.spyOn(envService, 'get')
      messageMock = messageMockFactory({ bot: false }, '', {
        id: CHANNEL_ID,
      })
      contextMock = contextMockFactory(messageMock)
    })

    test('should return true if the message is from a restricted channel', () => {
      getSpy.mockReturnValue(CHANNEL_ID)

      expect(messageFromRestrictedChannelGuard.canActivate(contextMock)).toBe(
        true
      )
    })

    test('should return false if the message is not from a restricted channel', () => {
      getSpy.mockReturnValue('test2')

      expect(messageFromRestrictedChannelGuard.canActivate(contextMock)).toBe(
        false
      )
    })
  })
})
