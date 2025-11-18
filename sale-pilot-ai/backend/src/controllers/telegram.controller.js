import { notifyOwner, registerTelegramChat } from '../services/telegram.service.js'

export const notify = async (req, res, next) => {
  try {
    const { businessId, message } = req.body
    if (!businessId || !message) {
      return res.status(400).json({ error: 'businessId and message are required' })
    }
    const response = await notifyOwner({ businessId, message })
    res.json(response)
  } catch (error) {
    next(error)
  }
}

export const linkTelegram = async (req, res, next) => {
  try {
    const { apiKey, chatId, ownerName } = req.body
    if (!apiKey || !chatId) {
      return res.status(400).json({ error: 'apiKey and chatId are required' })
    }
    const business = await registerTelegramChat({ apiKey, chatId, ownerName })
    res.json({ linked: true, businessId: business.id })
  } catch (error) {
    next(error)
  }
}
