import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Message } from 'discord.js'

export class TextMessageGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { stickers, embeds, content } = context.getArgByIndex<Message>(0)

    if (!content) return false

    if (content.startsWith('<:') && content.endsWith('>')) return false

    return embeds.length === 0 && stickers.size === 0
  }
}
