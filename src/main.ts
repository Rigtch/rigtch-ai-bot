import 'dotenv/config'

import { NestFactory } from '@nestjs/core'

import { EnvService } from '@config/env'
import { AppModule } from '@modules/app'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const envService = app.get(EnvService)

  await app.listen(envService.get('PORT'))
}

bootstrap()
