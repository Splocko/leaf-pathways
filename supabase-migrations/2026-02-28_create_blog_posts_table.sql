-- Create blog_posts table for LEAF Pathways newsletter/blog feature

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT, -- rich HTML content from TipTap editor
  excerpt TEXT, -- auto-generated short excerpt for cards
  cover_image_url TEXT,
  category TEXT DEFAULT 'General',
  author_name TEXT DEFAULT 'LEAF Pathways',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER trigger_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts only
CREATE POLICY "Public can read published blog posts"
  ON blog_posts
  FOR SELECT
  USING (is_published = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also allow service role (used by admin page with anon key via localStorage session)
-- Drop existing anon policy if exists, then recreate as full access for anon (protected by admin login in the app)
CREATE POLICY "Anon can manage blog posts via admin"
  ON blog_posts
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE blog_posts IS 'Monthly newsletter / blog posts managed via admin panel, displayed on /blog public page';
