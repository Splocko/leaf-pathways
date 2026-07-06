-- Enforce required columns and add basic validations for community_members
-- Run this after the add_missing_cm_columns patch

-- Make sure columns exist first (idempotent safety)
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  email TEXT UNIQUE
);

ALTER TABLE public.community_members
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS race_ethnicity TEXT,
  ADD COLUMN IF NOT EXISTS year_group TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS pathway TEXT;

-- Ensure email is unique (create a constraint only if one doesn't already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.community_members'::regclass
      AND contype = 'u'
      AND conname = 'community_members_email_unique'
  ) THEN
    BEGIN
      ALTER TABLE public.community_members
        ADD CONSTRAINT community_members_email_unique UNIQUE (email);
    EXCEPTION WHEN duplicate_table THEN
      -- ignore if created concurrently
      NULL;
    END;
  END IF;
END$$;

-- Enforce required fields safely: only set NOT NULL if no NULLs exist yet.
-- If this block skips any column, backfill data and rerun to enforce.
DO $$
BEGIN
  -- full_name
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'community_members' AND column_name = 'full_name'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.community_members WHERE full_name IS NULL
  ) THEN
    ALTER TABLE public.community_members ALTER COLUMN full_name SET NOT NULL;
  END IF;

  -- email
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'community_members' AND column_name = 'email'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.community_members WHERE email IS NULL
  ) THEN
    ALTER TABLE public.community_members ALTER COLUMN email SET NOT NULL;
  END IF;

  -- location
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'community_members' AND column_name = 'location'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.community_members WHERE location IS NULL
  ) THEN
    ALTER TABLE public.community_members ALTER COLUMN location SET NOT NULL;
  END IF;

  -- year_group
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'community_members' AND column_name = 'year_group'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.community_members WHERE year_group IS NULL
  ) THEN
    ALTER TABLE public.community_members ALTER COLUMN year_group SET NOT NULL;
  END IF;

  -- industry
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'community_members' AND column_name = 'industry'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.community_members WHERE industry IS NULL
  ) THEN
    ALTER TABLE public.community_members ALTER COLUMN industry SET NOT NULL;
  END IF;

  -- pathway
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'community_members' AND column_name = 'pathway'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.community_members WHERE pathway IS NULL
  ) THEN
    ALTER TABLE public.community_members ALTER COLUMN pathway SET NOT NULL;
  END IF;
END$$;

-- Optional validations
-- Age should be reasonable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'community_members_age_valid'
  ) THEN
    ALTER TABLE public.community_members
      ADD CONSTRAINT community_members_age_valid CHECK (age IS NULL OR age BETWEEN 13 AND 120);
  END IF;
END$$;

-- Helpful index for created_at if used in ordering
CREATE INDEX IF NOT EXISTS idx_cm_created_at ON public.community_members(created_at DESC);

-- Refresh PostgREST schema cache so the API sees changes immediately
NOTIFY pgrst, 'reload schema';
