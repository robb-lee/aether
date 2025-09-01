/**
 * AI Engine Package
 * 
 * Unified interface for AI operations through LiteLLM
 */

// Export main client functions
export {
  generateCompletion,
  generateImage,
  streamCompletion,
  checkHealth,
  listModels,
  getModelCapabilities,
  litellm,
  type CompletionResponse,
  type ImageResponse,
  type StreamChunk,
  type HealthStatus,
} from './lib/litellm-client';

// Export error types
export {
  AIEngineError,
  ModelError,
  RateLimitError,
  ValidationError,
  QuotaExceededError,
  NetworkError,
  isRetryableError,
  getRetryDelay,
} from './lib/errors';

// Export configuration
export {
  config,
  modelRouting,
  modelSettings,
  costPerModel,
  retryConfig,
  loggingConfig,
  healthCheckConfig,
} from './config';