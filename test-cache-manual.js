/**
 * Manual Cache Testing Script
 * Tests cache functionality with real LiteLLM integration
 */

const { generateCompletion, checkHealth } = require('./packages/ai-engine/lib/litellm-client.ts');
const { getCacheStats, getCacheHitRate, checkCacheHealth } = require('./packages/ai-engine/lib/cache.ts');

async function testCaching() {
  console.log('🧪 Testing Redis Cache Integration\n');

  try {
    // Test 1: Health check
    console.log('1. Health Check');
    const health = await checkHealth();
    console.log('   LiteLLM:', health.litellm ? '✅' : '❌');
    console.log('   Cache:', health.cache ? '✅' : '❌');
    console.log('   Models:', Object.keys(health.models).length);
    console.log();

    // Test 2: Cache functionality
    console.log('2. Cache Functionality Test');
    const testMessages = [
      { role: 'user', content: 'What is 2+2? Answer in one word.' }
    ];

    console.log('   First request (should be cache MISS)...');
    const start1 = Date.now();
    const response1 = await generateCompletion({
      messages: testMessages,
      task: 'content',
    });
    const time1 = Date.now() - start1;
    console.log(`   ⏱️  Time: ${time1}ms, Cost: $${response1.cost.toFixed(4)}, Cached: ${response1.cached || false}`);

    console.log('   Second request (should be cache HIT)...');
    const start2 = Date.now();
    const response2 = await generateCompletion({
      messages: testMessages,
      task: 'content',
    });
    const time2 = Date.now() - start2;
    console.log(`   ⏱️  Time: ${time2}ms, Cost: $${response2.cost.toFixed(4)}, Cached: ${response2.cached || false}`);

    // Test 3: Statistics
    console.log('\n3. Cache Statistics');
    const stats = await getCacheStats();
    const hitRate = await getCacheHitRate();
    console.log(`   Hits: ${stats.hits}, Misses: ${stats.misses}`);
    console.log(`   Hit Rate: ${hitRate.toFixed(1)}%`);
    console.log(`   Cost Savings: $${stats.costSavings.toFixed(4)}`);
    
    // Performance comparison
    const speedup = time1 / Math.max(time2, 1);
    console.log(`   Speed Improvement: ${speedup.toFixed(1)}x faster`);

    console.log('\n✅ Cache testing completed successfully!');

  } catch (error) {
    console.error('❌ Cache test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testCaching();