import axios from 'axios'
import { config } from '../config/env.js'

const BASE_URL = 'https://graph.facebook.com/v18.0'

export const sendMessageToInstagram = async ({ threadId, message, accessToken }) => {
  const endpoint = `${BASE_URL}/${threadId}/messages`
  const token = accessToken || config.instagram.accessToken
  if (!token) {
    throw new Error('Instagram access token is missing for this business')
  }
  const payload = {
    messaging_product: 'instagram',
    recipient: { id: threadId },
    message: { text: message },
    access_token: token
  }
  await axios.post(endpoint, payload)
  return { delivered: true }
}
