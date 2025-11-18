import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const token = process.env.TELEGRAM_BOT_TOKEN
const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000/api'

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is required')
}

const bot = new TelegramBot(token, { polling: true })
const connectedChats = new Map()

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

const linkTelegramChat = async (chat, apiKey) => {
  const ownerName = [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username || 'Telegram User'
  await axios.post(`${backendUrl}/telegram/link`, {
    apiKey,
    chatId: chat.id,
    ownerName
  })
  connectedChats.set(chat.id, apiKey)
}

const ensureConnection = (chatId) => connectedChats.get(chatId)

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'سلام! برای اتصال کسب‌وکار خود دستور `/connect <API_KEY>` را وارد کنید. پس از اتصال می‌توانید منو را استفاده کنید.'
  )
})

bot.onText(/\/connect (.+)/, async (msg, match) => {
  const apiKey = match[1]?.trim()
  if (!apiKey) {
    return bot.sendMessage(msg.chat.id, '❗️ API Key را بعد از دستور وارد کنید.')
  }
  try {
    await linkTelegramChat(msg.chat, apiKey)
    bot.sendMessage(msg.chat.id, '✅ اتصال برقرار شد. اکنون می‌توانید از منو استفاده کنید.')
    sendMenu(msg.chat.id)
  } catch (error) {
    const description = error.response?.data?.error || error.message
    bot.sendMessage(msg.chat.id, `❌ اتصال ناموفق: ${description}`)
  }
})

bot.onText(/\/disconnect/, (msg) => {
  connectedChats.delete(msg.chat.id)
  bot.sendMessage(msg.chat.id, '🔌 اتصال قطع شد. در صورت نیاز دوباره /connect را وارد کنید.')
})

const postWithApiKey = (apiKey, path, body = {}) =>
  axios.post(`${backendUrl}${path}`, body, {
    headers: {
      'X-Business-Key': apiKey
    }
  })

bot.on('message', async (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return

  const apiKey = ensureConnection(msg.chat.id)
  if (!apiKey) {
    return bot.sendMessage(msg.chat.id, 'برای استفاده ابتدا `/connect <API_KEY>` را وارد کنید.')
  }

  if (msg.text === 'Sync WooCommerce') {
    try {
      await postWithApiKey(apiKey, '/products/sync')
      bot.sendMessage(msg.chat.id, 'در حال همگام‌سازی محصولات WooCommerce...')
    } catch (error) {
      bot.sendMessage(msg.chat.id, `خطا در همگام‌سازی: ${error.response?.data?.error || error.message}`)
    }
  } else if (msg.text === 'Latest AI decisions') {
    bot.sendMessage(msg.chat.id, '📊 گزارش تصمیم‌های AI به زودی اضافه می‌شود.')
  } else if (msg.text === 'Resume AI') {
    bot.sendMessage(msg.chat.id, 'حالت خودکار فعال است.')
  }
})

bot.on('polling_error', console.error)
