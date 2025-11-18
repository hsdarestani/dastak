import {
  findBusinessByApiKey,
  findBusinessById,
  findBusinessByTelegramChat
} from '../models/business.model.js'

export const resolveBusinessFromRequest = async (req) => {
  const apiKey = req.headers['x-business-key'] || req.body?.apiKey || req.query?.apiKey
  if (apiKey) {
    const business = await findBusinessByApiKey(apiKey)
    if (business) return business
  }

  const telegramChatId = req.headers['x-telegram-chat-id'] || req.body?.telegramChatId
  if (telegramChatId) {
    const business = await findBusinessByTelegramChat(telegramChatId)
    if (business) return business
  }

  const businessId = req.body?.businessId || req.params?.businessId
  if (businessId) {
    const business = await findBusinessById(businessId)
    if (business) return business
  }

  return null
}
