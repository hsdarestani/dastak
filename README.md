# dastak
📌 1) تعریف محصول (Product Definition)

SalePilot AI یک دستیار هوشمند فروش برای فروشگاه‌های ووکامرس است که:

پیام‌های مشتریان (اینستاگرام، واتساپ، تلگرام) را دریافت می‌کند

مکالمه را تحلیل می‌کند

محصول مناسب را از ووکامرس پیدا می‌کند

قیمت و موجودی را چک می‌کند

یک پاسخ کامل آماده می‌کند

در حالت خودکار آن را برای مشتری ارسال می‌کند

اگر مشتری پشتیبان انسانی بخواهد، گفتگو را منتقل می‌کند

هدف MVP:

افزایش فروش فروشگاه‌های ووکامرس با پاسخ‌گویی سریع و هوشمند.

📌 2) MVP Scope (فقط چیزهای کاملاً ضروری)
✔ اتصال به ووکامرس

– دریافت لیست محصولات
– قیمت / موجودی
– دسته‌بندی
– گرفتن محصول مرتبط

✔ اتصال به تلگرام (ربات مدیریت فروشگاه)

– ورود مالک
– نمایش پیام‌های مشتری
– تأیید/رد پاسخ AI
– تنظیمات کسب‌وکار
– نمایش هشدار human-handover

✔ اتصال به اینستاگرام DM (Webhook)

– دریافت پیام
– بازگرداندن پیام از backend (send API)

✔ موتور AI (یک endpoint)

– خلاصه چند پیام آخر
– تشخیص intent
– پیدا کردن محصول
– ساخت پاسخ فروش‌محور
– تشخیص نیاز به پشتیبان انسانی

✔ حالت نیمه‌خودکار

– AI فقط پیام می‌سازد
– مالک تأیید می‌کند
– سپس ارسال می‌شود

✔ حالت خودکار

– اگر اعتماد بالا + پیام ساده
→ خودکار ارسال می‌شود

✔ human handover

– اگر مشتری گفت "با پشتیبان صحبت کنم"
→ AI خاموش
→ نوتیف برای مالک
→ گفتگو انسانی می‌شود

📌 3) معماری MVP
Frontend:
   Telegram Bot (owner dashboard only)

Backend (Node.js / Python):
   - Auth (Telegram login)
   - WooCommerce Connector
   - Instagram Webhook
   - AI Decision Engine
   - Message Router
   - Human Override Manager
   - Database Layer (PostgreSQL)

AI:
   - Conversation Summarizer
   - Intent Detector
   - Product Matcher (WooCommerce)
   - Reply Generator
   - Action Scorer (auto/semi-auto)

📌 4) دیتابیس (PostgreSQL)
User
id, telegram_id, name, phone, created_at

Business
id, user_id, name, wc_url, wc_key, wc_secret

Product

(دادهٔ sync شده از ووکامرس)

id, business_id, wc_product_id, name, price, stock_status, category, image, attributes_json

Customer
id, channel, external_id, name, username

Conversation
id, customer_id, business_id, status, last_message_at, mode

Message
id, conversation_id, sender_type, text, type, media_url, created_at

AI_Decision
id, conversation_id, summary, intent, recommended_reply, action, confidence, created_at

📌 5) API ها (Backend)
GET /products/sync

Sync products from WooCommerce

POST /webhooks/instagram

Receiving DM from Instagram

POST /ai/decision

Input: conversation + products
Output: summary + intent + reply + action

POST /messages/send

Send message back to Instagram

POST /telegram/notify

Notify owner for human-handover

📌 6) جریان داده‌ها (Flows)
🔵 Flow 1 – دریافت پیام از اینستاگرام

مشتری پیام می‌دهد

اینستاگرام → Webhook → /webhooks/instagram

پیام ذخیره می‌شود

Backend → آخرین ۵ پیام را جمع می‌کند

Backend → محصولات مرتبط ووکامرس را پیدا می‌کند

Backend → /ai/decision

AI → خلاصه + intent + reply + action

اگر action = auto
→ پیام برای مشتری ارسال می‌شود
→ log می‌شود

اگر action = semi
→ پیام می‌رود به تلگرام مالک برای تأیید

مالک Accept / Reject می‌زند
→ ارسال می‌شود

🔵 Flow 2 – human handover

AI تشخیص می‌دهد intent = human

Conversation.mode = human_override

پیام در تلگرام به صاحب کسب‌وکار:

🚨 یک مشتری درخواست پشتیبانی انسانی دارد  


از این لحظه هر پیام مالک → مستقیم برای مشتری ارسال می‌شود

AI در این گفتگو silent می‌ماند

🔵 Flow 3 – اتصال ووکامرس

در تلگرام مالک:

لطفاً URL فروشگاه، key و secret را وارد کنید:


سپس:

/products/sync اجرا می‌شود

تمام محصولات ذخیره می‌شوند

هر ۱ ساعت یا On-Demand sync می‌شود

📌 7) AI Decision Engine (Prompt Design)
Input:
{
  conversation: [...5–10 last messages...],
  business_profile: {...tone, rules...},
  products: [...top 3–5 matched products...]
}

Output:
{
  summary: "",
  intent: "price_inquiry / size / variant / complaint / human",
  recommended_reply: "",
  action: "auto | semi | human",
  confidence: 0.0-1.0
}

📌 8) ساختار پروژه (مناسب GitHub + Codex)
/sale-pilot-ai
  /backend
    /src
      /api
      /ai
      /controllers
      /models
      /services
        woo.service.js
        insta.service.js
        ai.service.js
        telegram.service.js
      /utils
    /config
    package.json
    README.md

  /telegram-bot
    bot.js
    config.json
    utils.js

  /docs
    api.md
    architecture.md
    flows.md
    database-schema.sql
