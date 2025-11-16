# فلوهای کلیدی SalePilot

## Flow 1 – Instagram DM تا پاسخ
1. مشتری پیام را ارسال می‌کند.
2. Meta webhook → `/api/webhooks/instagram`.
3. Controller پیام را ذخیره می‌کند و `findProductsByKeyword` را صدا می‌زند.
4. `runAIDecision` خروجی action را مشخص می‌کند.
5. action = auto → `sendMessageToInstagram`.
6. action = semi → تلگرام مالک برای تأیید.
7. action = human → تلگرام هشدار human handover.

## Flow 2 – WooCommerce Sync
1. مالک از طریق تلگرام یا کرون `/api/products/sync` را فراخوانی می‌کند.
2. `fetchProducts` از WooCommerce داده می‌گیرد.
3. `upsertProducts` همه کالاها را ذخیره می‌کند.
4. نتایج به کانال تلگرام ارسال می‌شود (اختیاری).

## Flow 3 – Human Override
1. AI intent = human → conversation.mode = human_override.
2. Bot پیغام 🚨 برای مالک ارسال می‌کند.
3. پیام‌های بعدی مالک از طریق `/api/messages/send` مستقیم به مشتری می‌رود.
4. بعد از پایان، مالک با دستور `/resume` دوباره AI را فعال می‌کند.
