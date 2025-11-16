import { query } from './db.js'

export const findBusinessById = async (businessId) => {
  const res = await query('SELECT * FROM business WHERE id = $1', [businessId])
  return res.rows[0]
}

export const upsertBusinessWooCommerce = async ({ id, wcUrl, wcKey, wcSecret }) => {
  const res = await query(
    `UPDATE business SET wc_url = $2, wc_key = $3, wc_secret = $4 WHERE id = $1 RETURNING *`,
    [id, wcUrl, wcKey, wcSecret]
  )
  return res.rows[0]
}
