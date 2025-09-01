/**
 * Test Usage Tracking Implementation
 * 
 * Quick test to verify LiteLLM cost tracking functionality
 */

// Test the cost calculation functions
import { estimateRequestCost, calculateCostCents } from './apps/web/lib/cost-tracker-simple.js';

console.log('🧪 Testing LiteLLM Cost Tracking Implementation\n');

// Test 1: Cost calculation for different models
console.log('📊 Model Cost Calculations:');
const models = ['claude-4-sonnet', 'gpt-5-mini', 'gpt-5'];
const testPrompt = 500; // 500 characters
const testResponse = 1000; // 1000 characters

models.forEach(model => {
  const cost = estimateRequestCost(model, testPrompt, testResponse);
  console.log(`  ${model}: $${(cost / 100).toFixed(4)} for ${testPrompt + testResponse} chars`);
});

// Test 2: Token cost calculation directly
console.log('\n🔢 Direct Token Cost Calculation:');
const testCases = [
  { model: 'claude-4-sonnet', promptTokens: 100, completionTokens: 200 },
  { model: 'gpt-5-mini', promptTokens: 100, completionTokens: 200 },
  { model: 'gpt-5', promptTokens: 100, completionTokens: 200 }
];

testCases.forEach(test => {
  const cost = calculateCostCents(test.model, test.promptTokens, test.completionTokens);
  console.log(`  ${test.model}: $${(cost / 100).toFixed(4)} (${test.promptTokens}+${test.completionTokens} tokens)`);
});

// Test 3: Quota calculations
console.log('\n💰 Quota Limits by Tier:');
const quotas = {
  free: 500,      // $5.00
  starter: 5000,  // $50.00
  pro: 20000,     // $200.00
  business: -1    // Unlimited
};

Object.entries(quotas).forEach(([tier, cents]) => {
  const formatted = cents === -1 ? 'Unlimited' : `$${(cents / 100).toFixed(2)}`;
  console.log(`  ${tier.toUpperCase()}: ${formatted} monthly`);
});

console.log('\n✅ LiteLLM Cost Tracking Implementation Test Complete!');
console.log('🌐 Usage Dashboard available at: http://localhost:3000/usage');
console.log('🔗 Simple API available at: http://localhost:3000/api/ai/usage/simple');