# SalePilot Backend

Backend Node.js/Express service powering SalePilot AI assistant. Provides connectors for WooCommerce, Instagram webhook handling, Telegram notifications and a rule-based AI decision engine.

## Getting Started

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The Express app also serves a static landing site from `public/`. After starting the server, open `http://localhost:3000/` to
see the marketing and onboarding page.

## Key Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/products/sync` | Fetch WooCommerce products (requires `X-Business-Key` header or telegram chat id) |
| POST | `/api/webhooks/instagram` | Receive Instagram DM payloads and trigger AI decisions |
| POST | `/api/ai/decision` | Run the AI decision engine directly |
| POST | `/api/messages/send` | Send replies back to Instagram (requires `X-Business-Key`) |
| POST | `/api/telegram/notify` | Notify store owner via Telegram bot (server-to-server, uses stored chat id) |
| POST | `/api/telegram/link` | Link a Telegram chat to a business via API key |

See `../docs/api.md` for request/response schemas.
