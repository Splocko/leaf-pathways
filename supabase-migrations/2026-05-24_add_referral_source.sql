ALTER TABLE community_members
  ADD COLUMN IF NOT EXISTS referral_source TEXT;
