import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  telegram: {
    ownerBotToken: process.env.TELEGRAM_OWNER_BOT_TOKEN
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'rules',
    openAiKey: process.env.OPENAI_API_KEY,
    businessTone: process.env.BUSINESS_RULES_TONE || 'Friendly'
  }
}
