/**
 * Error Handling Tests
 * 
 * Tests the comprehensive error handling system including:
 * - Error boundaries, fallback chains, and user messaging
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ErrorHandler, handleAPIError } from '../lib/error-handler';
import { config } from '../config';
import { 
  ModelError, 
  RateLimitError, 
  ValidationError, 
  QuotaExceededError,
  NetworkError 
} from '../lib/errors';
import { 
  fallbackTracker, 
  createFallbackMetric, 
  getFallbackHealth,
  modelCircuitBreaker
} from '../lib/fallback-config';

describe('Error Handler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
    // Reset circuit breaker state
    modelCircuitBreaker.reset();
  });

  describe('Error Analysis', () => {
    it('should handle Model errors correctly', async () => {
      const error = new ModelError('Model unavailable', config.AI_PRIMARY_MODEL);
      const result = await errorHandler.handleError(error, {
        operation: 'test-completion',
        model: config.AI_PRIMARY_MODEL
      });

      expect(result.shouldRetry).toBe(true);
      expect(result.userMessage).toContain('backup models');
      expect(result.recoveryAction).toBe('fallback');
    });

    it('should handle Rate Limit errors correctly', async () => {
      const error = new RateLimitError('Rate limited', 30);
      const result = await errorHandler.handleError(error, {
        operation: 'test-completion'
      });

      expect(result.shouldRetry).toBe(true);
      expect(result.userMessage).toContain('30 seconds');
      expect(result.recoveryAction).toBe('retry');
    });

    it('should handle Validation errors correctly', async () => {
      const error = new ValidationError('Invalid input');
      const result = await errorHandler.handleError(error, {
        operation: 'test-validation'
      });

      expect(result.shouldRetry).toBe(false);
      expect(result.userMessage).toContain('check your input');
      expect(result.recoveryAction).toBe('abort');
    });

    it('should handle Quota errors correctly', async () => {
      const error = new QuotaExceededError('Quota exceeded');
      const result = await errorHandler.handleError(error, {
        operation: 'test-generation'
      });

      expect(result.shouldRetry).toBe(false);
      expect(result.userMessage).toContain('usage limit');
      expect(result.recoveryAction).toBe('abort');
    });
  });

  describe('API Error Handling', () => {
    it('should convert generic errors to user-friendly format', () => {
      const error = new Error('Something went wrong');
      const result = handleAPIError(error, 'Test Operation');

      expect(result.error).toBe('Something went wrong');
      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.statusCode).toBe(500);
    });

    it('should handle HTTP status codes', () => {
      const error = { response: { status: 429 }, message: 'Too many requests' };
      const result = handleAPIError(error, 'Test Operation');

      expect(result.error).toContain('Too many requests');
      expect(result.code).toBe('RATE_LIMIT');
      expect(result.statusCode).toBe(429);
    });
  });
});

describe('Fallback Tracking', () => {
  beforeEach(() => {
    // Clear metrics before each test
    fallbackTracker.importMetrics([]);
  });

  it('should record successful primary model usage', () => {
    createFallbackMetric(
      config.AI_PRIMARY_MODEL,
      config.AI_PRIMARY_MODEL, 
      'completion',
      0.05,
      true,
      { responseTime: 1200 }
    );

    const stats = fallbackTracker.getStats();
    expect(stats.totalRequests).toBe(1);
    expect(stats.fallbackRequests).toBe(0);
    expect(stats.fallbackRate).toBe(0);
  });

  it('should record fallback usage', () => {
    createFallbackMetric(
      'gpt-5-mini',
      config.AI_PRIMARY_MODEL,
      'completion', 
      0.02,
      true,
      { responseTime: 800 }
    );

    const stats = fallbackTracker.getStats();
    expect(stats.totalRequests).toBe(1);
    expect(stats.fallbackRequests).toBe(1);
    expect(stats.fallbackRate).toBe(1);
  });

  it('should calculate model reliability', () => {
    // Add successful request
    createFallbackMetric(config.AI_PRIMARY_MODEL, config.AI_PRIMARY_MODEL, 'completion', 0.05, true);
    
    // Add failed request
    createFallbackMetric(config.AI_PRIMARY_MODEL, config.AI_PRIMARY_MODEL, 'completion', 0, false, {
      errorReason: 'Model timeout'
    });

    const stats = fallbackTracker.getStats();
    const claudeStats = stats.modelReliability[config.AI_PRIMARY_MODEL];
    
    expect(claudeStats.attempts).toBe(2);
    expect(claudeStats.successes).toBe(1);
    expect(claudeStats.failures).toBe(1);
    expect(claudeStats.reliability).toBe(0.5);
  });

  it('should provide health status', () => {
    // Add mostly successful requests (19 primary + 1 fallback = 5% fallback rate)
    for (let i = 0; i < 19; i++) {
      createFallbackMetric(config.AI_PRIMARY_MODEL, config.AI_PRIMARY_MODEL, 'completion', 0.05, true);
    }
    
    // Add one fallback
    createFallbackMetric('gpt-5-mini', config.AI_PRIMARY_MODEL, 'completion', 0.02, true);

    const health = getFallbackHealth();
    expect(health.status).toBe('healthy'); // 5% fallback rate < 10%
    expect(health.stats.fallbackRate).toBe(0.05);
  });
});

describe('Circuit Breaker', () => {
  beforeEach(() => {
    modelCircuitBreaker.reset();
  });

  it('should allow attempts for healthy models', () => {
    expect(modelCircuitBreaker.canAttempt(config.AI_PRIMARY_MODEL)).toBe(true);
  });

  it('should open circuit after multiple failures', () => {
    const model = config.AI_PRIMARY_MODEL;
    
    // Record 5 failures (threshold)
    for (let i = 0; i < 5; i++) {
      modelCircuitBreaker.recordFailure(model);
    }

    expect(modelCircuitBreaker.canAttempt(model)).toBe(false);
    
    const state = modelCircuitBreaker.getCircuitState(model);
    expect(state?.state).toBe('open');
  });

  it('should reset circuit on success', () => {
    const model = config.AI_PRIMARY_MODEL;
    
    // Record failures
    modelCircuitBreaker.recordFailure(model);
    modelCircuitBreaker.recordFailure(model);
    
    // Record success
    modelCircuitBreaker.recordSuccess(model);
    
    const state = modelCircuitBreaker.getCircuitState(model);
    expect(state?.failures).toBe(0);
    expect(state?.state).toBe('closed');
  });
});