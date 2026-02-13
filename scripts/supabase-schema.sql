-- Supabase: kör i SQL Editor.
-- Tabell för nyhetsartiklar (matchar Article-typen i appen).

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Övrigt',
  read_time TEXT NOT NULL DEFAULT '1 min',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT,
  external_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);

-- Trigger: uppdatera updated_at vid ändring
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- Storage: skapa bucket "article-images" (public) i Dashboard → Storage om du använder bilduppladdning.
