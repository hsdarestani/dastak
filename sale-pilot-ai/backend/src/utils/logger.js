import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:standard'
    }
  }
})

export default logger
