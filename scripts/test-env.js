#!/usr/bin/env node

/**
 * Test script to verify environment variable validation
 * Run with: node scripts/test-env.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Environment Variable Validation\n');
console.log('=' .repeat(50));

// Test 1: Check if .env.local exists
console.log('\n📁 Checking for .env.local file...');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
} else {
  console.log('⚠️  .env.local file not found');
  console.log('   Creating from .env.local.example...');
  const examplePath = path.join(__dirname, '..', '.env.local.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ Created .env.local from example');
  }
}

// Test 2: Try to validate with missing variables
console.log('\n🔍 Testing validation with current environment...\n');

// Create a test file that uses the validation
const testFile = `
import { getEnv } from '../lib/env.js';
import { getServerEnv } from '../lib/env.server.js';
import { clientEnv } from '../lib/env.client.js';

console.log('\\n📋 Environment Validation Results:\\n');
console.log('=' .repeat(50));

// Test client environment
try {
  console.log('\\n🌐 Client Environment:');
  console.log('  NEXT_PUBLIC_APP_URL:', clientEnv.NEXT_PUBLIC_APP_URL);
  console.log('  NEXT_PUBLIC_SITE_NAME:', clientEnv.NEXT_PUBLIC_SITE_NAME);
  console.log('  ✅ Client validation passed');
} catch (error) {
  console.log('  ❌ Client validation failed:', error.message);
}

// Test server environment (will fail if not all vars are set)
try {
  console.log('\\n🔒 Server Environment:');
  const serverEnv = getServerEnv();
  console.log('  LITELLM_API_BASE:', serverEnv.LITELLM_API_BASE ? '✅ Set' : '❌ Missing');
  console.log('  LITELLM_API_KEY:', serverEnv.LITELLM_API_KEY ? '✅ Set (hidden)' : '❌ Missing');
  console.log('  ✅ Server validation passed');
} catch (error) {
  console.log('  ❌ Server validation failed');
  console.log('  Missing required variables:', error.message.split('\\n')[0]);
}

// Test full environment
try {
  console.log('\\n🔧 Full Environment:');
  const env = getEnv();
  const configured = [];
  const missing = [];
  
  // Check required services
  if (env.LITELLM_API_BASE) configured.push('LiteLLM');
  else missing.push('LiteLLM');
  
  if (env.SUPABASE_SERVICE_ROLE_KEY) configured.push('Supabase');
  else missing.push('Supabase');
  
  // Check optional services
  if (env.VERCEL_TOKEN) configured.push('Vercel');
  if (env.REDIS_URL) configured.push('Redis');
  if (env.STRIPE_SECRET_KEY) configured.push('Stripe');
  
  console.log('  ✅ Configured services:', configured.join(', ') || 'None');
  if (missing.length > 0) {
    console.log('  ⚠️  Missing services:', missing.join(', '));
  }
  
  console.log('\\n  ✅ Full validation passed');
} catch (error) {
  console.log('  ❌ Full validation failed');
  if (error.errors) {
    console.log('\\n  Missing/Invalid variables:');
    error.errors.forEach(err => {
      console.log('    •', err.path.join('.'), '-', err.message);
    });
  }
}

console.log('\\n' + '=' .repeat(50));
console.log('\\n💡 Tips:');
console.log('  1. Copy .env.local.example to .env.local');
console.log('  2. Fill in the required values');
console.log('  3. Required: Supabase and LiteLLM configurations');
console.log('  4. Optional: Vercel, Redis, Stripe configurations');
`;

const testFilePath = path.join(__dirname, 'test-env-validation.mjs');
fs.writeFileSync(testFilePath, testFile);

// Try to run the test
try {
  const output = execSync(`node ${testFilePath}`, { 
    encoding: 'utf-8',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  console.log(output);
} catch (error) {
  // Error output is expected if env vars are missing
  console.log(error.stdout?.toString() || error.message);
}

// Clean up test file
fs.unlinkSync(testFilePath);

console.log('\n✅ Environment validation test complete!\n');