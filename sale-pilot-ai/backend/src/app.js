import express from 'express'
import routes from './api/routes.js'
import logger from './utils/logger.js'

const app = express()
app.use(express.json())
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request')
  next()
})
app.use('/api', routes)

app.use((err, req, res, next) => {
  logger.error({ err }, 'API error')
  res.status(500).json({ error: err.message })
})

export default app
