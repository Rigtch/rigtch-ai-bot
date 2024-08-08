import type { ExecutionContext } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'

import { MessageFromUserGuard } from './message-from-user.guard'

import { messageMockFactory } from '@common/mocks'

describe('MessageFromUserGuard', () => {
  let moduleRef: TestingModule
  let messageFromUserGuard: MessageFromUserGuard

  beforeEach(async () => {
    moduleRef = moduleRef = await Test.createTestingModule({
      providers: [MessageFromUserGuard],
    }).compile()

    messageFromUserGuard = moduleRef.get(MessageFromUserGuard)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(messageFromUserGuard).toBeDefined()
  })

  test('should return true if the message is from a user', () => {
    const message = messageMockFactory({
      bot: false,
    })

    expect(
      messageFromUserGuard.canActivate({
        getArgByIndex: () => message,
      } as unknown as ExecutionContext)
    ).toBe(true)
  })

  test('should return false if the message is from a bot', () => {
    const message = messageMockFactory({
      bot: true,
    })

    expect(
      messageFromUserGuard.canActivate({
        getArgByIndex: () => message,
      } as unknown as ExecutionContext)
    ).toBe(false)
  })
})
