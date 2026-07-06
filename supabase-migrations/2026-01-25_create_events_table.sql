-- Add new columns to existing events table for LEAF Pathways
-- This adds short_description, full_description, and event_type fields

-- Add short_description column (for cards)
ALTER TABLE events ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add full_description column (for detail pages, supports longer text/markdown)
ALTER TABLE events ADD COLUMN IF NOT EXISTS full_description TEXT;

-- Add event_type column
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type TEXT CHECK (event_type IN ('In-Person', 'Virtual')) DEFAULT 'In-Person';

-- Rename 'date' to 'event_date' if needed (skip if already named correctly)
-- ALTER TABLE events RENAME COLUMN date TO event_date;

-- Add is_published column for visibility control
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published);

-- Migrate existing description data to short_description if short_description is empty
UPDATE events 
SET short_description = LEFT(description, 200) 
WHERE short_description IS NULL AND description IS NOT NULL;

-- Copy full description
UPDATE events 
SET full_description = description 
WHERE full_description IS NULL AND description IS NOT NULL;

-- Add comment explaining usage
COMMENT ON TABLE events IS 'Events managed via admin page, displayed on homepage (top 3) and events page (all)';
