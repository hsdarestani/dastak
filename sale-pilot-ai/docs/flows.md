# فلوهای کلیدی SalePilot

## Flow 1 – Instagram DM تا پاسخ
1. مشتری پیام را ارسال می‌کند.
2. Meta webhook → `/api/webhooks/instagram` (payload شامل `instagram_page_id` است).
3. Controller براساس `instagram_page_id` یا `business_api_key` ردیف business را resolve می‌کند، پیام را ذخیره می‌کند و `findProductsByKeyword` همان مشتری را صدا می‌زند.
4. `runAIDecision` خروجی action را مشخص می‌کند.
5. action = auto → `sendMessageToInstagram`.
6. action = semi → تلگرام مالک برای تأیید.
7. action = human → تلگرام هشدار human handover.

## Flow 2 – WooCommerce Sync
1. مالک داخل ربات دستور `/connect <API_KEY>` را اجرا می‌کند تا chat id او ذخیره شود.
2. پس از اتصال، با لمس «Sync WooCommerce» درخواست به `/api/products/sync` با هدر `X-Business-Key` ارسال می‌شود.
3. `fetchProducts` از WooCommerce همان مشتری داده می‌گیرد.
4. `upsertProducts` همه کالاها را ذخیره می‌کند و نتیجه به همان chat id برگردانده می‌شود.

## Flow 3 – Human Override
1. AI intent = human → conversation.mode = human_override.
2. Bot پیغام 🚨 برای مالک ارسال می‌کند.
3. پیام‌های بعدی مالک از طریق `/api/messages/send` مستقیم به مشتری می‌رود.
4. بعد از پایان، مالک با دستور `/resume` دوباره AI را فعال می‌کند.
