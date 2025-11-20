import axios from 'axios'
import { config } from '../config/env.js'
import {
  findBusinessById,
  linkTelegramChatByApiKey,
  upsertCustomerBotByApiKey
} from '../models/business.model.js'

const telegramUrlForToken = (token) => `https://api.telegram.org/bot${token}`

export const notifyOwner = async ({ businessId, message }) => {
  const business = await findBusinessById(businessId)
  if (!business) {
    return { delivered: false, reason: 'business not found' }
  }

  const botToken = business.telegram_owner_bot_token || config.telegram.ownerBotToken
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

export const registerTelegramChat = async ({ apiKey, chatId, ownerName, ownerBotToken }) => {
  const business = await linkTelegramChatByApiKey({ apiKey, chatId, ownerName, ownerBotToken })
  if (!business) {
    throw new Error('No business found for provided API key')
  }
  return business
}

export const configureCustomerBot = async ({ apiKey, botToken, botUsername }) => {
  if (!apiKey || !botToken) {
    throw new Error('apiKey and botToken are required')
  }
  const business = await upsertCustomerBotByApiKey({ apiKey, botToken, botUsername })
  if (!business) {
    throw new Error('No business found for provided API key')
  }
  return business
}

export const sendTelegramCustomerMessage = async ({ botToken, chatId, text }) => {
  if (!botToken || !chatId) {
    throw new Error('Missing Telegram bot token or chat id')
  }
  await axios.post(`${telegramUrlForToken(botToken)}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  })
  return { delivered: true }
}
