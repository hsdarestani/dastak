import axios from 'axios'
import { config } from '../config/env.js'

const TELEGRAM_URL = `https://api.telegram.org/bot${config.telegram.botToken}`

export const notifyOwner = async ({ chatId, message }) => {
  if (!config.telegram.botToken) {
    return { delivered: false, reason: 'telegram bot token missing' }
  }
  await axios.post(`${TELEGRAM_URL}/sendMessage`, {
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown'
  })
  return { delivered: true }
}
