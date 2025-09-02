/**
 * Upstash Redis Client for LiteLLM Response Caching
 * 
 * Provides Redis connection management with automatic fallback to mock client
 * when Redis is unavailable or not configured.
 */

import { Redis } from '@upstash/redis';

// Redis configuration from environment
const config = {
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
};

// Mock Redis client for development/testing
class MockRedisClient {
  private cache = new Map<string, { value: any; expires: number }>();
  
  async get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check expiration
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  async set(key: string, value: any, options?: { ex?: number }) {
    const expires = options?.ex ? Date.now() + (options.ex * 1000) : Infinity;
    // Store as string like real Redis
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    this.cache.set(key, { value: stringValue, expires });
    return 'OK';
  }
  
  async del(key: string | string[]) {
    const keys = Array.isArray(key) ? key : [key];
    let deleted = 0;
    keys.forEach(k => {
      if (this.cache.delete(k)) deleted++;
    });
    return deleted;
  }
  
  async flushall() {
    const size = this.cache.size;
    this.cache.clear();
    return size;
  }
  
  async ping() {
    return 'PONG';
  }
  
  async keys(pattern: string) {
    // Simple pattern matching for mock
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return Array.from(this.cache.keys()).filter(key => regex.test(key));
  }
}

// Initialize Redis client
let redisClient: Redis | MockRedisClient;
let isConnected = false;
let connectionType: 'upstash' | 'url' | 'mock' = 'mock';

async function initializeRedis() {
  try {
    // Try Upstash REST API first
    if (config.UPSTASH_REDIS_REST_URL && config.UPSTASH_REDIS_REST_TOKEN) {
      redisClient = new Redis({
        url: config.UPSTASH_REDIS_REST_URL,
        token: config.UPSTASH_REDIS_REST_TOKEN,
      });
      
      // Test connection
      await redisClient.ping();
      isConnected = true;
      connectionType = 'upstash';
      console.log('[Redis] Connected to Upstash Redis via REST API');
      return;
    }
    
    // Try Redis URL
    if (config.REDIS_URL) {
      redisClient = Redis.fromEnv();
      await redisClient.ping();
      isConnected = true;
      connectionType = 'url';
      console.log('[Redis] Connected via REDIS_URL');
      return;
    }
    
    throw new Error('No Redis configuration found');
    
  } catch (error) {
    console.warn('[Redis] Using mock client:', (error as Error).message);
    redisClient = new MockRedisClient();
    isConnected = true;
    connectionType = 'mock';
  }
}

// Initialize on module load
initializeRedis();

/**
 * Get Redis client instance
 */
export function getRedisClient(): Redis | MockRedisClient {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

/**
 * Check Redis connection status
 */
export async function checkRedisHealth(): Promise<{
  connected: boolean;
  type: 'upstash' | 'url' | 'mock';
  latency?: number;
  error?: string;
}> {
  try {
    const startTime = Date.now();
    await redisClient.ping();
    const latency = Date.now() - startTime;
    
    return {
      connected: isConnected,
      type: connectionType,
      latency,
    };
  } catch (error) {
    return {
      connected: false,
      type: connectionType,
      error: (error as Error).message,
    };
  }
}

/**
 * Reconnect to Redis (useful for handling connection failures)
 */
export async function reconnectRedis(): Promise<void> {
  isConnected = false;
  await initializeRedis();
}

export { Redis } from '@upstash/redis';