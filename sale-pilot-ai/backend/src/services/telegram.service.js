import axios from 'axios'
import { config } from '../config/env.js'
import { findBusinessById, linkTelegramChatByApiKey } from '../models/business.model.js'

const telegramUrlForToken = (token) => `https://api.telegram.org/bot${token}`

export const notifyOwner = async ({ businessId, message }) => {
  const business = await findBusinessById(businessId)
  if (!business) {
    return { delivered: false, reason: 'business not found' }
  }

  const botToken = config.telegram.botToken
  const chatId = business.telegram_chat_id
  if (!botToken || !chatId) {
    return { delivered: false, reason: 'telegram bot token or chat id missing' }
  }

  await axios.post(`${telegramUrlForToken(botToken)}/sendMessage`, {
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown'
  })
  return { delivered: true }
}

export const registerTelegramChat = async ({ apiKey, chatId, ownerName }) => {
  const business = await linkTelegramChatByApiKey({ apiKey, chatId, ownerName })
  if (!business) {
    throw new Error('No business found for provided API key')
  }
  return business
}
