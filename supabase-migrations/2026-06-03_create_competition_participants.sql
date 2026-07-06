-- competition_participants: one row per person (duos get 2 rows, each with their name first)
-- Access is token-gated at the application layer; no public RLS policy needed.

CREATE TABLE IF NOT EXISTS competition_participants (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id        TEXT    UNIQUE NOT NULL,          -- e.g. "A-001", "D-003b"
  report_id        TEXT    NOT NULL,                  -- shared between duo partners
  scenario         TEXT    NOT NULL,                  -- "A", "D", etc.
  type             TEXT    NOT NULL CHECK (type IN ('solo', 'duo')),
  full_name        TEXT    NOT NULL,
  email            TEXT    DEFAULT '',
  education_stage  TEXT    DEFAULT '',
  city             TEXT    DEFAULT '',
  partner_name     TEXT    DEFAULT '',
  partner_email    TEXT    DEFAULT '',
  cert_name_line   TEXT    NOT NULL,                  -- name as printed on certificate
  practicality     NUMERIC NOT NULL,
  profitability    NUMERIC NOT NULL,
  creativity       NUMERIC NOT NULL,
  sustainability   NUMERIC NOT NULL,
  presentation     NUMERIC NOT NULL,
  total_score      NUMERIC NOT NULL DEFAULT 0,
  strongest_comment TEXT   DEFAULT '',
  weakest_comment   TEXT   DEFAULT '',
  access_token     TEXT    UNIQUE NOT NULL,           -- 32-char hex — used as URL slug
  cert_pdf_url     TEXT    DEFAULT '',
  report_pdf_url   TEXT    DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;

-- No public SELECT policy: all reads happen server-side via service role key.
-- This means the anon key cannot enumerate participants, even if someone
-- calls the Supabase API directly.
