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
- اتصال به تلگرام (ربات مدیریت فروشگاه + ربات اختصاصی مشتریان برای هر فروشگاه)
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
2. فایل `.env` را از روی `.env.example` بسازید (تنها حاوی مقدارهای سراسری مثل پورت و دیتابیس و AI provider است).
3. دیتابیس PostgreSQL را با `docs/database-schema.sql` بسازید و برای هر مشتری یک ردیف در جدول `business` (با `api_key` منحصربه‌فرد، WooCommerce URL/Keys، Instagram Page ID/Token، و توکن ربات تلگرام مشتریان) ایجاد کنید.
4. `npm run dev` را اجرا کنید.
5. برای ربات تلگرام مالک، `cd sale-pilot-ai/telegram-bot && npm install && npm start` و صاحب فروشگاه داخل تلگرام دستور `/connect <API_KEY>` را می‌زند تا chat id او به همان ردیف `business` متصل شود؛ توکن ربات مشتریان جداگانه از طریق Endpoint `/api/telegram/bot` ثبت می‌شود.

📌 5) فلوهای کلیدی

- **Flow 1 – دریافت پیام اینستاگرام**: Webhook شامل `instagram_page_id` یا `business_api_key` → resolve ردیف business → ذخیره پیام → AI Decision → ارسال خودکار یا هشدار تلگرام مخصوص همان business.
- **Flow 2 – ربات تلگرام مشتریان**: وب‌هوک `/api/webhooks/telegram/:botToken` پیام مشتری را می‌گیرد، با `telegram_customer_bot_token` ردیف مشتری را تشخیص می‌دهد، AI پاسخ می‌دهد یا هشدار human handover می‌دهد.
- **Flow 3 – Human Handover**: Intent = human → حالت human_override → هشدار تلگرام به chat_id ثبت‌شده برای همان API key.
- **Flow 4 – Sync ووکامرس**: درخواست با هدر `X-Business-Key` یا chat id تلگرام → WooCommerce API با کلیدهای همان مشتری → ذخیره محصول.

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
| `POST /api/webhooks/telegram/:botToken` | دریافت پیام از ربات تلگرام مشتریان هر فروشگاه |
| `POST /api/telegram/bot` | ثبت توکن ربات تلگرام مشتریان برای هر فروشگاه |
| `POST /api/ai/decision` | خروجی موتور AI |
| `POST /api/messages/send` | ارسال پیام برای مشتری |
| `POST /api/telegram/notify` | اطلاع‌رسانی human handover |

جزئیات بیشتر در `sale-pilot-ai/docs/api.md` آورده شده است.
