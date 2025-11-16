import { sendMessageToInstagram } from '../services/insta.service.js'
import { createMessage } from '../models/conversation.model.js'

export const sendMessage = async (req, res, next) => {
  try {
    const { threadId, conversationId, text } = req.body
    if (!threadId || !conversationId || !text) {
      return res.status(400).json({ error: 'threadId, conversationId and text are required' })
    }
    await sendMessageToInstagram({ threadId, message: text })
    await createMessage({ conversationId, senderType: 'business', text })
    res.json({ delivered: true })
  } catch (error) {
    next(error)
  }
}
