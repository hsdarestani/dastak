import { fetchProducts } from '../services/woo.service.js'
import { upsertProducts } from '../models/product.model.js'

export const syncProducts = async (req, res, next) => {
  try {
    const businessId = req.body.businessId || 1
    const products = await fetchProducts()
    const stored = await upsertProducts(businessId, products)
    res.json({ count: stored.length })
  } catch (error) {
    next(error)
  }
}
