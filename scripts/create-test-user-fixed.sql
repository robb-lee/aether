-- First, create a user in auth.users table
-- Note: This requires service role access
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'test@aether.ai',
  crypt('testpassword123', gen_salt('bf')), -- Password: testpassword123
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Then create the profile in public.users
INSERT INTO public.users (
  id,
  email,
  username,
  full_name,
  subscription_tier,
  subscription_status,
  monthly_ai_credits,
  ai_credits_used,
  total_sites_created,
  max_sites_allowed,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'test@aether.ai',
  'testuser',
  'Test User',
  'free',
  'active',
  100,
  0,
  0,
  5,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();

-- Verify both were created
SELECT 'auth.users' as table_name, id, email FROM auth.users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
UNION ALL
SELECT 'public.users' as table_name, id, email FROM public.users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';