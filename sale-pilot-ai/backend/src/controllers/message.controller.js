import { sendMessageToInstagram } from '../services/insta.service.js'
import { createMessage } from '../models/conversation.model.js'
import { resolveBusinessFromRequest } from '../utils/business-context.js'

export const sendMessage = async (req, res, next) => {
  try {
    const { threadId, conversationId, text } = req.body
    if (!threadId || !conversationId || !text) {
      return res.status(400).json({ error: 'threadId, conversationId and text are required' })
    }

    const business = await resolveBusinessFromRequest(req)
    if (!business) {
      return res.status(404).json({ error: 'Business context missing. Provide X-Business-Key, telegramChatId or businessId.' })
    }

    await sendMessageToInstagram({ threadId, message: text, accessToken: business.ig_access_token })
    await createMessage({ conversationId, senderType: 'business', text })
    res.json({ delivered: true })
  } catch (error) {
    next(error)
  }
}
