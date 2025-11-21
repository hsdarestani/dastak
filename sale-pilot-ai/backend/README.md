# SalePilot Backend

Backend Node.js/Express service powering SalePilot AI assistant. Provides connectors for WooCommerce, Instagram webhook handling,
Telegram (owner notifications + customer-facing bots) and a rule-based AI decision engine.

## Getting Started

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

`.env` only contains platform-wide values (port, database, AI provider, optional owner bot token). WooCommerce, Instagram و توکن ربات‌های تلگرام برای هر مشتری داخل رکورد جدول `business` ذخیره می‌شوند.

## Key Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/products/sync` | Fetch WooCommerce products (requires `X-Business-Key` header or telegram chat id) |
| POST | `/api/webhooks/instagram` | Receive Instagram DM payloads and trigger AI decisions |
| POST | `/api/webhooks/telegram/:botToken` | Webhook برای ربات تلگرام اختصاصی هر فروشگاه (botToken از جدول business تشخیص داده می‌شود) |
| POST | `/api/ai/decision` | Run the AI decision engine directly |
| POST | `/api/messages/send` | Send replies back to Instagram (requires `X-Business-Key`) |
| POST | `/api/telegram/notify` | Notify store owner via Telegram bot (server-to-server, uses stored chat id) |
| POST | `/api/telegram/link` | Link a Telegram chat to a business via API key |
| POST | `/api/telegram/bot` | ثبت توکن ربات تلگرام مشتریان با `apiKey` هر فروشگاه |

See `../docs/api.md` for request/response schemas.
