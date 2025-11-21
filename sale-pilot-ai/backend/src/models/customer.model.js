import { query } from './db.js'

export const findOrCreateCustomer = async ({ channel, externalId, name, username }) => {
  const existing = await query(
    'SELECT * FROM customer WHERE channel = $1 AND external_id = $2',
    [channel, externalId]
  )
  if (existing.rows[0]) return existing.rows[0]

  const res = await query(
    `INSERT INTO customer (channel, external_id, name, username)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (channel, external_id)
     DO UPDATE SET name = COALESCE(EXCLUDED.name, customer.name),
                   username = COALESCE(EXCLUDED.username, customer.username)
     RETURNING *`,
    [channel, externalId, name, username]
  )
  return res.rows[0]
}
