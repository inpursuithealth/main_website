/*
  # Add source and user_agent columns to waitlist table

  ## Summary
  Adds two tracking columns to the existing waitlist table to capture
  where signups originate and basic browser context for analytics.

  ## Modified Tables
  - `waitlist`
    - `source` (text, default 'for-you-page') - which page/flow drove the signup
    - `user_agent` (text, nullable) - browser user agent string for analytics

  ## Notes
  1. Both columns are added safely with IF NOT EXISTS checks
  2. No RLS changes needed - existing anon INSERT policy already allows these fields
  3. source defaults to 'for-you-page' to backfill any existing rows logically
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waitlist' AND column_name = 'source'
  ) THEN
    ALTER TABLE waitlist ADD COLUMN source text DEFAULT 'for-you-page';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waitlist' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE waitlist ADD COLUMN user_agent text;
  END IF;
END $$;
