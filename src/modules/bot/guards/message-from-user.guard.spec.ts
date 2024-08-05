import { Message } from 'discord.js'
import { mock } from 'vitest-mock-extended'
import type { ExecutionContext } from '@nestjs/common'

import { MessageFromUserGuard } from './message-from-user.guard'

const messageMockFactory = (isBot: boolean) =>
  mock({
    author: {
      bot: isBot,
    },
  } as Message<true>)

describe('MessageFromUserGuard', () => {
  let messageFromUserGuard: MessageFromUserGuard

  beforeEach(() => {
    messageFromUserGuard = new MessageFromUserGuard()
  })

  test('should be defined', () => {
    expect(messageFromUserGuard).toBeDefined()
  })

  test('should return true if the message is from a user', () => {
    const message = messageMockFactory(false)

    expect(
      messageFromUserGuard.canActivate({
        getArgByIndex: () => message,
      } as unknown as ExecutionContext)
    ).toBe(true)
  })

  test('should return false if the message is from a bot', () => {
    const message = messageMockFactory(true)

    expect(
      messageFromUserGuard.canActivate({
        getArgByIndex: () => message,
      } as unknown as ExecutionContext)
    ).toBe(false)
  })
})
