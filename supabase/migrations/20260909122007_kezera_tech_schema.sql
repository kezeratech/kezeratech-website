/*
# Kezera Tech — Core Database Schema

## Overview
Creates the complete content management and communication schema for the Kezera Tech website and admin dashboard. All tables use RLS with admin-only access (via service role) and public read access for published content only.

## Tables Created
1. site_settings — global company info, contact, social links
2. services — service catalog with full CMS fields
3. projects — portfolio/case studies
4. products — product catalog
5. industries — industries served
6. blog_posts — blog/insights articles
7. blog_categories — blog categories
8. blog_tags — blog tags
9. team_members — team profiles
10. testimonials — client testimonials
11. faqs — frequently asked questions
12. contact_messages — contact form submissions
13. quote_requests — project inquiry submissions
14. job_positions — career openings
15. job_applications — applicant submissions
16. newsletter_subscribers — newsletter signups
17. media_items — media library
18. navigation_items — nav menu management
19. audit_logs — admin action audit trail
20. tech_stack — technologies used by Kezera Tech

## Security
- RLS enabled on ALL tables
- Public (anon) can SELECT published content only (where is_published = true)
- Public can INSERT contact_messages, quote_requests, job_applications, newsletter_subscribers
- Only authenticated admins can perform full CRUD (via service role key in API routes)
- No public access to contact_messages, quote_requests, job_applications, newsletter_subscribers, audit_logs
*/

-- ============================================================================
-- SITE SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Kezera Tech',
  tagline text NOT NULL DEFAULT 'Designing the Future Through Technology',
  description text,
  email text,
  phone text,
  address text,
  business_hours text,
  logo_url text,
  favicon_url text,
  default_seo_title text,
  default_seo_description text,
  default_og_image_url text,
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text DEFAULT 'We are improving the future. Kezera Tech will be back shortly.',
  social_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================================
-- SERVICES
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  hero_image_url text,
  short_description text,
  full_description text,
  benefits jsonb DEFAULT '[]'::jsonb,
  process jsonb DEFAULT '[]'::jsonb,
  technologies jsonb DEFAULT '[]'::jsonb,
  industries jsonb DEFAULT '[]'::jsonb,
  faqs jsonb DEFAULT '[]'::jsonb,
  cta_label text,
  cta_href text,
  seo_title text,
  seo_description text,
  og_image_url text,
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_services_slug ON services (slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services (is_published);

DROP POLICY IF EXISTS "public_read_published_services" ON services;
CREATE POLICY "public_read_published_services" ON services FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- PROJECTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  client text,
  industry text,
  project_type text,
  description text,
  challenge text,
  solution text,
  result text,
  technologies jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  videos jsonb DEFAULT '[]'::jsonb,
  gallery jsonb DEFAULT '[]'::jsonb,
  project_url text,
  github_url text,
  completion_date date,
  status text DEFAULT 'completed',
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects (is_published);

DROP POLICY IF EXISTS "public_read_published_projects" ON projects;
CREATE POLICY "public_read_published_projects" ON projects FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  icon text,
  description text,
  long_description text,
  screenshots jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  technologies jsonb DEFAULT '[]'::jsonb,
  pricing_info text,
  availability text DEFAULT 'coming_soon',
  website_url text,
  download_url text,
  documentation_url text,
  changelog jsonb DEFAULT '[]'::jsonb,
  faqs jsonb DEFAULT '[]'::jsonb,
  category text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products (is_published);

DROP POLICY IF EXISTS "public_read_published_products" ON products;
CREATE POLICY "public_read_published_products" ON products FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- INDUSTRIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE industries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_industries" ON industries;
CREATE POLICY "public_read_published_industries" ON industries FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- BLOG POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories (slug);

DROP POLICY IF EXISTS "public_read_blog_categories" ON blog_categories;
CREATE POLICY "public_read_blog_categories" ON blog_categories FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags (slug);

DROP POLICY IF EXISTS "public_read_blog_tags" ON blog_tags;
CREATE POLICY "public_read_blog_tags" ON blog_tags FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  featured_image_url text,
  author text,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  publish_date timestamptz,
  status text DEFAULT 'draft',
  seo_title text,
  seo_description text,
  canonical_url text,
  social_image_url text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts (publish_date DESC);

DROP POLICY IF EXISTS "public_read_published_blog_posts" ON blog_posts;
CREATE POLICY "public_read_published_blog_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- TEAM MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text,
  profile_image_url text,
  biography text,
  skills jsonb DEFAULT '[]'::jsonb,
  social_links jsonb DEFAULT '{}'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_team_members" ON team_members;
CREATE POLICY "public_read_published_team_members" ON team_members FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- TESTIMONIALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  position text,
  company text,
  profile_image_url text,
  testimonial text NOT NULL,
  rating int DEFAULT 5,
  is_visible boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_visible_testimonials" ON testimonials;
CREATE POLICY "public_read_visible_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (is_visible = true);

-- ============================================================================
-- FAQS
-- ============================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_faqs" ON faqs;
CREATE POLICY "public_read_published_faqs" ON faqs FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- CONTACT MESSAGES (public can insert, only admin can read)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service text,
  budget text,
  message text NOT NULL,
  status text DEFAULT 'new',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================================
-- QUOTE REQUESTS (public can insert, only admin can read)
-- ============================================================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company_name text,
  industry text,
  website text,
  project_type text,
  description text,
  goals text,
  desired_features text,
  budget_range text,
  expected_timeline text,
  status text DEFAULT 'new',
  internal_notes text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests (status);

DROP POLICY IF EXISTS "public_insert_quote_requests" ON quote_requests;
CREATE POLICY "public_insert_quote_requests" ON quote_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================================
-- JOB POSITIONS & APPLICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS job_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text,
  employment_type text,
  location text,
  description text,
  responsibilities jsonb DEFAULT '[]'::jsonb,
  requirements jsonb DEFAULT '[]'::jsonb,
  preferred_skills jsonb DEFAULT '[]'::jsonb,
  deadline date,
  status text DEFAULT 'open',
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_job_positions_status ON job_positions (status);

DROP POLICY IF EXISTS "public_read_published_job_positions" ON job_positions;
CREATE POLICY "public_read_published_job_positions" ON job_positions FOR SELECT
  TO anon, authenticated USING (is_published = true);

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_position_id uuid REFERENCES job_positions(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  cv_url text,
  portfolio_url text,
  linkedin_url text,
  cover_letter text,
  status text DEFAULT 'new',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications (status);

DROP POLICY IF EXISTS "public_insert_job_applications" ON job_applications;
CREATE POLICY "public_insert_job_applications" ON job_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS (public can insert, only admin can read)
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers (email);

DROP POLICY IF EXISTS "public_insert_newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "public_insert_newsletter_subscribers" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================================
-- MEDIA LIBRARY
-- ============================================================================
CREATE TABLE IF NOT EXISTS media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_type text,
  file_size bigint,
  width int,
  height int,
  url text NOT NULL,
  alt_text text,
  folder text DEFAULT 'root',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_media_items" ON media_items;
CREATE POLICY "public_read_media_items" ON media_items FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================================
-- NAVIGATION ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_visible_navigation_items" ON navigation_items;
CREATE POLICY "public_read_visible_navigation_items" ON navigation_items FOR SELECT
  TO anon, authenticated USING (is_visible = true);

-- ============================================================================
-- TECH STACK
-- ============================================================================
CREATE TABLE IF NOT EXISTS tech_stack (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_tech_stack_category ON tech_stack (category);

DROP POLICY IF EXISTS "public_read_published_tech_stack" ON tech_stack;
CREATE POLICY "public_read_published_tech_stack" ON tech_stack FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- AUDIT LOGS (admin only — no public access)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  success boolean NOT NULL DEFAULT true,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY['site_settings','services','projects','products','industries','blog_posts','team_members','testimonials','faqs','job_positions','navigation_items'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', tbl);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', tbl);
  END LOOP;
END
$$;

-- ============================================================================
-- INSERT DEFAULT SITE SETTINGS
-- ============================================================================
INSERT INTO site_settings (company_name, tagline, description, email, phone, address)
VALUES (
  'Kezera Tech',
  'Designing the Future Through Technology',
  'Kezera Tech builds technology-driven digital products, software solutions, and applications that solve real-world problems and create measurable value.',
  'hello@kezeratech.com',
  '+251 911 000 000',
  'Addis Ababa, Ethiopia'
) ON CONFLICT DO NOTHING;
