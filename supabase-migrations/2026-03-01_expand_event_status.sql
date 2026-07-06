-- Expand event_status to support more lifecycle states:
-- available: normal event with registration enabled
-- sold_out: registration full / closed
-- deadline_passed: application/registration deadline has passed but event may still occur
-- completed: event has finished (one-day events, past events)
-- 'past' is kept for backward compat but frontend maps it to 'completed'

-- Drop existing constraint and add expanded one
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_status_check;

ALTER TABLE events
ADD CONSTRAINT events_event_status_check
CHECK (event_status IN ('available', 'sold_out', 'past', 'deadline_passed', 'completed'));

-- Migrate old 'past' values to 'completed'
UPDATE events SET event_status = 'completed' WHERE event_status = 'past';
