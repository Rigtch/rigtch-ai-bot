import type { Message, User } from 'discord.js'
import { mock } from 'vitest-mock-extended'

export const messageMockFactory = (
  author: Partial<Omit<User, 'toString' | 'valueOf'>>,
  content?: string
) =>
  mock({
    content,
    author,
  } as Message<true>)
