/*
# Fix Admin Login - Create Missing auth.identities Record

The original migration created the admin user in auth.users but the
auth.identities insert failed due to a missing provider_id column
(NOT NULL, no default). Without an identity record, Supabase Auth
cannot complete the login flow — signInWithPassword returns an error.

## Changes
- Insert the missing identity record for admin@bhagathraj.com
  with provider_id set to the user's UUID (standard for email auth).
- The email column is generated, so we exclude it from the insert.
*/

INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'sub', 'a0000000-0000-0000-0000-000000000001',
    'email', 'admin@bhagathraj.com',
    'email_verified', true
  ),
  'email',
  now(),
  now(),
  now()
)
ON CONFLICT DO NOTHING;
