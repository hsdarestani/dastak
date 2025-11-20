# SalePilot API

## احراز هویت چند-مشتریه
همه Endpoint های مدیریتی از یکی از کانتکست‌های زیر برای تشخیص مشتری استفاده می‌کنند:

- هدر `X-Business-Key` (مقدار `business.api_key`).
- هدر `X-Telegram-Chat-Id` (وقتی درخواست از Bot می‌آید).
- فیلد `businessId` در بدنه (برای فراخوانی‌های داخلی).

در محیط Production پیشنهاد می‌شود همیشه از هدر `X-Business-Key` استفاده شود.

## POST /api/products/sync
Sync WooCommerce catalogue برای مشتری مشخص.

Headers:
```
X-Business-Key: <business.api_key>
```

Response `{ "count": 120 }`

## POST /api/webhooks/instagram
Incoming message payload (simplified).
```json
{
  "business_api_key": "salepilot_xxx",
  "instagram_page_id": "1789",
  "customer_id": "178",
  "thread_id": "t_123",
  "message": { "text": "سلام قیمت؟" }
}
```
Response includes AI decision and action.

## POST /api/webhooks/telegram/:botToken
Webhook مخصوص ربات تلگرام هر فروشگاه (botToken همان `telegram_customer_bot_token` در جدول business است).
Payload خام آپدیت تلگرام دریافت می‌شود؛ بدنه رایج:
```json
{
  "update_id": 123,
  "message": {
    "message_id": 5,
    "chat": {"id": 99887766, "first_name": "Sara", "username": "sara_customer"},
    "text": "سلام قیمت؟"
  }
}
```
هوش مصنوعی تصمیم می‌گیرد پاسخ خودکار بفرستد یا هشدار human handover به مالک بدهد.

## POST /api/telegram/bot
ثبت یا بروزرسانی توکن ربات تلگرام مشتریان برای هر فروشگاه.
```json
{
  "apiKey": "salepilot_xxx",
  "botToken": "12345:BOT",
  "botUsername": "@shop_bot"
}
```

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
Headers: `X-Business-Key`

```json
{
  "threadId": "t_123",
  "conversationId": 42,
  "text": "پیام تایید شده"
}
```

## POST /api/telegram/notify
Trigger warnings to store owner. فراخوانی داخلی سرور.
```json
{
  "businessId": 3,
  "message": "🚨 مشتری پشتیبانی انسانی می‌خواهد"
}
```

## POST /api/telegram/link
Link یا بروزرسانی chat id تلگرام برای یک مشتری.
```json
{
  "apiKey": "salepilot_xxx",
  "chatId": 123456789,
  "ownerName": "Ali"
}
```
Response `{ "linked": true, "businessId": 3 }`
