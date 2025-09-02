/**
 * Fallback Configuration and Tracking
 * 
 * Manages model fallback chains, tracks usage, and provides analytics
 * for cost optimization and reliability monitoring.
 */

import { costPerModel } from '../config';

export interface FallbackMetrics {
  modelUsed: string;
  originalModel: string;
  fallbackLevel: number; // 0 = primary, 1 = first fallback, etc.
  timestamp: number;
  operation: string;
  cost: number;
  success: boolean;
  errorReason?: string;
  responseTime?: number;
}

export interface FallbackStats {
  totalRequests: number;
  fallbackRequests: number;
  fallbackRate: number;
  costImpact: number; // Additional cost due to fallbacks
  modelReliability: Record<string, {
    attempts: number;
    successes: number;
    failures: number;
    reliability: number; // success rate 0-1
    avgResponseTime: number;
  }>;
}

class FallbackTracker {
  private metrics: FallbackMetrics[] = [];
  private readonly maxStoredMetrics = 1000; // Keep last 1000 requests

  /**
   * Record a fallback event
   */
  recordFallback(metrics: FallbackMetrics) {
    this.metrics.push(metrics);
    
    // Keep only recent metrics to prevent memory issues
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics = this.metrics.slice(-this.maxStoredMetrics);
    }

    // Log significant fallback events
    if (metrics.fallbackLevel > 0) {
      console.warn(`[Fallback] ${metrics.originalModel} → ${metrics.modelUsed} (Level ${metrics.fallbackLevel})`);
    }
  }

  /**
   * Get fallback statistics for the last N requests
   */
  getStats(lastNRequests?: number): FallbackStats {
    const recentMetrics = lastNRequests 
      ? this.metrics.slice(-lastNRequests)
      : this.metrics;

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        fallbackRequests: 0,
        fallbackRate: 0,
        costImpact: 0,
        modelReliability: {},
      };
    }

    const totalRequests = recentMetrics.length;
    const fallbackRequests = recentMetrics.filter(m => m.fallbackLevel > 0).length;
    const fallbackRate = fallbackRequests / totalRequests;

    // Calculate cost impact of fallbacks
    let totalCost = 0;
    let fallbackCost = 0;
    
    for (const metric of recentMetrics) {
      totalCost += metric.cost;
      if (metric.fallbackLevel > 0) {
        // Calculate what the cost would have been with original model
        const originalCost = this.estimateCost(metric.originalModel, metric.cost);
        fallbackCost += Math.abs(metric.cost - originalCost);
      }
    }

    // Calculate model reliability
    const modelReliability: Record<string, { attempts: number; successes: number; failures: number; reliability: number; avgResponseTime: number; responseTimes?: number[] }> = {};
    
    for (const metric of recentMetrics) {
      const model = metric.modelUsed;
      if (!modelReliability[model]) {
        modelReliability[model] = {
          attempts: 0,
          successes: 0,
          failures: 0,
          reliability: 0,
          avgResponseTime: 0,
          responseTimes: [],
        };
      }
      
      modelReliability[model].attempts++;
      if (metric.success) {
        modelReliability[model].successes++;
      } else {
        modelReliability[model].failures++;
      }
      
      if (metric.responseTime && modelReliability[model].responseTimes) {
        modelReliability[model].responseTimes.push(metric.responseTime);
      }
    }

    // Calculate final reliability metrics
    for (const model in modelReliability) {
      const stats = modelReliability[model];
      stats.reliability = stats.successes / stats.attempts;
      stats.avgResponseTime = (stats.responseTimes && stats.responseTimes.length > 0)
        ? stats.responseTimes.reduce((a: number, b: number) => a + b, 0) / stats.responseTimes.length
        : 0;
      delete stats.responseTimes; // Clean up temp data
    }

    return {
      totalRequests,
      fallbackRequests,
      fallbackRate,
      costImpact: fallbackCost,
      modelReliability,
    };
  }

  /**
   * Get recommended model based on current reliability stats
   */
  getRecommendedModel(task: string, currentModel: string): string {
    const stats = this.getStats(100); // Last 100 requests
    const modelStats = stats.modelReliability[currentModel];

    // If current model has good reliability (>90%), keep using it
    if (modelStats && modelStats.reliability > 0.9) {
      return currentModel;
    }

    // Find most reliable model for this task
    let bestModel = currentModel;
    let bestReliability = modelStats?.reliability || 0;

    for (const [model, modelReliabilityEntry] of Object.entries(stats.modelReliability)) {
      if (modelReliabilityEntry.reliability > bestReliability && modelReliabilityEntry.attempts >= 5) {
        bestModel = model;
        bestReliability = modelReliabilityEntry.reliability;
      }
    }

    return bestModel;
  }

  /**
   * Check if we should temporarily avoid a model
   */
  shouldAvoidModel(model: string, threshold = 0.3): boolean {
    const stats = this.getStats(50); // Last 50 requests
    const modelStats = stats.modelReliability[model];
    
    // Avoid model if reliability is below threshold and we have enough data
    return modelStats && modelStats.attempts >= 10 && modelStats.reliability < threshold;
  }

  /**
   * Estimate cost for a model (rough approximation)
   */
  private estimateCost(model: string, actualCost: number): number {
    const modelCostData = costPerModel[model as keyof typeof costPerModel];
    if (!modelCostData) return actualCost;
    
    // This is a rough approximation - in practice you'd need token counts
    return actualCost;
  }

  /**
   * Clear old metrics (for memory management)
   */
  clearOldMetrics(olderThanHours = 24) {
    const cutoff = Date.now() - (olderThanHours * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }

  /**
   * Export metrics for external analysis
   */
  exportMetrics(): FallbackMetrics[] {
    return [...this.metrics];
  }

  /**
   * Import metrics (for session restoration)
   */
  importMetrics(metrics: FallbackMetrics[]) {
    this.metrics = metrics.slice(-this.maxStoredMetrics);
  }
}

// Global fallback tracker instance
export const fallbackTracker = new FallbackTracker();

/**
 * Utility function to create and record fallback metrics
 */
export function createFallbackMetric(
  modelUsed: string,
  originalModel: string,
  operation: string,
  cost: number,
  success: boolean,
  options: {
    errorReason?: string;
    responseTime?: number;
    metadata?: Record<string, any>;
  } = {}
): FallbackMetrics {
  const fallbackLevel = originalModel === modelUsed ? 0 : 1;
  
  const metric: FallbackMetrics = {
    modelUsed,
    originalModel,
    fallbackLevel,
    timestamp: Date.now(),
    operation,
    cost,
    success,
    ...options,
  };

  fallbackTracker.recordFallback(metric);
  return metric;
}

/**
 * Get current fallback health status
 */
export function getFallbackHealth(): {
  status: 'healthy' | 'degraded' | 'critical';
  message: string;
  stats: FallbackStats;
} {
  const stats = fallbackTracker.getStats(100);
  
  if (stats.totalRequests === 0) {
    return {
      status: 'healthy',
      message: 'No recent requests',
      stats,
    };
  }

  const fallbackRate = stats.fallbackRate;
  
  if (fallbackRate < 0.1) {
    return {
      status: 'healthy',
      message: 'All models operating normally',
      stats,
    };
  }
  
  if (fallbackRate < 0.3) {
    return {
      status: 'degraded',
      message: 'Some models experiencing issues, fallbacks working',
      stats,
    };
  }
  
  return {
    status: 'critical',
    message: 'High fallback rate detected, investigate model issues',
    stats,
  };
}

/**
 * Configuration for model circuit breaker pattern
 */
export const circuitBreakerConfig = {
  failureThreshold: 5, // failures before opening circuit
  recoveryTimeout: 60000, // ms before trying again
  halfOpenMaxCalls: 3, // calls to test recovery
};

export interface CircuitState {
  model: string;
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

/**
 * Simple circuit breaker for model availability
 */
export class ModelCircuitBreaker {
  private circuits: Map<string, CircuitState> = new Map();

  canAttempt(model: string): boolean {
    const circuit = this.circuits.get(model);
    if (!circuit) return true;

    const now = Date.now();

    switch (circuit.state) {
      case 'closed':
        return true;
      case 'open':
        if (now >= circuit.nextAttemptTime) {
          circuit.state = 'half-open';
          return true;
        }
        return false;
      case 'half-open':
        return true;
      default:
        return true;
    }
  }

  recordSuccess(model: string) {
    const circuit = this.circuits.get(model);
    if (circuit) {
      circuit.failures = 0;
      circuit.state = 'closed';
    }
  }

  recordFailure(model: string) {
    let circuit = this.circuits.get(model);
    if (!circuit) {
      circuit = {
        model,
        state: 'closed',
        failures: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0,
      };
      this.circuits.set(model, circuit);
    }

    circuit.failures++;
    circuit.lastFailureTime = Date.now();

    if (circuit.failures >= circuitBreakerConfig.failureThreshold) {
      circuit.state = 'open';
      circuit.nextAttemptTime = Date.now() + circuitBreakerConfig.recoveryTimeout;
    }
  }

  getCircuitState(model: string): CircuitState | null {
    return this.circuits.get(model) || null;
  }

  reset(model?: string) {
    if (model) {
      this.circuits.delete(model);
    } else {
      this.circuits.clear();
    }
  }
}

export const modelCircuitBreaker = new ModelCircuitBreaker();