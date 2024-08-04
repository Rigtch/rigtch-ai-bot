import { Injectable } from '@nestjs/common'
import type { Env } from './env.schema'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.configService.get<Env[T]>(key, { infer: true })
  }
}
