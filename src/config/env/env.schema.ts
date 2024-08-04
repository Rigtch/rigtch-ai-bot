import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(4000),
  DISCORD_BOT_TOKEN: z.string(),
})

export type Env = z.infer<typeof envSchema>
