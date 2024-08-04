import { Module } from '@nestjs/common'
import { BotModule } from '@modules/bot'
import { ConfigModule } from '@nestjs/config'
import { EnvModule, envSchema } from '@config/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.safeParse(env),
      isGlobal: true,
    }),
    EnvModule,
    BotModule,
  ],
})
export class AppModule {}
