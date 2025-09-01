/**
 * AI Response Caching System
 * 
 * Provides intelligent caching for LiteLLM responses with:
 * - Content-based cache keys (prompt + model hash)
 * - TTL management (1 hour default)
 * - Statistics tracking (hit/miss, cost savings)
 * - Selective caching (excludes images, includes completion/chat)
 */

import { createHash } from 'crypto';
import { getRedisClient, checkRedisHealth } from './redis-client';

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_TTL: 3600, // 1 hour in seconds
  KEY_PREFIX: 'ai:cache',
  STATS_KEY: 'ai:cache:stats',
  // Operations to cache
  CACHEABLE_OPERATIONS: ['completion', 'chat'] as const,
  // Operations to exclude from caching
  EXCLUDED_OPERATIONS: ['image', 'stream'] as const,
} as const;

type CacheableOperation = typeof CACHE_CONFIG.CACHEABLE_OPERATIONS[number];
type ExcludedOperation = typeof CACHE_CONFIG.EXCLUDED_OPERATIONS[number];

interface CacheEntry {
  response: any;
  model: string;
  cost: number;
  timestamp: number;
  operation: string;
  metadata?: Record<string, any>;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  costSavings: number;
  averageResponseTime: number;
  lastReset: number;
}

/**
 * Generate cache key from request parameters
 */
function generateCacheKey(
  operation: string,
  model: string,
  messages: any[] | string,
  additionalParams?: Record<string, any>
): string {
  // Create content hash for consistent caching
  const content = Array.isArray(messages) 
    ? JSON.stringify(messages.map(m => ({ role: m.role, content: m.content })))
    : messages;
    
  // Include relevant parameters that affect output
  const relevantParams = additionalParams ? {
    temperature: additionalParams.temperature,
    max_tokens: additionalParams.max_tokens,
    top_p: additionalParams.top_p,
  } : {};
  
  const hashInput = JSON.stringify({
    operation,
    model,
    content,
    params: relevantParams,
  });
  
  const hash = createHash('sha256').update(hashInput).digest('hex').substring(0, 16);
  return `${CACHE_CONFIG.KEY_PREFIX}:${operation}:${model}:${hash}`;
}

/**
 * Check if operation should be cached
 */
function shouldCache(operation: string): operation is CacheableOperation {
  return CACHE_CONFIG.CACHEABLE_OPERATIONS.includes(operation as CacheableOperation);
}

/**
 * Get cached response if available
 */
export async function getCachedResponse(
  operation: string,
  model: string,
  messages: any[] | string,
  additionalParams?: Record<string, any>
): Promise<CacheEntry | null> {
  // Skip caching for excluded operations
  if (!shouldCache(operation)) {
    return null;
  }
  
  try {
    const redis = getRedisClient();
    const cacheKey = generateCacheKey(operation, model, messages, additionalParams);
    
    const cached = await redis.get(cacheKey);
    if (!cached) {
      await incrementStats('misses');
      return null;
    }
    
    // Parse cached entry
    const entry: CacheEntry = typeof cached === 'string' ? JSON.parse(cached) : cached;
    
    // Validate cache entry structure
    if (!entry || !entry.response || !entry.model || typeof entry.timestamp !== 'number') {
      console.warn('[Cache] Invalid cache entry, deleting:', cacheKey);
      await redis.del(cacheKey);
      await incrementStats('misses');
      return null;
    }
    
    await incrementStats('hits');
    await incrementStats('costSavings', entry.cost);
    
    console.log(`[Cache] HIT for ${operation}:${model} (saved $${entry.cost.toFixed(4)})`);
    return entry;
    
  } catch (error) {
    console.error('[Cache] Error retrieving from cache:', error);
    await incrementStats('misses');
    return null;
  }
}

/**
 * Store response in cache
 */
export async function setCachedResponse(
  operation: string,
  model: string,
  messages: any[] | string,
  response: any,
  cost: number,
  additionalParams?: Record<string, any>,
  ttl: number = CACHE_CONFIG.DEFAULT_TTL,
  metadata?: Record<string, any>
): Promise<void> {
  // Skip caching for excluded operations
  if (!shouldCache(operation)) {
    return;
  }
  
  try {
    const redis = getRedisClient();
    const cacheKey = generateCacheKey(operation, model, messages, additionalParams);
    
    const entry: CacheEntry = {
      response,
      model,
      cost,
      timestamp: Date.now(),
      operation,
      metadata,
    };
    
    await redis.set(cacheKey, JSON.stringify(entry), { ex: ttl });
    console.log(`[Cache] STORED ${operation}:${model} (cost: $${cost.toFixed(4)}, TTL: ${ttl}s)`);
    
  } catch (error) {
    console.error('[Cache] Error storing in cache:', error);
    // Don't throw - caching is optional
  }
}

/**
 * Invalidate cache entries by pattern
 */
export async function invalidateCache(pattern?: string): Promise<number> {
  try {
    const redis = getRedisClient();
    const searchPattern = pattern || `${CACHE_CONFIG.KEY_PREFIX}:*`;
    
    const keys = await redis.keys(searchPattern);
    if (keys.length === 0) return 0;
    
    const deleted = await redis.del(...keys);
    console.log(`[Cache] Invalidated ${deleted} entries matching: ${searchPattern}`);
    
    return deleted;
  } catch (error) {
    console.error('[Cache] Error invalidating cache:', error);
    return 0;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<CacheStats> {
  const defaultStats: CacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    costSavings: 0,
    averageResponseTime: 0,
    lastReset: Date.now(),
  };
  
  try {
    const redis = getRedisClient();
    const stats = await redis.get(CACHE_CONFIG.STATS_KEY);
    
    if (!stats) return defaultStats;
    
    const parsed = typeof stats === 'string' ? JSON.parse(stats) : stats;
    return { ...defaultStats, ...parsed };
  } catch (error) {
    console.error('[Cache] Error getting stats:', error);
    return defaultStats;
  }
}

/**
 * Update cache statistics
 */
async function incrementStats(metric: keyof CacheStats, value: number = 1): Promise<void> {
  try {
    const redis = getRedisClient();
    const currentStats = await getCacheStats();
    
    const updatedStats: CacheStats = {
      ...currentStats,
      [metric]: currentStats[metric] + value,
      totalRequests: metric === 'hits' || metric === 'misses' 
        ? currentStats.totalRequests + 1 
        : currentStats.totalRequests,
    };
    
    await redis.set(CACHE_CONFIG.STATS_KEY, JSON.stringify(updatedStats));
  } catch (error) {
    console.error('[Cache] Error updating stats:', error);
  }
}

/**
 * Reset cache statistics
 */
export async function resetCacheStats(): Promise<void> {
  try {
    const redis = getRedisClient();
    const resetStats: CacheStats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      costSavings: 0,
      averageResponseTime: 0,
      lastReset: Date.now(),
    };
    
    await redis.set(CACHE_CONFIG.STATS_KEY, JSON.stringify(resetStats));
    console.log('[Cache] Statistics reset');
  } catch (error) {
    console.error('[Cache] Error resetting stats:', error);
  }
}

/**
 * Get cache hit rate as percentage
 */
export async function getCacheHitRate(): Promise<number> {
  const stats = await getCacheStats();
  if (stats.totalRequests === 0) return 0;
  return (stats.hits / stats.totalRequests) * 100;
}

/**
 * Health check for cache system
 */
export async function checkCacheHealth(): Promise<{
  healthy: boolean;
  redis: boolean;
  stats: CacheStats;
  connectionType: string;
  error?: string;
}> {
  try {
    const redisHealth = await checkRedisHealth();
    const stats = await getCacheStats();
    
    return {
      healthy: redisHealth.connected,
      redis: redisHealth.connected,
      stats,
      connectionType: redisHealth.type,
      error: redisHealth.error,
    };
  } catch (error) {
    return {
      healthy: false,
      redis: false,
      stats: await getCacheStats(),
      connectionType: 'unknown',
      error: error.message,
    };
  }
}

// Export cache configuration for external use
export { CACHE_CONFIG };