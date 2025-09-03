-- Create a test user for development
INSERT INTO users (
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

-- Verify the user was created
SELECT id, email, username, subscription_tier FROM users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';