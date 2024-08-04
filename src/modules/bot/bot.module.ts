import { EnvModule, EnvService } from '@config/env'
import { DiscordModule } from '@discord-nestjs/core'
import { Module } from '@nestjs/common'
import { GatewayIntentBits } from 'discord.js'

@Module({
  imports: [
    DiscordModule.forRootAsync({
      useFactory: (envService: EnvService) => ({
        token: envService.get('DISCORD_BOT_TOKEN'),
        discordClientOptions: {
          intents: [GatewayIntentBits.Guilds],
        },
      }),
      inject: [EnvService],
      imports: [EnvModule],
    }),
  ],
})
export class BotModule {}
