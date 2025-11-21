import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import routes from './api/routes.js'
import logger from './utils/logger.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDir))
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request')
  next()
})
app.use('/api', routes)

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})

app.use((err, req, res, next) => {
  logger.error({ err }, 'API error')
  res.status(500).json({ error: err.message })
})

export default app
