-- Migration: Add Widening Participation Data Columns
-- Date: 2026-01-25
-- Description: Adds columns to track widening participation metrics for funding/reporting purposes

-- Add first generation university student indicator
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS first_gen_university BOOLEAN DEFAULT NULL;

-- Add free school meals eligibility indicator
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS free_school_meals BOOLEAN DEFAULT NULL;

-- Add care experience indicator (care leavers / looked after children)
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS care_experience BOOLEAN DEFAULT NULL;

-- Add postcode area for regional analysis (first half of postcode only, e.g. "E1", "M1", "B15")
ALTER TABLE community_members 
ADD COLUMN IF NOT EXISTS postcode_area VARCHAR(10) DEFAULT NULL;

-- Add comments to explain the columns
COMMENT ON COLUMN community_members.first_gen_university IS 'Whether the member would be the first in their family to attend university';
COMMENT ON COLUMN community_members.free_school_meals IS 'Whether the member has received free school meals (current or previous eligibility)';
COMMENT ON COLUMN community_members.care_experience IS 'Whether the member is a care leaver or has experience in the care system';
COMMENT ON COLUMN community_members.postcode_area IS 'First half of home postcode for regional reach analysis (e.g. E1, M1, B15)';

-- Note: Run this migration in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cueuwyazwjikiogxsbrs/editor/17451
