const detectIntent = (text) => {
  const normalized = text.toLowerCase()
  if (normalized.includes('قیمت') || normalized.includes('price')) return 'price_inquiry'
  if (normalized.includes('سایز') || normalized.includes('size')) return 'size'
  if (normalized.includes('رنگ') || normalized.includes('variant')) return 'variant'
  if (normalized.includes('ناراضی') || normalized.includes('شکایت') || normalized.includes('complaint')) return 'complaint'
  if (normalized.includes('انسان') || normalized.includes('human')) return 'human'
  return 'general'
}

const determineAction = (intent, confidence) => {
  if (intent === 'human') return 'human'
  if (confidence > 0.8) return 'auto'
  if (intent === 'complaint') return 'semi'
  return confidence > 0.6 ? 'auto' : 'semi'
}

export const runAIDecision = async ({ conversation, products, businessRules }) => {
  const latest = conversation.at(-1)?.text || ''
  const intent = detectIntent(latest)
  const topProduct = products?.[0]
  const confidence = Math.min(0.95, 0.5 + (products?.length || 0) * 0.1)
  const action = determineAction(intent, confidence)
  const summary = conversation.slice(-5).map(m => `${m.sender}: ${m.text}`).join(' \n')

  let recommendedReply = businessRules?.tone || 'سلام!'
  if (topProduct) {
    recommendedReply += ` پیشنهاد می‌کنم ${topProduct.name} را با قیمت ${topProduct.price} تهیه کنید.`
  }
  recommendedReply += ' اگر سوال دیگری دارید بپرسید.'

  return {
    summary,
    intent,
    recommended_reply: recommendedReply,
    action,
    confidence
  }
}
