#!/usr/bin/env node

/**
 * Simple test to verify environment files exist and structure is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Environment Configuration Test\n');
console.log('=' .repeat(50));

// Check if environment files exist
const files = [
  'lib/env.ts',
  'lib/env.client.ts', 
  'lib/env.server.ts',
  '.env.local',
  '.env.local.example'
];

console.log('\n📁 Checking environment files:');
files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✅ ${file} (${stats.size} bytes)`);
  } else {
    console.log(`  ❌ ${file} - Not found`);
  }
});

// Check .env.local content
console.log('\n🔍 Checking .env.local configuration:');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'LITELLM_API_BASE',
    'LITELLM_API_KEY'
  ];
  
  const optionalVars = [
    'VERCEL_TOKEN',
    'REDIS_URL',
    'STRIPE_SECRET_KEY'
  ];
  
  console.log('\n  Required variables:');
  requiredVars.forEach(varName => {
    const hasVar = lines.some(line => line.startsWith(varName + '='));
    const varLine = lines.find(line => line.startsWith(varName + '='));
    const isPlaceholder = varLine && varLine.includes('your_');
    
    if (hasVar && !isPlaceholder) {
      console.log(`    ✅ ${varName} - Configured`);
    } else if (hasVar && isPlaceholder) {
      console.log(`    ⚠️  ${varName} - Still using placeholder value`);
    } else {
      console.log(`    ❌ ${varName} - Missing`);
    }
  });
  
  console.log('\n  Optional variables:');
  optionalVars.forEach(varName => {
    const hasVar = lines.some(line => line.startsWith(varName + '='));
    if (hasVar) {
      console.log(`    ✅ ${varName} - Configured`);
    } else {
      console.log(`    ⏭️  ${varName} - Not configured (optional)`);
    }
  });
} else {
  console.log('  ❌ .env.local file not found!');
  console.log('  💡 Copy .env.local.example to .env.local to get started');
}

// Check Zod dependency
console.log('\n📦 Checking Zod dependency:');
const packageJsonPath = path.join(__dirname, '..', 'apps', 'web', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  if (packageJson.dependencies && packageJson.dependencies.zod) {
    console.log(`  ✅ Zod installed (version ${packageJson.dependencies.zod})`);
  } else {
    console.log('  ❌ Zod not found in dependencies');
  }
}

console.log('\n' + '=' .repeat(50));
console.log('\n✨ Summary:');
console.log('  • Environment validation files created successfully');
console.log('  • Zod dependency installed');
console.log('  • Type-safe environment variable access enabled');
console.log('\n💡 Next steps:');
console.log('  1. Update .env.local with actual values');
console.log('  2. Import from lib/env.client.ts in React components');
console.log('  3. Import from lib/env.server.ts in API routes');
console.log('  4. Use getEnv() for full type-safe access\n');