-- Add explicit precision metadata for event dates so admin can support
-- month-only events and date-only events without forcing a time of day.

ALTER TABLE events
ADD COLUMN IF NOT EXISTS event_date_precision TEXT;

UPDATE events
SET event_date_precision = CASE
  WHEN date IS NULL THEN 'day'
  WHEN date::time <> TIME '00:00:00' THEN 'time'
  ELSE 'day'
END
WHERE event_date_precision IS NULL;

ALTER TABLE events
ALTER COLUMN event_date_precision SET DEFAULT 'day';

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_date_precision_check;

ALTER TABLE events
ADD CONSTRAINT events_event_date_precision_check
CHECK (event_date_precision IN ('month', 'day', 'time'));

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_status_check;

ALTER TABLE events
ADD CONSTRAINT events_event_status_check
CHECK (event_status IN ('available', 'coming_soon', 'sold_out', 'past', 'deadline_passed', 'completed'));

COMMENT ON COLUMN events.event_date_precision IS 'Display precision for event dates: month, day, or time';
COMMENT ON COLUMN events.event_status IS 'Lifecycle status controlled by admin: available, coming_soon, sold_out, deadline_passed, completed';