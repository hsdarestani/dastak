import { findOrCreateConversation, createMessage } from '../models/conversation.model.js'
import { findProductsByKeyword } from '../models/product.model.js'
import { runAIDecision } from '../services/ai.service.js'
import { sendMessageToInstagram } from '../services/insta.service.js'
import { notifyOwner } from '../services/telegram.service.js'
import { config } from '../config/env.js'

export const instagramWebhook = async (req, res, next) => {
  try {
    const payload = req.body
    const businessId = payload.business_id || 1
    const customerId = payload.customer_id
    const messageText = payload.message?.text || ''
    const conversation = await findOrCreateConversation({ customerId, businessId })
    await createMessage({ conversationId: conversation.id, senderType: 'customer', text: messageText })

    const products = await findProductsByKeyword(businessId, messageText)
    const aiDecision = await runAIDecision({
      conversation: [{ sender: 'customer', text: messageText }],
      products,
      businessRules: { tone: config.ai.businessTone }
    })

    if (aiDecision.action === 'auto') {
      await sendMessageToInstagram({ threadId: payload.thread_id, message: aiDecision.recommended_reply })
    } else if (aiDecision.action === 'human') {
      await notifyOwner({ chatId: payload.owner_chat_id, message: '🚨 مشتری درخواست پشتیبانی انسانی دارد' })
    }

    res.json({ status: 'ok', decision: aiDecision })
  } catch (error) {
    next(error)
  }
}
