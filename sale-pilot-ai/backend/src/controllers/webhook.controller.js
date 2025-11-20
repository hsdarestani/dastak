import { findOrCreateConversation, createMessage } from '../models/conversation.model.js'
import { findProductsByKeyword } from '../models/product.model.js'
import { runAIDecision } from '../services/ai.service.js'
import { sendMessageToInstagram } from '../services/insta.service.js'
import { notifyOwner, sendTelegramCustomerMessage } from '../services/telegram.service.js'
import { config } from '../config/env.js'
import {
  findBusinessByApiKey,
  findBusinessById,
  findBusinessByInstagramPage,
  findBusinessByCustomerBotToken
} from '../models/business.model.js'
import { findOrCreateCustomer } from '../models/customer.model.js'

const resolveBusinessFromPayload = async (payload) => {
  if (!payload) return null
  if (payload.business_api_key) {
    const business = await findBusinessByApiKey(payload.business_api_key)
    if (business) return business
  }

  const instagramPageId =
    payload.instagram_page_id || payload.page_id || payload.ig_page_id || payload.meta?.instagram_page_id
  if (instagramPageId) {
    const business = await findBusinessByInstagramPage(instagramPageId)
    if (business) return business
  }

  if (payload.business_id) {
    const business = await findBusinessById(payload.business_id)
    if (business) return business
  }

  return null
}

export const instagramWebhook = async (req, res, next) => {
  try {
    const payload = req.body
    const business = await resolveBusinessFromPayload(payload)
    if (!business) {
      return res.status(404).json({ error: 'Business not found for incoming webhook payload' })
    }

    const businessId = business.id
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
      await sendMessageToInstagram({
        threadId: payload.thread_id,
        message: aiDecision.recommended_reply,
        accessToken: business.ig_access_token
      })
    } else if (aiDecision.action === 'human') {
      await notifyOwner({ businessId, message: '🚨 مشتری درخواست پشتیبانی انسانی دارد' })
    }

    res.json({ status: 'ok', decision: aiDecision })
  } catch (error) {
    next(error)
  }
}

export const telegramCustomerWebhook = async (req, res, next) => {
  try {
    const botToken = req.params.botToken || req.query.botToken
    const business = await findBusinessByCustomerBotToken(botToken)
    if (!business) {
      return res.status(404).json({ error: 'Business not found for provided Telegram bot token' })
    }

    const update = req.body
    const message = update?.message
    const chat = message?.chat
    const text = message?.text?.trim()

    if (!chat || !text) {
      return res.json({ status: 'ignored' })
    }

    const customer = await findOrCreateCustomer({
      channel: 'telegram',
      externalId: String(chat.id),
      name: [chat.first_name, chat.last_name].filter(Boolean).join(' ').trim() || chat.username,
      username: chat.username
    })
    const conversation = await findOrCreateConversation({ customerId: customer.id, businessId: business.id })
    await createMessage({ conversationId: conversation.id, senderType: 'customer', text })

    const products = await findProductsByKeyword(business.id, text)
    const aiDecision = await runAIDecision({
      conversation: [{ sender: 'customer', text }],
      products,
      businessRules: { tone: config.ai.businessTone }
    })

    if (aiDecision.action === 'auto') {
      await sendTelegramCustomerMessage({ botToken, chatId: chat.id, text: aiDecision.recommended_reply })
    } else if (aiDecision.action === 'human') {
      await notifyOwner({ businessId: business.id, message: '🚨 مشتری تلگرام درخواست پشتیبانی انسانی دارد' })
    }

    res.json({ status: 'ok', decision: aiDecision })
  } catch (error) {
    next(error)
  }
}
