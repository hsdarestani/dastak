import { runAIDecision } from '../services/ai.service.js'
import { config } from '../config/env.js'

export const decisionEndpoint = async (req, res, next) => {
  try {
    const { conversation = [], products = [] } = req.body
    const decision = await runAIDecision({
      conversation,
      products,
      businessRules: { tone: config.ai.businessTone }
    })
    res.json(decision)
  } catch (error) {
    next(error)
  }
}
