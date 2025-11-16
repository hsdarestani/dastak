import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  wooCommerce: {
    url: process.env.WOOCOMMERCE_URL,
    key: process.env.WOOCOMMERCE_KEY,
    secret: process.env.WOOCOMMERCE_SECRET
  },
  instagram: {
    appId: process.env.INSTAGRAM_APP_ID,
    appSecret: process.env.INSTAGRAM_APP_SECRET,
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'rules',
    openAiKey: process.env.OPENAI_API_KEY,
    businessTone: process.env.BUSINESS_RULES_TONE || 'Friendly'
  }
}
