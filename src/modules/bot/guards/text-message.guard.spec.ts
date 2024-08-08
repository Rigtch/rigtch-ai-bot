import { Test, type TestingModule } from '@nestjs/testing'
import { mock } from 'vitest-mock-extended'
import { Collection, type Message } from 'discord.js'

import { TextMessageGuard } from './text-message.guard'

import { contextMockFactory, messageMockFactory } from '@common/mocks'

describe('TextMessageGuard', () => {
  let moduleRef: TestingModule
  let textMessageGuard: TextMessageGuard

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [TextMessageGuard],
    }).compile()

    textMessageGuard = moduleRef.get(TextMessageGuard)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(textMessageGuard).toBeDefined()
  })

  describe('canActivate', () => {
    test('should return false if message content is empty', () => {
      const messageMock = messageMockFactory({}, '')

      expect(
        textMessageGuard.canActivate(contextMockFactory(messageMock))
      ).toEqual(false)
    })

    test('should return false if message content starts with <:', () => {
      const messageMock = messageMockFactory({}, '<:test:12345678901234567890>')

      expect(
        textMessageGuard.canActivate(contextMockFactory(messageMock))
      ).toEqual(false)
    })

    test('should return false if the message is an embedded message', () => {
      const messageMock = mock({
        embeds: [{}],
        stickers: new Collection(),
        content: '',
      } as unknown as Message)

      expect(
        textMessageGuard.canActivate(contextMockFactory(messageMock))
      ).toEqual(false)
    })

    test('should return false if the message includes a sticker', () => {
      const messageMock = mock({
        embeds: [],
        stickers: new Collection([['1', {}]]),
        content: '',
      } as unknown as Message)

      expect(
        textMessageGuard.canActivate(contextMockFactory(messageMock))
      ).toEqual(false)
    })

    test('should return true if the message is not an embedded message', () => {
      const messageMock = mock({
        embeds: [],
        stickers: new Collection(),
        content: 'hello',
      } as unknown as Message)

      expect(
        textMessageGuard.canActivate(contextMockFactory(messageMock))
      ).toEqual(true)
    })
  })
})
