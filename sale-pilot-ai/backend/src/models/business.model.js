import { query } from './db.js'

export const findBusinessById = async (businessId) => {
  const res = await query('SELECT * FROM business WHERE id = $1', [businessId])
  return res.rows[0]
}

export const findBusinessByApiKey = async (apiKey) => {
  const res = await query('SELECT * FROM business WHERE api_key = $1', [apiKey])
  return res.rows[0]
}

export const findBusinessByInstagramPage = async (pageId) => {
  if (!pageId) return null
  const res = await query('SELECT * FROM business WHERE ig_page_id = $1 OR ig_business_id = $1', [pageId])
  return res.rows[0]
}

export const findBusinessByTelegramChat = async (chatId) => {
  if (!chatId) return null
  const res = await query('SELECT * FROM business WHERE telegram_chat_id = $1', [chatId])
  return res.rows[0]
}

export const linkTelegramChatByApiKey = async ({ apiKey, chatId, ownerName }) => {
  const res = await query(
    `UPDATE business
     SET telegram_chat_id = $2,
         telegram_owner_name = COALESCE($3, telegram_owner_name),
         updated_at = NOW()
     WHERE api_key = $1
     RETURNING *`,
    [apiKey, chatId, ownerName]
  )
  return res.rows[0]
}

export const upsertBusinessWooCommerce = async ({ id, wcUrl, wcKey, wcSecret }) => {
  const res = await query(
    `UPDATE business SET wc_url = $2, wc_key = $3, wc_secret = $4, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, wcUrl, wcKey, wcSecret]
  )
  return res.rows[0]
}

export const upsertBusinessInstagram = async ({ id, igBusinessId, igPageId, igAccessToken }) => {
  const res = await query(
    `UPDATE business
     SET ig_business_id = $2,
         ig_page_id = $3,
         ig_access_token = $4,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, igBusinessId, igPageId, igAccessToken]
  )
  return res.rows[0]
}
