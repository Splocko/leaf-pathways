-- Idempotent patch for community_members to ensure all expected columns exist
-- Safe to run multiple times

-- Ensure the table exists with a minimal structure
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

-- Add any missing columns expected by the app
ALTER TABLE public.community_members
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS race_ethnicity TEXT,
  ADD COLUMN IF NOT EXISTS year_group TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS pathway TEXT;

-- Optional: tighten constraints later (e.g., NOT NULL) once data exists
-- ALTER TABLE public.community_members ALTER COLUMN age SET NOT NULL;

-- Refresh PostgREST schema cache so the API sees new columns immediately
NOTIFY pgrst, 'reload schema';
