import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { Message } from 'discord.js'

export async function getChannelMessagesHistory(
  data: unknown,
  context: ExecutionContext
) {
  const message = context.getArgByIndex<Message<true>>(0)

  return await message.channel.messages.fetch()
}

export const ChannelMessagesHistory = createParamDecorator(
  getChannelMessagesHistory
)
