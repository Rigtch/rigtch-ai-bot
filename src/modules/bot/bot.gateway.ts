import { InjectDiscordClient, Once } from '@discord-nestjs/core'
import { Injectable, Logger } from '@nestjs/common'
import { ActivityType, type Client } from 'discord.js'

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name)

  constructor(@InjectDiscordClient() private readonly client: Client<true>) {}

  @Once('ready')
  onReady() {
    this.client.user.setPresence({
      activities: [
        {
          type: ActivityType.Listening,
          name: 'your musical questions...',
          url: 'https://rigtch-fm.vercel.app',
        },
      ],
    })

    this.logger.log(`Logged in as ${this.client.user.tag}!`)
  }
}
