import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common'
import type { Message } from 'discord.js'

import { EnvService } from '@config/env'

@Injectable()
export class MessageFromRestrictedChannelGuard implements CanActivate {
  constructor(private readonly envService: EnvService) {}

  canActivate(context: ExecutionContext) {
    const message = context.getArgByIndex<Message>(0)

    return message.channel.id === this.envService.get('CHANNEL_ID')
  }
}
