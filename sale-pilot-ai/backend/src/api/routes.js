import { Router } from 'express'
import { syncProducts } from '../controllers/product.controller.js'
import { instagramWebhook, telegramCustomerWebhook } from '../controllers/webhook.controller.js'
import { decisionEndpoint } from '../controllers/ai.controller.js'
import { sendMessage } from '../controllers/message.controller.js'
import { linkTelegram, notify, saveCustomerBot } from '../controllers/telegram.controller.js'

const router = Router()

router.get('/health', (req, res) => res.json({ status: 'ok' }))
router.post('/products/sync', syncProducts)
router.post('/webhooks/instagram', instagramWebhook)
router.post('/webhooks/telegram/:botToken', telegramCustomerWebhook)
router.post('/ai/decision', decisionEndpoint)
router.post('/messages/send', sendMessage)
router.post('/telegram/notify', notify)
router.post('/telegram/link', linkTelegram)
router.post('/telegram/bot', saveCustomerBot)

export default router
