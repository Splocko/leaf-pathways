-- Add event_status column to unify event lifecycle handling in admin + frontend
-- available: normal event with registration/actions enabled
-- sold_out: shows sold out messaging, registration/actions disabled
-- past: shown in past-events section, registration/actions disabled

ALTER TABLE events
ADD COLUMN IF NOT EXISTS event_status TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'events_event_status_check'
  ) THEN
    ALTER TABLE events
    ADD CONSTRAINT events_event_status_check
    CHECK (event_status IN ('available', 'sold_out', 'past'));
  END IF;
END $$;

ALTER TABLE events
ALTER COLUMN event_status SET DEFAULT 'available';

-- Backfill existing rows from legacy fields/date behavior
UPDATE events
SET event_status = CASE
  WHEN is_sold_out = true THEN 'sold_out'
  WHEN date IS NOT NULL AND date < NOW() THEN 'past'
  ELSE 'available'
END
WHERE event_status IS NULL;

ALTER TABLE events
ALTER COLUMN event_status SET NOT NULL;

COMMENT ON COLUMN events.event_status IS 'Lifecycle status controlled by admin: available, sold_out, or past';
