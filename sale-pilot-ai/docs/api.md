# SalePilot API

## POST /api/products/sync
Sync WooCommerce catalogue.
```json
{
  "businessId": 1
}
```
Response `{ "count": 120 }`

## POST /api/webhooks/instagram
Incoming message payload (simplified).
```json
{
  "business_id": 1,
  "customer_id": "178",
  "thread_id": "t_123",
  "owner_chat_id": 1234567,
  "message": { "text": "سلام قیمت؟" }
}
```
Response includes AI decision and action.

## POST /api/ai/decision
Provides manual access to the AI engine.
```json
{
  "conversation": [{"sender":"customer","text":"قیمت چنده؟"}],
  "products": [{"name":"تی شرت"}]
}
```

## POST /api/messages/send
Send final messages after owner approval.
```json
{
  "threadId": "t_123",
  "conversationId": 42,
  "text": "پیام تایید شده"
}
```

## POST /api/telegram/notify
Trigger warnings to store owner.
```json
{
  "chatId": 123,
  "message": "🚨 مشتری پشتیبانی انسانی می‌خواهد"
}
```
