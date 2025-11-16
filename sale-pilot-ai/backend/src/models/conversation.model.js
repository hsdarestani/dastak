import { query } from './db.js'

export const findOrCreateConversation = async ({ customerId, businessId }) => {
  const res = await query(
    `INSERT INTO conversation (customer_id, business_id, status, mode)
     VALUES ($1, $2, 'active', 'auto')
     ON CONFLICT (customer_id, business_id)
     DO UPDATE SET last_message_at = NOW()
     RETURNING *`,
    [customerId, businessId]
  )
  return res.rows[0]
}

export const createMessage = async ({ conversationId, senderType, text, type = 'text', mediaUrl = null }) => {
  const res = await query(
    `INSERT INTO message (conversation_id, sender_type, text, type, media_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [conversationId, senderType, text, type, mediaUrl]
  )
  return res.rows[0]
}

export const storeAIDecision = async ({ conversationId, summary, intent, recommendedReply, action, confidence }) => {
  const res = await query(
    `INSERT INTO ai_decision (conversation_id, summary, intent, recommended_reply, action, confidence)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [conversationId, summary, intent, recommendedReply, action, confidence]
  )
  return res.rows[0]
}
