# SalePilot Backend

Backend Node.js/Express service powering SalePilot AI assistant. Provides connectors for WooCommerce, Instagram webhook handling, Telegram notifications and a rule-based AI decision engine.

## Getting Started

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Key Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/products/sync` | Fetch WooCommerce products and store them in Postgres |
| POST | `/api/webhooks/instagram` | Receive Instagram DM payloads and trigger AI decisions |
| POST | `/api/ai/decision` | Run the AI decision engine directly |
| POST | `/api/messages/send` | Send replies back to Instagram |
| POST | `/api/telegram/notify` | Notify store owner via Telegram bot |

See `../docs/api.md` for request/response schemas.
