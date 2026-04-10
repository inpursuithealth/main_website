/*
  # Create waitlist table

  ## Summary
  Creates the waitlist table for capturing early-access signups from the
  for-you page. Anonymous users can insert their own email; no one can
  read or modify existing rows via the API.

  ## New Tables
  - `waitlist`
    - `id` (uuid, primary key, auto-generated)
    - `email` (text, unique, not null) - the signup email address
    - `source` (text, default 'for-you-page') - which page/flow drove the signup
    - `user_agent` (text, nullable) - browser user agent for analytics
    - `created_at` (timestamptz, default now())

  ## Security
  - RLS enabled; table is locked by default
  - Anon INSERT policy: anyone can add a row (no auth required for waitlist)
  - No SELECT/UPDATE/DELETE policies — rows are write-only from the client
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  source     text NOT NULL DEFAULT 'for-you-page',
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);
