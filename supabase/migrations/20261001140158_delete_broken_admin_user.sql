/*
# Fix Admin Login - Recreate user with proper password hash

The manually created bcrypt hash (via crypt/gen_salt) is not compatible
with Supabase's GoTrue auth server. The fix is to delete the broken
user and all related records, then create a fresh user by calling
the GoTrue admin API which will hash the password correctly.

## Changes
- Delete the existing auth.identities record
- Delete the existing auth.users record
- The frontend will then use signUp() to create the admin user
  with a properly hashed password via GoTrue's built-in flow.
*/

DELETE FROM auth.identities WHERE user_id = 'a0000000-0000-0000-0000-000000000001';
DELETE FROM auth.users WHERE id = 'a0000000-0000-0000-0000-000000000001';
