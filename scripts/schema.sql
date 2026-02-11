-- Run this once in Vercel Postgres (or your Postgres provider) to create the news table.
-- In Vercel: Storage → your Postgres store → Query, or use the SQL tab in Neon dashboard.

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT,
  external_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_news_slug ON news (slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news (created_at DESC);
