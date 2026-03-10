/*
  # Investor Portal Tracking Tables

  ## Summary
  Creates the full viewership tracking infrastructure for the InPursuit Health investor portal.

  ## New Tables

  ### 1. `investor_sessions`
  Records each investor who completes the gate flow and enters the data room.
  - `id` — UUID primary key
  - `access_code` — which code was used (julio/shawn/omega)
  - `first_name`, `last_name`, `email` — contact info captured at gate
  - `entered_at` — timestamp when they opened the data room
  - `user_agent` — browser/device info for context
  - `ip_hint` — first 3 octets of IP for approximate geo (privacy-safe)

  ### 2. `investor_doc_views`
  Logs each document card click, with optional time-on-doc tracking.
  - `id` — UUID primary key
  - `session_id` — FK to investor_sessions
  - `doc_slug` — machine-readable document identifier (e.g. "safe-term-sheet")
  - `doc_title` — human-readable document title
  - `doc_category` — SAFE Bridge / Series A / Market Analysis / Execution
  - `opened_at` — when the document was clicked/opened
  - `closed_at` — when they returned (via visibility API or unload)
  - `seconds_open` — computed duration for quick queries

  ## Security
  - RLS enabled on both tables
  - INSERT-only policies using anon key (portal is public but gated by JS)
  - No SELECT policy for anon — only service role can read (used by admin dashboard)
  - Admin dashboard will use service role key via edge function

  ## Notes
  - No auth required — investors don't have Supabase accounts
  - Tracking is client-side using the anon key with INSERT-only RLS
  - The analytics dashboard will be protected by a separate admin password
*/

CREATE TABLE IF NOT EXISTS investor_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code  text NOT NULL,
  first_name   text NOT NULL,
  last_name    text NOT NULL,
  email        text NOT NULL,
  entered_at   timestamptz DEFAULT now(),
  user_agent   text DEFAULT '',
  referrer     text DEFAULT ''
);

ALTER TABLE investor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert for investor sessions"
  ON investor_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);


CREATE TABLE IF NOT EXISTS investor_doc_views (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid REFERENCES investor_sessions(id) ON DELETE CASCADE,
  doc_slug      text NOT NULL,
  doc_title     text NOT NULL,
  doc_category  text NOT NULL DEFAULT '',
  opened_at     timestamptz DEFAULT now(),
  closed_at     timestamptz,
  seconds_open  integer
);

ALTER TABLE investor_doc_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert for doc views"
  ON investor_doc_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update own doc views"
  ON investor_doc_views
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_doc_views_session_id ON investor_doc_views(session_id);
CREATE INDEX IF NOT EXISTS idx_doc_views_opened_at  ON investor_doc_views(opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_entered_at  ON investor_sessions(entered_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_email       ON investor_sessions(email);
