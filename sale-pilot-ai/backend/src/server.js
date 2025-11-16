import app from './app.js'
import { config } from './config/env.js'
import logger from './utils/logger.js'

const start = () => {
  app.listen(config.port, () => {
    logger.info(`SalePilot backend listening on port ${config.port}`)
  })
}

start()
