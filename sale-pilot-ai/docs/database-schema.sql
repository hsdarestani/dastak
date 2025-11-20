CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "user"(id),
  name TEXT,
  api_key TEXT UNIQUE NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text),
  wc_url TEXT,
  wc_key TEXT,
  wc_secret TEXT,
  ig_business_id TEXT,
  ig_page_id TEXT,
  ig_access_token TEXT,
  telegram_chat_id BIGINT,
  telegram_owner_name TEXT,
  telegram_owner_bot_token TEXT,
  telegram_customer_bot_token TEXT,
  telegram_customer_bot_username TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES business(id),
  wc_product_id BIGINT,
  name TEXT,
  price NUMERIC,
  stock_status TEXT,
  category TEXT,
  image TEXT,
  attributes_json JSONB,
  UNIQUE (business_id, wc_product_id)
);

CREATE TABLE IF NOT EXISTS customer (
  id SERIAL PRIMARY KEY,
  channel TEXT,
  external_id TEXT,
  name TEXT,
  username TEXT,
  UNIQUE (channel, external_id)
);

CREATE TABLE IF NOT EXISTS conversation (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customer(id),
  business_id INTEGER REFERENCES business(id),
  status TEXT,
  last_message_at TIMESTAMP DEFAULT NOW(),
  mode TEXT DEFAULT 'auto',
  UNIQUE (customer_id, business_id)
);

CREATE TABLE IF NOT EXISTS message (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversation(id),
  sender_type TEXT,
  text TEXT,
  type TEXT,
  media_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_decision (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversation(id),
  summary TEXT,
  intent TEXT,
  recommended_reply TEXT,
  action TEXT,
  confidence NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);
