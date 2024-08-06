import { DiscordModule } from '@discord-nestjs/core'
import { Module } from '@nestjs/common'
import { GatewayIntentBits } from 'discord.js'

import { BotGateway } from './bot.gateway'
import { BotChatModule } from './chat'

import { EnvModule, EnvService } from '@config/env'

@Module({
  imports: [
    BotChatModule,
    DiscordModule.forRootAsync({
      useFactory: (envService: EnvService) => ({
        token: envService.get('DISCORD_BOT_TOKEN'),
        discordClientOptions: {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages,
          ],
        },
      }),
      inject: [EnvService],
      imports: [EnvModule],
    }),
  ],
  providers: [BotGateway],
})
export class BotModule {}
