-- Add is_sold_out column to events table
-- This allows admins to manually mark paid events as sold out

ALTER TABLE events
ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN events.is_sold_out IS 'Manually set by admin to indicate event tickets are sold out';
