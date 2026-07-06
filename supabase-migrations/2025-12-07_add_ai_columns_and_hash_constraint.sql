-- Migration: Add AI tracking columns and hash dedupe for opportunities
-- Project: Leaf Pathways data (separate from website supabase)

-- Add AI status columns if missing
ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS ai_status TEXT;

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS ai_reason TEXT;

-- Ensure unique constraint on hash for upsert deduplication
ALTER TABLE opportunities
  ADD CONSTRAINT IF NOT EXISTS opportunities_hash_unique UNIQUE (hash);

-- Optional index for faster lookups by hash
CREATE INDEX IF NOT EXISTS opportunities_hash_idx ON opportunities (hash);

-- Note: This migration assumes table `opportunities` already exists.