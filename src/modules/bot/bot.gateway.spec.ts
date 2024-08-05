import { Test, TestingModule } from '@nestjs/testing'
import { INJECT_DISCORD_CLIENT } from '@discord-nestjs/core'
import { Logger } from '@nestjs/common'
import { ActivityType } from 'discord.js'

import { BotGateway } from './bot.gateway'

vi.mock('@nejs/common')

describe('BotGateway', () => {
  const testClientUserTag = 'Test'

  const setPresenceSpy = vi.fn()

  let moduleRef: TestingModule
  let botGateway: BotGateway

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        BotGateway,
        {
          provide: INJECT_DISCORD_CLIENT as string,
          useValue: {
            user: {
              tag: testClientUserTag,
              setPresence: setPresenceSpy,
            },
          },
        },
      ],
    }).compile()

    botGateway = moduleRef.get(BotGateway)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  test('should be defined', () => {
    expect(botGateway).toBeDefined()
  })

  test('should log in as the client user tag and set presence', () => {
    const logSpy = vi.spyOn(Logger.prototype, 'log')

    botGateway.onReady()

    expect(logSpy).toHaveBeenCalledWith(`Logged in as ${testClientUserTag}!`)
    expect(setPresenceSpy).toHaveBeenCalledWith({
      activities: [
        {
          type: ActivityType.Listening,
          name: 'your musical questions...',
          url: 'https://rigtch-fm.vercel.app',
        },
      ],
    })
  })
})
