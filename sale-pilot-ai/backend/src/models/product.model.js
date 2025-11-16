import { query } from './db.js'

export const upsertProducts = async (businessId, products) => {
  const insertQuery = `
    INSERT INTO product (business_id, wc_product_id, name, price, stock_status, category, image, attributes_json)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (business_id, wc_product_id)
    DO UPDATE SET name = EXCLUDED.name,
                  price = EXCLUDED.price,
                  stock_status = EXCLUDED.stock_status,
                  category = EXCLUDED.category,
                  image = EXCLUDED.image,
                  attributes_json = EXCLUDED.attributes_json
    RETURNING *
  `

  const promises = products.map(p => query(insertQuery, [
    businessId,
    p.id,
    p.name,
    p.price,
    p.stock_status,
    p.category,
    p.image,
    JSON.stringify(p.attributes || {})
  ]))

  const results = await Promise.all(promises)
  return results.map(r => r.rows[0])
}

export const findProductsByKeyword = async (businessId, keyword) => {
  const res = await query(
    `SELECT * FROM product WHERE business_id = $1 AND (name ILIKE $2 OR category ILIKE $2) ORDER BY similarity(name, $3) DESC LIMIT 5`,
    [businessId, `%${keyword}%`, keyword]
  )
  return res.rows
}
