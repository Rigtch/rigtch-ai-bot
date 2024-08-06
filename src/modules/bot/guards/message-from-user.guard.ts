import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Message } from 'discord.js'

export class MessageFromUserGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const message = context.getArgByIndex<Message>(0)

    return !message.author.bot
  }
}
