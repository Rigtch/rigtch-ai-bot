import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(4000),
  DISCORD_BOT_TOKEN: z.coerce.string(),
  LANGCHAIN_TRACING_V2: z.coerce.boolean().optional().default(true),
  LANGCHAIN_CALLBACKS_BACKGROUND: z.coerce.boolean().optional().default(true),
  LANGCHAIN_ENDPOINT: z.coerce.string(),
  LANGCHAIN_API_KEY: z.coerce.string(),
  LANGCHAIN_PROJECT: z.coerce.string(),
  OPENAI_API_KEY: z.coerce.string(),
  SERPAPI_API_KEY: z.coerce.string(),
  MODEL_TEMPERATURE: z.coerce.number().optional().default(0),
  MODEL_MAX_TOKENS: z.coerce.number().optional().default(4096),
  MODEL_NAME: z.coerce.string().optional().default('gpt-4o-mini'),
})

export type Env = z.infer<typeof envSchema>
