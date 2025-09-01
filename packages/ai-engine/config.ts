/**
 * AI Engine Configuration
 * 
 * Central configuration for AI models, routing, and behavior
 */

import { z } from 'zod';

// Environment validation schema
export const envSchema = z.object({
  LITELLM_API_BASE: z.string().url().optional().default('http://localhost:4000'),
  LITELLM_API_KEY: z.string().min(1),
  AI_PRIMARY_MODEL: z.string().default('gpt-4-turbo-preview'),
  AI_FALLBACK_MODEL: z.string().default('claude-3-haiku'),
  AI_IMAGE_MODEL: z.string().default('dall-e-3'),
  AI_MAX_RETRIES: z.string().optional().transform(val => val ? parseInt(val) : 3),
  AI_TIMEOUT: z.string().optional().transform(val => val ? parseInt(val) : 60000),
  AI_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
});

export const config = envSchema.parse(process.env);

// Model routing configuration
export const modelRouting = {
  // Task-specific model selection
  tasks: {
    structure: 'gpt-4-turbo-preview',    // Site structure generation
    content: 'claude-3-opus',             // Content writing
    seo: 'claude-3-haiku',                // SEO optimization
    code: 'gpt-4-turbo-preview',          // Code generation
    images: 'dall-e-3',                   // Image generation
    analysis: 'claude-3-opus',            // Complex analysis
    simple: 'gpt-3.5-turbo',             // Simple tasks
  },
  
  // Fallback chain for each primary model
  fallbackChains: {
    'gpt-4-turbo-preview': ['gpt-4', 'claude-3-opus', 'claude-3-haiku'],
    'claude-3-opus': ['claude-3-sonnet', 'claude-3-haiku', 'gpt-4-turbo-preview'],
    'claude-3-haiku': ['claude-3-sonnet', 'gpt-3.5-turbo'],
    'gpt-3.5-turbo': ['claude-3-haiku'],
    'dall-e-3': ['dall-e-2'],
  },
};

// Model-specific settings
export const modelSettings = {
  'gpt-4-turbo-preview': {
    maxTokens: 4096,
    temperature: 0.7,
    responseFormat: { type: 'json_object' },
    topP: 0.95,
  },
  'gpt-4': {
    maxTokens: 4096,
    temperature: 0.7,
    responseFormat: { type: 'json_object' },
    topP: 0.95,
  },
  'claude-3-opus': {
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.95,
  },
  'claude-3-sonnet': {
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.95,
  },
  'claude-3-haiku': {
    maxTokens: 4096,
    temperature: 0.8,
    topP: 0.95,
  },
  'gpt-3.5-turbo': {
    maxTokens: 4096,
    temperature: 0.7,
    responseFormat: { type: 'json_object' },
    topP: 0.95,
  },
  'dall-e-3': {
    size: '1024x1024',
    quality: 'standard',
    n: 1,
  },
  'dall-e-2': {
    size: '1024x1024',
    n: 1,
  },
};

// Cost tracking (per 1K tokens or per image)
export const costPerModel = {
  'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'dall-e-3': { image: 0.04 },
  'dall-e-2': { image: 0.02 },
};

// Retry configuration
export const retryConfig = {
  maxRetries: config.AI_MAX_RETRIES,
  timeout: config.AI_TIMEOUT,
  backoffMultiplier: 2,
  maxBackoff: 16000,
  jitterFactor: 0.1,
};

// Logging configuration
export const loggingConfig = {
  level: config.AI_LOG_LEVEL,
  logRequests: config.AI_LOG_LEVEL === 'debug',
  logResponses: config.AI_LOG_LEVEL === 'debug',
  logCosts: true,
  logErrors: true,
};

// Health check configuration
export const healthCheckConfig = {
  interval: 30000, // 30 seconds
  timeout: 5000,   // 5 seconds
  retries: 2,
};