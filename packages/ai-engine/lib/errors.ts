/**
 * AI Engine Error Types
 * 
 * Custom error classes for better error handling and debugging
 */

export class AIEngineError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AIEngineError';
  }
}

export class ModelError extends AIEngineError {
  constructor(
    message: string,
    public model: string,
    public originalError?: any
  ) {
    super(message, 'MODEL_ERROR', 500, { model, originalError });
    this.name = 'ModelError';
  }
}

export class RateLimitError extends AIEngineError {
  constructor(
    message: string,
    public retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT', 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends AIEngineError {
  constructor(
    message: string,
    public validationErrors?: any
  ) {
    super(message, 'VALIDATION_ERROR', 400, { validationErrors });
    this.name = 'ValidationError';
  }
}

export class QuotaExceededError extends AIEngineError {
  constructor(
    message: string,
    public usage?: any
  ) {
    super(message, 'QUOTA_EXCEEDED', 402, { usage });
    this.name = 'QuotaExceededError';
  }
}

export class NetworkError extends AIEngineError {
  constructor(
    message: string,
    public originalError?: any
  ) {
    super(message, 'NETWORK_ERROR', 503, { originalError });
    this.name = 'NetworkError';
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof RateLimitError) return true;
  if (error instanceof NetworkError) return true;
  
  // Check for common retryable HTTP status codes
  const statusCode = error?.statusCode || error?.response?.status;
  if (statusCode && [429, 500, 502, 503, 504].includes(statusCode)) {
    return true;
  }
  
  // Check for network-related errors
  const message = error?.message?.toLowerCase() || '';
  if (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('econnrefused') ||
    message.includes('enotfound')
  ) {
    return true;
  }
  
  return false;
}

/**
 * Get retry delay based on error type
 */
export function getRetryDelay(error: any, attempt: number): number {
  // If error has explicit retry-after header
  if (error instanceof RateLimitError && error.retryAfter) {
    return error.retryAfter * 1000;
  }
  
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s
  const baseDelay = 1000;
  const maxDelay = 16000;
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.1 * delay;
  return delay + jitter;
}