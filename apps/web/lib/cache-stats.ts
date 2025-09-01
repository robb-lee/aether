/**
 * Cache Statistics Dashboard
 * 
 * Provides analytics and monitoring for AI response caching system.
 * Tracks performance metrics, cost savings, and cache efficiency.
 */

import { getCacheStats, getCacheHitRate, checkCacheHealth } from '@aether/ai-engine/lib/cache';

export interface CacheDashboard {
  performance: {
    hitRate: number;
    totalRequests: number;
    averageResponseTime: number;
    cacheLatency: number;
  };
  costs: {
    totalSaved: number;
    estimatedMonthlySavings: number;
    averageCostPerRequest: number;
  };
  health: {
    cacheOnline: boolean;
    redisType: string;
    lastCheck: string;
    errors?: string[];
  };
  trends: {
    hitsToday: number;
    missesToday: number;
    savingsToday: number;
  };
}

/**
 * Get comprehensive cache dashboard data
 */
export async function getCacheDashboard(): Promise<CacheDashboard> {
  const [stats, hitRate, health] = await Promise.all([
    getCacheStats(),
    getCacheHitRate(),
    checkCacheHealth(),
  ]);
  
  // Calculate trends (simplified for MVP)
  const hoursActive = Math.max(1, (Date.now() - stats.lastReset) / (1000 * 60 * 60));
  const dailyProjection = {
    hits: Math.round((stats.hits / hoursActive) * 24),
    misses: Math.round((stats.misses / hoursActive) * 24),
    savings: (stats.costSavings / hoursActive) * 24,
  };
  
  return {
    performance: {
      hitRate: Math.round(hitRate * 100) / 100, // 2 decimal places
      totalRequests: stats.totalRequests,
      averageResponseTime: stats.averageResponseTime,
      cacheLatency: health.redis ? 50 : 0, // Estimated cache latency
    },
    costs: {
      totalSaved: Math.round(stats.costSavings * 10000) / 10000, // 4 decimal places
      estimatedMonthlySavings: dailyProjection.savings * 30,
      averageCostPerRequest: stats.totalRequests > 0 
        ? stats.costSavings / stats.totalRequests 
        : 0,
    },
    health: {
      cacheOnline: health.healthy,
      redisType: health.connectionType,
      lastCheck: new Date().toISOString(),
      errors: health.error ? [health.error] : undefined,
    },
    trends: {
      hitsToday: dailyProjection.hits,
      missesToday: dailyProjection.misses,
      savingsToday: Math.round(dailyProjection.savings * 10000) / 10000,
    },
  };
}

/**
 * Get cache efficiency metrics
 */
export async function getCacheEfficiencyMetrics(): Promise<{
  efficiency: number;
  recommendations: string[];
  status: 'excellent' | 'good' | 'poor' | 'disabled';
}> {
  const hitRate = await getCacheHitRate();
  const health = await checkCacheHealth();
  const recommendations: string[] = [];
  
  if (!health.healthy) {
    return {
      efficiency: 0,
      recommendations: ['Enable Redis caching for cost savings'],
      status: 'disabled',
    };
  }
  
  let status: 'excellent' | 'good' | 'poor' = 'good';
  
  if (hitRate >= 80) {
    status = 'excellent';
  } else if (hitRate < 30) {
    status = 'poor';
    recommendations.push('Consider increasing cache TTL');
    recommendations.push('Review prompt consistency');
  }
  
  if (health.stats.totalRequests < 10) {
    recommendations.push('More requests needed for accurate metrics');
  }
  
  return {
    efficiency: Math.round(hitRate * 100) / 100,
    recommendations,
    status,
  };
}

/**
 * Calculate potential cost savings
 */
export async function calculatePotentialSavings(
  requestsPerDay: number,
  averageCostPerRequest: number,
  expectedHitRate: number = 0.6
): Promise<{
  dailySavings: number;
  monthlySavings: number;
  yearlySavings: number;
}> {
  const hitRequests = requestsPerDay * expectedHitRate;
  const dailySavings = hitRequests * averageCostPerRequest;
  
  return {
    dailySavings: Math.round(dailySavings * 10000) / 10000,
    monthlySavings: Math.round(dailySavings * 30 * 100) / 100,
    yearlySavings: Math.round(dailySavings * 365 * 100) / 100,
  };
}

/**
 * Export cache statistics for monitoring
 */
export async function exportCacheMetrics(): Promise<{
  timestamp: string;
  metrics: CacheDashboard;
  rawStats: any;
}> {
  const [dashboard, rawStats] = await Promise.all([
    getCacheDashboard(),
    getCacheStats(),
  ]);
  
  return {
    timestamp: new Date().toISOString(),
    metrics: dashboard,
    rawStats,
  };
}