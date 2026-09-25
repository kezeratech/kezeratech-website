-- ============================================================================
-- ADVERTISEMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text,
  cta_label text,
  cta_href text,
  badge_text text,
  bg_color text DEFAULT 'from-accent/20 to-primary/20',
  is_active boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_advertisements" ON advertisements;
CREATE POLICY "public_read_active_advertisements" ON advertisements
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "authenticated_all_advertisements" ON advertisements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements (is_active);

-- ============================================================================
-- NEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  featured_image_url text,
  author text,
  category text,
  tags jsonb DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  publish_date timestamptz DEFAULT now(),
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_news_slug ON news (slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news (is_published);
CREATE INDEX IF NOT EXISTS idx_news_publish_date ON news (publish_date DESC);

DROP POLICY IF EXISTS "public_read_published_news" ON news;
CREATE POLICY "public_read_published_news" ON news
  FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE POLICY "authenticated_all_news" ON news
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON advertisements;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON advertisements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at ON news;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
