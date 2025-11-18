# SalePilot Telegram Bot

Bot مخصوص مالک فروشگاه برای تأیید پاسخ‌های AI و مدیریت کانکتورها.

## راه‌اندازی
```bash
cd telegram-bot
cp .env.example .env
npm install
npm start
```

توکن ربات را از BotFather دریافت کنید. پس از اجرای Bot، صاحب فروشگاه داخل تلگرام دستور زیر را وارد می‌کند تا chat id او به رکورد کسب‌وکار متصل شود:

```
/connect <API_KEY>
```

API Key را می‌توانید از ستون `api_key` در جدول `business` بردارید. بعد از اتصال، دستورهای منو (مانند Sync WooCommerce) خودکار هدر `X-Business-Key` مناسب را به بک‌اند می‌فرستند.
