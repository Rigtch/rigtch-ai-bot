import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(4000),
  DISCORD_BOT_TOKEN: z.coerce.string(),
  CHANNEL_ID: z.coerce.string(),
  LANGCHAIN_TRACING_V2: z.coerce.boolean().optional().default(true),
  LANGCHAIN_CALLBACKS_BACKGROUND: z.coerce.boolean().optional().default(true),
  LANGCHAIN_ENDPOINT: z.coerce.string(),
  LANGCHAIN_API_KEY: z.coerce.string(),
  LANGCHAIN_PROJECT: z.coerce.string(),
  OPENAI_API_KEY: z.coerce.string(),
  GOOGLE_API_KEY: z.coerce.string(),
  GOOGLE_CSE_ID: z.coerce.string(),
  MODEL_TEMPERATURE: z.coerce.number().optional().default(0),
  MODEL_MAX_TOKENS: z.coerce.number().optional().default(4096),
  MODEL_NAME: z.coerce.string().optional().default('gpt-4o-mini'),
  MODEL_TOP_P: z.coerce.number().optional().default(0.5),
  DATABASE_HOST: z.coerce.string(),
  DATABASE_PORT: z.coerce.number().optional().default(5432),
  DATABASE_USERNAME: z.coerce.string(),
  DATABASE_PASSWORD: z.coerce.string(),
  DATABASE_NAME: z.coerce.string(),
})

export type Env = z.infer<typeof envSchema>
