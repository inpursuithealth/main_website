/*
  # Create Waitlist Table

  ## Summary
  Creates a table to capture email addresses from visitors who sign up for the waitlist
  on the for-you.html landing page.

  ## New Tables
  - `waitlist`
    - `id` (uuid, primary key, auto-generated)
    - `email` (text, unique, not null) - the submitted email address
    - `joined_at` (timestamptz, default now()) - when the signup occurred

  ## Security
  - RLS enabled on the `waitlist` table
  - Anon INSERT policy: unauthenticated visitors can submit their email
  - No SELECT policy for anon users (emails are private)

  ## Notes
  1. A unique constraint on `email` prevents duplicate signups at the database level
  2. The unique constraint violation (error code 23505) is used to detect duplicate emails
  3. No auth is required - this matches the existing pattern in the project
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  joined_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can insert their email to the waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);
