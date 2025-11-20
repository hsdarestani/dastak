import axios from 'axios'
import crypto from 'crypto'

const buildAuthQuery = (business) => {
  const timestamp = Math.floor(Date.now() / 1000)
  const nonce = crypto.randomBytes(8).toString('hex')
  const key = business?.wc_key
  const secret = business?.wc_secret
  if (!key || !secret) {
    throw new Error('WooCommerce credentials are missing for this business')
  }
  return {
    consumer_key: key,
    consumer_secret: secret,
    timestamp,
    nonce
  }
}

export const fetchProducts = async (business) => {
  const baseUrl = business?.wc_url
  if (!baseUrl) {
    throw new Error('WooCommerce URL missing for this business')
  }
  const params = new URLSearchParams(buildAuthQuery(business))
  const endpoint = `${baseUrl}/wp-json/wc/v3/products?${params.toString()}`
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
