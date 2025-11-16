# dastak

📌 1) تعریف محصول (Product Definition)

SalePilot AI یک دستیار هوشمند فروش برای فروشگاه‌های ووکامرس است که:

- پیام‌های مشتریان (اینستاگرام، واتساپ، تلگرام) را دریافت می‌کند
- مکالمه را تحلیل می‌کند
- محصول مناسب را از ووکامرس پیدا می‌کند
- قیمت و موجودی را چک می‌کند
- یک پاسخ کامل آماده می‌کند
- در حالت خودکار آن را برای مشتری ارسال می‌کند
- اگر مشتری پشتیبان انسانی بخواهد، گفتگو را منتقل می‌کند

هدف MVP: افزایش فروش فروشگاه‌های ووکامرس با پاسخ‌گویی سریع و هوشمند.

📌 2) MVP Scope (فقط چیزهای کاملاً ضروری)

- اتصال به ووکامرس (sync محصولات، قیمت/موجودی، دسته‌بندی، محصول مرتبط)
- اتصال به تلگرام (ربات مدیریت فروشگاه)
- اتصال به اینستاگرام DM (Webhook + ارسال پاسخ)
- موتور AI (یک endpoint شامل summary، intent، reply، action)
- حالت نیمه‌خودکار / خودکار + human handover

📌 3) معماری MVP

```
/sale-pilot-ai
  /backend        → سرویس Node.js/Express + PostgreSQL
  /telegram-bot   → داشبورد مالک (Node + Telegram Bot API)
  /docs           → معماری، API، Flow ها و Schema دیتابیس
```

برای جزئیات معماری، Flow و دیتابیس به پوشه `sale-pilot-ai/docs` مراجعه کنید.

📌 4) راه‌اندازی سریع

1. `cd sale-pilot-ai/backend && npm install`
2. فایل `.env` را از روی `.env.example` بسازید و مقادیر WooCommerce/Instagram/Telegram را پر کنید.
3. دیتابیس PostgreSQL را با `docs/database-schema.sql` بسازید.
4. `npm run dev` را اجرا کنید.
5. برای ربات تلگرام، `cd sale-pilot-ai/telegram-bot && npm install && npm start`.

📌 5) فلوهای کلیدی

- **Flow 1 – دریافت پیام اینستاگرام**: Webhook → ذخیره پیام → AI Decision → ارسال خودکار یا تلگرام برای تأیید.
- **Flow 2 – Human Handover**: Intent = human → حالت human_override → هشدار تلگرام.
- **Flow 3 – Sync ووکامرس**: دستور تلگرام → WooCommerce API → ذخیره محصول.

📌 6) AI Decision Engine (Prompt Design)

Input:
```json
{
  "conversation": [...5–10 last messages...],
  "business_profile": {...tone, rules...},
  "products": [...top 3–5 matched products...]
}
```

Output:
```json
{
  "summary": "",
  "intent": "price_inquiry / size / variant / complaint / human",
  "recommended_reply": "",
  "action": "auto | semi | human",
  "confidence": 0.0-1.0
}
```

📌 7) دیتابیس (PostgreSQL)

ساختار کامل جداول در `sale-pilot-ai/docs/database-schema.sql` قرار داده شده است. مهم‌ترین جداول: User، Business، Product، Customer، Conversation، Message، AI_Decision.

📌 8) API ها (Backend)

| Endpoint | توضیح |
| --- | --- |
| `POST /api/products/sync` | Sync محصولات ووکامرس |
| `POST /api/webhooks/instagram` | دریافت پیام از اینستاگرام |
| `POST /api/ai/decision` | خروجی موتور AI |
| `POST /api/messages/send` | ارسال پیام برای مشتری |
| `POST /api/telegram/notify` | اطلاع‌رسانی human handover |

جزئیات بیشتر در `sale-pilot-ai/docs/api.md` آورده شده است.
