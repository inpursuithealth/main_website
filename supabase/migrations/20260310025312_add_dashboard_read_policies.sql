/*
  # Add read policies for investor analytics dashboard

  ## Summary
  The analytics dashboard uses the anon key client-side with a password gate.
  These policies allow SELECT on both tracking tables so the dashboard can
  query and display data. The protection is the admin password in the HTML,
  not Supabase auth.

  ## Changes
  - Add SELECT policy on investor_sessions for anon role
  - Add SELECT policy on investor_doc_views for anon role
*/

CREATE POLICY "Allow anon select for admin dashboard on sessions"
  ON investor_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon select for admin dashboard on doc views"
  ON investor_doc_views
  FOR SELECT
  TO anon
  USING (true);
