import 'dotenv/config'

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { EnvService } from '@config/env'
import { AppModule } from '@modules/app'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const envService = app.get(EnvService)

  const documentConfig = new DocumentBuilder()
    .setTitle('Henry Chat API')
    .build()

  const document = SwaggerModule.createDocument(app, documentConfig)

  SwaggerModule.setup('api', app, document)

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  await app.listen(envService.get('PORT'))
}

bootstrap()
