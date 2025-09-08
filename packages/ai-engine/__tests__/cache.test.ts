/**
 * Redis Cache System Tests
 * 
 * Tests caching functionality including key generation, TTL, and statistics.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  getCachedResponse, 
  setCachedResponse, 
  invalidateCache,
  getCacheStats,
  resetCacheStats,
  getCacheHitRate,
  checkCacheHealth 
} from '../lib/cache';

describe('Redis Cache System', () => {
  beforeEach(async () => {
    // Clean cache before each test
    await invalidateCache();
    await resetCacheStats();
  });

  afterEach(async () => {
    // Clean up after tests
    await invalidateCache();
  });

  it('should cache and retrieve AI responses', async () => {
    const operation = 'completion';
    const model = process.env.AI_PRIMARY_MODEL!;
    const messages = [{ role: 'user', content: 'Hello world' }];
    const mockResponse = { 
      choices: [{ message: { content: 'Hello! How can I help?' } }],
      usage: { prompt_tokens: 10, completion_tokens: 15 }
    };
    const cost = 0.001;

    // Should return null initially (cache miss)
    const cached1 = await getCachedResponse(operation, model, messages);
    expect(cached1).toBeNull();

    // Store in cache
    await setCachedResponse(operation, model, messages, mockResponse, cost);

    // Should return cached response (cache hit)
    const cached2 = await getCachedResponse(operation, model, messages);
    expect(cached2).not.toBeNull();
    expect(cached2!.response).toEqual(mockResponse);
    expect(cached2!.model).toBe(model);
    expect(cached2!.cost).toBe(cost);
  });

  it('should not cache image generation operations', async () => {
    const operation = 'image';
    const model = process.env.AI_IMAGE_MODEL!;
    const prompt = 'A beautiful sunset';
    const mockResponse = { data: [{ url: 'https://example.com/image.jpg' }] };
    const cost = 0.04;

    // Should return null (not cacheable)
    const cached1 = await getCachedResponse(operation, model, prompt);
    expect(cached1).toBeNull();

    // Should not store in cache
    await setCachedResponse(operation, model, prompt, mockResponse, cost);

    // Should still return null (not cached)
    const cached2 = await getCachedResponse(operation, model, prompt);
    expect(cached2).toBeNull();
  });

  it('should track cache statistics', async () => {
    const operation = 'completion';
    const model = process.env.AI_PRIMARY_MODEL!;
    const messages1 = [{ role: 'user', content: 'Test 1' }];
    const messages2 = [{ role: 'user', content: 'Test 2' }];
    const mockResponse = { choices: [{ message: { content: 'Response' } }] };
    const cost = 0.002;

    // Initial stats should be zero
    const initialStats = await getCacheStats();
    expect(initialStats.hits).toBe(0);
    expect(initialStats.misses).toBe(0);

    // First request - miss
    await getCachedResponse(operation, model, messages1);
    let stats = await getCacheStats();
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(0);

    // Store and retrieve - hit
    await setCachedResponse(operation, model, messages1, mockResponse, cost);
    await getCachedResponse(operation, model, messages1);
    stats = await getCacheStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);

    // Different request - miss
    await getCachedResponse(operation, model, messages2);
    stats = await getCacheStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(2);

    // Hit rate should be 33.33% (1 hit out of 3 total)
    const hitRate = await getCacheHitRate();
    expect(hitRate).toBeCloseTo(33.33, 1);
  });

  it('should handle cache invalidation', async () => {
    const operation = 'completion';
    const model = process.env.AI_PRIMARY_MODEL!;
    const messages = [{ role: 'user', content: 'Test invalidation' }];
    const mockResponse = { choices: [{ message: { content: 'Response' } }] };
    const cost = 0.001;

    // Store multiple cache entries
    await setCachedResponse(operation, model, messages, mockResponse, cost);
    await setCachedResponse(operation, 'other-model', messages, mockResponse, cost);

    // Should have cached responses
    expect(await getCachedResponse(operation, model, messages)).not.toBeNull();

    // Invalidate all cache
    const deleted = await invalidateCache();
    expect(deleted).toBeGreaterThan(0);

    // Should no longer have cached responses
    expect(await getCachedResponse(operation, model, messages)).toBeNull();
  });

  it('should check cache health status', async () => {
    const health = await checkCacheHealth();
    
    expect(health).toHaveProperty('healthy');
    expect(health).toHaveProperty('redis');
    expect(health).toHaveProperty('connectionType');
    expect(health).toHaveProperty('stats');
    
    // Should be healthy (either real Redis or mock)
    expect(health.healthy).toBe(true);
    expect(['upstash', 'url', 'mock']).toContain(health.connectionType);
  });

  it('should generate different cache keys for different inputs', async () => {
    const operation = 'completion';
    const model = process.env.AI_PRIMARY_MODEL!;
    const messages1 = [{ role: 'user', content: 'Hello' }];
    const messages2 = [{ role: 'user', content: 'Hi' }];
    const mockResponse = { choices: [{ message: { content: 'Response' } }] };
    const cost = 0.001;

    // Store both responses
    await setCachedResponse(operation, model, messages1, mockResponse, cost);
    await setCachedResponse(operation, model, messages2, mockResponse, cost);

    // Should retrieve correct responses
    const cached1 = await getCachedResponse(operation, model, messages1);
    const cached2 = await getCachedResponse(operation, model, messages2);

    expect(cached1).not.toBeNull();
    expect(cached2).not.toBeNull();
    expect(cached1!.response).toEqual(mockResponse);
    expect(cached2!.response).toEqual(mockResponse);
  });
});