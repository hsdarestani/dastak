import axios from 'axios'
import crypto from 'crypto'
import { config } from '../config/env.js'

const buildAuthQuery = () => {
  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = crypto.randomBytes(8).toString('hex')
  return {
    consumer_key: config.wooCommerce.key,
    consumer_secret: config.wooCommerce.secret,
    timestamp,
    nonce
  }
}

export const fetchProducts = async () => {
  const params = new URLSearchParams(buildAuthQuery())
  const endpoint = `${config.wooCommerce.url}/wp-json/wc/v3/products?${params.toString()}`
  const { data } = await axios.get(endpoint)
  return data.map(product => ({
    id: product.id,
    name: product.name,
    price: Number(product.price || product.regular_price || 0),
    stock_status: product.stock_status,
    category: product.categories?.map(c => c.name).join(', ') || 'General',
    image: product.images?.[0]?.src,
    attributes: product.attributes
  }))
}
