/**
 * Design Kit Performance Test
 * Simple script to measure the performance improvements
 */

import { designKits, getDesignKit } from './src/design-system';
import { createKitOptimizedPrompt, createMinimalPrompt } from '../ai-engine/prompts/selection-prompts';

// Test prompt generation performance
function testPromptGeneration() {
  const testCases = [
    { industry: 'saas', goal: 'landing page' },
    { industry: 'ecommerce', goal: 'product showcase' },
    { industry: 'corporate', goal: 'company website' },
    { industry: 'startup', goal: 'app landing page' },
  ];

  console.log('🧪 Prompt Generation Performance Test\n');
  
  testCases.forEach(({ industry, goal }) => {
    const context = { industry, businessType: industry };
    
    // Measure optimized prompt generation
    const start = performance.now();
    const optimizedPrompt = createKitOptimizedPrompt(`Create ${goal}`, context);
    const optimizedTime = performance.now() - start;
    
    // Measure minimal prompt generation  
    const start2 = performance.now();
    const minimalPrompt = createMinimalPrompt(industry, goal);
    const minimalTime = performance.now() - start2;
    
    // Calculate token estimates
    const optimizedTokens = Math.ceil(optimizedPrompt.length / 4);
    const minimalTokens = Math.ceil(minimalPrompt.length / 4);
    const oldTokenEstimate = 2000; // Legacy approach
    
    console.log(`📊 ${industry.toUpperCase()} - ${goal}`);
    console.log(`  Kit Optimized: ${optimizedTokens} tokens (${optimizedTime.toFixed(2)}ms)`);
    console.log(`  Minimal: ${minimalTokens} tokens (${minimalTime.toFixed(2)}ms)`);
    console.log(`  Legacy estimate: ${oldTokenEstimate} tokens`);
    console.log(`  Savings: ${Math.round((1 - optimizedTokens/oldTokenEstimate) * 100)}%\n`);
  });
}

// Test design kit functionality
function testDesignKits() {
  console.log('🎨 Design Kit Functionality Test\n');
  
  Object.entries(designKits).forEach(([kitId, kit]) => {
    console.log(`✅ ${kit.name} (${kitId})`);
    console.log(`  Industry: ${kit.targetIndustry.join(', ')}`);
    console.log(`  Style: ${kit.tokens.spacing} spacing, ${kit.tokens.borderRadius} radius`);
    console.log(`  Components: ${kit.componentPreferences.hero.length} hero options`);
    console.log('');
  });
}

// Test token calculation
function testTokenSavings() {
  console.log('📈 Token Savings Analysis\n');
  
  const testPrompt = "Create a modern SaaS landing page for a productivity tool";
  const context = { industry: 'saas' };
  
  // Old approach (simulated)
  const oldPrompt = `You are a website generator. Create a complete React component tree for: ${testPrompt}
  
  Generate:
  - Complete HTML structure
  - All CSS styling  
  - Component hierarchy
  - Content and copy
  - Props and configuration
  - Responsive design
  - Animations and effects
  
  Output format: Complete JSON with full component definitions...
  [... extensive prompt continues ...]`;
  
  // New approach  
  const newPrompt = createKitOptimizedPrompt(testPrompt, context);
  
  const oldTokens = Math.ceil(oldPrompt.length / 4);
  const newTokens = Math.ceil(newPrompt.length / 4);
  const savings = Math.round((1 - newTokens/oldTokens) * 100);
  
  console.log(`📊 Token Comparison:`);
  console.log(`  Legacy approach: ${oldTokens} tokens`);
  console.log(`  Kit-optimized: ${newTokens} tokens`); 
  console.log(`  Savings: ${savings}%`);
  console.log(`  Target achieved: ${savings >= 75 ? '✅' : '❌'} (target: 75%)`);
}

// Run all tests
async function runPerformanceTests() {
  console.log('🚀 Design Kit System Performance Tests\n');
  console.log('='.repeat(50) + '\n');
  
  testDesignKits();
  testPromptGeneration();
  testTokenSavings();
  
  console.log('='.repeat(50));
  console.log('✅ Performance tests completed!');
}

// Execute if run directly
if (require.main === module) {
  runPerformanceTests().catch(console.error);
}

export { runPerformanceTests, testPromptGeneration, testTokenSavings };