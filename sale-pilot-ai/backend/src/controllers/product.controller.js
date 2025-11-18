import { fetchProducts } from '../services/woo.service.js'
import { upsertProducts } from '../models/product.model.js'
import { resolveBusinessFromRequest } from '../utils/business-context.js'

export const syncProducts = async (req, res, next) => {
  try {
    const business = await resolveBusinessFromRequest(req)
    if (!business) {
      return res.status(404).json({ error: 'Business context missing. Provide X-Business-Key, telegramChatId or businessId.' })
    }

    const products = await fetchProducts(business)
    const stored = await upsertProducts(business.id, products)
    res.json({ count: stored.length })
  } catch (error) {
    next(error)
  }
}
