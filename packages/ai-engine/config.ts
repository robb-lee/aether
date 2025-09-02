/**
 * AI Engine Configuration
 * 
 * Central configuration for AI models, routing, and behavior
 */

import { z } from 'zod';

// Environment variables are automatically loaded by Next.js

// Environment validation schema
export const envSchema = z.object({
  LITELLM_API_BASE: z.string().url(),
  LITELLM_API_KEY: z.string().min(1),
  AI_PRIMARY_MODEL: z.string().min(1),
  AI_FALLBACK_MODEL: z.string().default('gpt-5-mini'),
  AI_IMAGE_MODEL: z.string().default('dall-e-3'),
  AI_MAX_RETRIES: z.string().optional().transform(val => val ? parseInt(val) : 3),
  AI_TIMEOUT: z.string().optional().transform(val => val ? parseInt(val) : 60000),
  AI_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
  NODE_ENV: z.string().optional().default('development'),
});

export const config = envSchema.parse(process.env);

// Validate that AI_PRIMARY_MODEL is set
if (!config.AI_PRIMARY_MODEL) {
  throw new Error('AI_PRIMARY_MODEL environment variable is required');
}

// No more test environment - always use real API
export const isTestEnvironment = false;

// Model routing configuration - Updated for available models
export const modelRouting = {
  // Task-specific model selection - Using environment variables
  tasks: {
    structure: config.AI_PRIMARY_MODEL,         // Site structure generation
    content: config.AI_PRIMARY_MODEL,           // Content writing
    seo: config.AI_PRIMARY_MODEL,               // SEO optimization
    code: config.AI_PRIMARY_MODEL,              // Code generation
    images: config.AI_PRIMARY_MODEL,            // Image generation (text fallback)
    analysis: config.AI_PRIMARY_MODEL,          // Complex analysis
    simple: config.AI_FALLBACK_MODEL,           // Simple tasks
    component_selection: config.AI_PRIMARY_MODEL, // Component selection
  },
  
  // Fallback chain for each primary model - Using only working models
  fallbackChains: {
    'claude-4-sonnet': ['gpt-5-mini', 'openai/gpt-oss-20b'],
    'gpt-5-mini': ['claude-4-sonnet', 'openai/gpt-oss-20b'],
    'gpt-oss-20b': ['openai/gpt-oss-20b', 'claude-4-sonnet'],
    'openai/gpt-oss-20b': ['claude-4-sonnet', 'gpt-5-mini'],
  },
};

// Model-specific settings - Each model uses its native parameter names
export const modelSettings = {
  'gpt-5': {
    max_completion_tokens: 4096,
    // Only max_completion_tokens supported - all other params use defaults
  },
  'gpt-5-mini': {
    max_completion_tokens: 4096,
    // Only max_completion_tokens supported - all other params use defaults
  },
  'openai/gpt-oss-20b': {
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 0.95,
  },
  'openai/gpt-oss-120b': {
    max_tokens: 4096,
    temperature: 0.6,
    top_p: 0.95,
  },
  'claude-4-sonnet': {
    // Claude doesn't use max_tokens parameter at all
    temperature: 0.7,
  },
  'gemini-2.0-flash-thinking-exp': {
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 0.95,
  },
  'gemini-2.5-flash-preview-04-17': {
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 0.95,
  },
  'gemini-2.5-pro-exp-03-25': {
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 0.95,
  },
};

// Cost tracking (per 1K tokens or per image) - Updated for available models
export const costPerModel = {
  'gpt-5': { input: 0.02, output: 0.04 },
  'gpt-5-mini': { input: 0.005, output: 0.015 },
  'openai/gpt-oss-20b': { input: 0.01, output: 0.02 },
  'openai/gpt-oss-120b': { input: 0.03, output: 0.06 },
  'claude-4-sonnet': { input: 0.003, output: 0.015 },
  'gemini-2.0-flash-thinking-exp': { input: 0.001, output: 0.003 },
  'gemini-2.5-flash-preview-04-17': { input: 0.002, output: 0.006 },
  'gemini-2.5-pro-exp-03-25': { input: 0.005, output: 0.015 },
  'text-embedding-3-small': { input: 0.0001, output: 0 },
  'text-embedding-3-large': { input: 0.0002, output: 0 },
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