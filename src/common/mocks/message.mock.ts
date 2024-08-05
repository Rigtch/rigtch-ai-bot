import type { Message, TextBasedChannel, User } from 'discord.js'
import { mock } from 'vitest-mock-extended'

export const messageMockFactory = (
  author: Partial<Omit<User, 'toString' | 'valueOf'>>,
  content?: string,
  channel?: Partial<Omit<TextBasedChannel, 'toString' | 'valueOf'>>,
  reply?: () => Promise<Message<true>>
) =>
  mock({
    content,
    author,
    channel,
    reply,
  } as unknown as Message<true>)
