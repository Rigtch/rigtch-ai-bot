import { InjectDiscordClient, Once } from '@discord-nestjs/core'
import { Injectable, Logger } from '@nestjs/common'
import type { Client } from 'discord.js'

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name)

  constructor(@InjectDiscordClient() private readonly client: Client) {}

  @Once('ready')
  onceReady() {
    this.logger.log(`Logged in as ${this.client.user?.tag}!`)
  }
}
