import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const token = process.env.TELEGRAM_BOT_TOKEN
const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000/api'
const ownerChatId = Number(process.env.OWNER_CHAT_ID)

const bot = new TelegramBot(token, { polling: true })

const sendMenu = (chatId) => {
  bot.sendMessage(chatId, 'SalePilot Dashboard', {
    reply_markup: {
      keyboard: [
        [{ text: 'Sync WooCommerce' }],
        [{ text: 'Latest AI decisions' }],
        [{ text: 'Resume AI' }]
      ],
      resize_keyboard: true
    }
  })
}

bot.onText(/\/start/, (msg) => {
  if (msg.chat.id !== ownerChatId) return
  sendMenu(msg.chat.id)
})

bot.on('message', async (msg) => {
  if (msg.chat.id !== ownerChatId || !msg.text) return

  if (msg.text === 'Sync WooCommerce') {
    await axios.post(`${backendUrl}/products/sync`, { businessId: 1 })
    bot.sendMessage(ownerChatId, 'در حال همگام سازی محصولات...')
  } else if (msg.text === 'Latest AI decisions') {
    bot.sendMessage(ownerChatId, 'به زودی گزارش تصمیم‌های AI اضافه می‌شود.')
  } else if (msg.text === 'Resume AI') {
    bot.sendMessage(ownerChatId, 'حالت خودکار دوباره فعال شد.')
  }
})

bot.on('polling_error', console.error)
