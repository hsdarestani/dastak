import pg from 'pg'
import { config } from '../config/env.js'
import logger from '../utils/logger.js'

const { Pool } = pg

const pool = new Pool({
  connectionString: config.databaseUrl
})

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected PG error')
})

export const query = async (text, params) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  logger.debug({ text, duration, rows: res.rowCount }, 'Executed query')
  return res
}

export default pool
