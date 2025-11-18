# SalePilot AI – معماری

## لایه‌ها
1. **کانکتورهای کانال**
   - Instagram Webhook → دریافت پیام و ذخیره در DB.
   - Telegram Bot → داشبورد مالک برای تأیید پاسخ‌ها و تنظیمات.
2. **لایه سرویس‌ها**
   - WooCommerce Service → همگام‌سازی محصولات.
   - AI Decision Engine → خلاصه، Intent، پاسخ، Action.
   - Human Override Manager → تغییر حالت مکالمه به human.
3. **PostgreSQL**
   - جداول مطابق `database-schema.sql` (هر ردیف جدول `business` شامل کلید `api_key`، آدرس WooCommerce و Instagram Page ID/Token است.)

## Sequence – Flow 1
1. Instagram پیام را به `/api/webhooks/instagram` می‌فرستد و `instagram_page_id` یا `business_api_key` مشخص می‌کند.
2. Controller با استفاده از آن فیلدها Business مربوطه را پیدا می‌کند و پیام در Conversation همان کسب‌وکار ذخیره می‌شود.
3. سرویس محصول براساس متن مشتری ۳-۵ محصول برتر را می‌آورد.
4. AI Decision Engine با ورودی {conversation, products, business_rules} خروجی `summary, intent, recommended_reply, action, confidence` را بر می‌گرداند.
5. اگر action = auto → پیام فوراً ارسال می‌شود.
6. اگر action = semi → پیام و تصمیم برای مالک در تلگرام مخصوص همان chat id ارسال می‌شود.
7. اگر action = human → human override فعال و هشدار ارسال می‌شود.

## Sequence – Flow 2 (Human Handover)
1. Intent = human → conversation.mode = human_override.
2. همه پیام‌های بعدی مالک بدون عبور از AI به مشتری می‌رسد.
3. وقتی مکالمه بسته شد، mode به auto بازنشانی می‌شود.

## Dev Notes
- هر سرویس خود را در `src/services` تعریف می‌کند.
- Controller ها فقط orchestrator هستند.
- logger مبتنی بر `pino` برای مشاهده جریان‌ها.
