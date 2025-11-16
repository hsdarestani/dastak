import axios from 'axios'
import { config } from '../config/env.js'

const BASE_URL = 'https://graph.facebook.com/v18.0'

export const sendMessageToInstagram = async ({ threadId, message }) => {
  const endpoint = `${BASE_URL}/${threadId}/messages`
  const payload = {
    messaging_product: 'instagram',
    recipient: { id: threadId },
    message: { text: message },
    access_token: config.instagram.accessToken
  }
  await axios.post(endpoint, payload)
  return { delivered: true }
}
