import { notifyOwner } from '../services/telegram.service.js'

export const notify = async (req, res, next) => {
  try {
    const { chatId, message } = req.body
    const response = await notifyOwner({ chatId, message })
    res.json(response)
  } catch (error) {
    next(error)
  }
}
