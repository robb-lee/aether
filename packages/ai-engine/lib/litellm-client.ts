/**
 * LiteLLM Unified AI Client
 * 
 * This module provides a unified interface for all AI models through LiteLLM.
 * Supports GPT-4, Claude, DALL-E, and other models with automatic fallback.
 * 
 * Features:
 * - Exponential backoff retry logic
 * - Comprehensive request/response logging
 * - Automatic model fallback chains
 * - Cost tracking and optimization
 * - Health monitoring
 */

import OpenAI from 'openai';
import { 
  config, 
  modelRouting, 
  modelSettings, 
  costPerModel, 
  retryConfig,
  loggingConfig 
} from '../config';
import {
  ModelError,
  RateLimitError,
  NetworkError,
  isRetryableError,
  getRetryDelay,
} from './errors';

// Initialize LiteLLM client (OpenAI-compatible)
export const litellm = new OpenAI({
  apiKey: config.LITELLM_API_KEY,
  baseURL: config.LITELLM_API_BASE,
  defaultHeaders: {
    'X-LiteLLM-Version': '1.0.0',
  },
  timeout: config.AI_TIMEOUT,
});

// Request/Response Logger
class RequestLogger {
  private startTime: number;
  
  constructor(private operation: string, private params: any) {
    this.startTime = Date.now();
    if (loggingConfig.logRequests) {
      console.log(`[AI Request] ${operation}`, {
        model: params.model,
        messages: params.messages?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  success(response: any, model: string, cost?: number) {
    const duration = Date.now() - this.startTime;
    if (loggingConfig.logResponses) {
      console.log(`[AI Response] ${this.operation}`, {
        model,
        duration: `${duration}ms`,
        cost: cost ? `$${cost.toFixed(4)}` : undefined,
        tokens: response.usage,
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  error(error: any, model: string) {
    const duration = Date.now() - this.startTime;
    if (loggingConfig.logErrors) {
      console.error(`[AI Error] ${this.operation}`, {
        model,
        duration: `${duration}ms`,
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * Execute request with retry logic
 */
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = retryConfig.maxRetries
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay and wait
      const delay = getRetryDelay(error, attempt);
      console.log(`[Retry] ${operationName} - Attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Get task-specific model or use provided model
 */
function getModelForTask(task?: keyof typeof modelRouting.tasks, model?: string): string {
  if (model) return model;
  if (task && modelRouting.tasks[task]) return modelRouting.tasks[task];
  return config.AI_PRIMARY_MODEL;
}

/**
 * Get fallback chain for a model
 */
function getFallbackChain(model: string): string[] {
  return modelRouting.fallbackChains[model] || [config.AI_FALLBACK_MODEL];
}

/**
 * Generate completion with automatic fallback
 */
export async function generateCompletion({
  messages,
  model,
  task,
  maxRetries = retryConfig.maxRetries,
  stream = false,
  metadata = {},
}: {
  messages: any[];
  model?: string;
  task?: keyof typeof modelRouting.tasks;
  maxRetries?: number;
  stream?: boolean;
  metadata?: Record<string, any>;
}) {
  const selectedModel = getModelForTask(task, model);
  const fallbackChain = [selectedModel, ...getFallbackChain(selectedModel)];
  const logger = new RequestLogger('generateCompletion', { messages, model: selectedModel, metadata });
  
  let lastError: any;
  let usedModel: string = selectedModel;
  
  // Try each model in the fallback chain
  for (const currentModel of fallbackChain) {
    try {
      const settings = modelSettings[currentModel] || {};
      
      const response = await executeWithRetry(
        async () => {
          return await litellm.chat.completions.create({
            model: currentModel,
            messages,
            stream,
            ...settings,
          });
        },
        `Completion with ${currentModel}`,
        maxRetries
      );
      
      const cost = calculateCost(currentModel, response);
      logger.success(response, currentModel, cost);
      
      return {
        response,
        model: currentModel,
        cost,
        fallback: currentModel !== selectedModel,
        metadata: {
          ...metadata,
          attemptedModels: fallbackChain.slice(0, fallbackChain.indexOf(currentModel) + 1),
        },
      };
    } catch (error) {
      logger.error(error, currentModel);
      lastError = new ModelError(
        `Model ${currentModel} failed: ${error.message}`,
        currentModel,
        error
      );
      
      // If this isn't the last model in the chain, try the next one
      if (currentModel !== fallbackChain[fallbackChain.length - 1]) {
        console.log(`[Fallback] Switching from ${currentModel} to next model in chain`);
        continue;
      }
    }
  }
  
  throw lastError;
}

/**
 * Generate images with retry logic
 */
export async function generateImage({
  prompt,
  size = '1024x1024',
  quality = 'standard',
  n = 1,
  model,
  maxRetries = retryConfig.maxRetries,
  metadata = {},
}: {
  prompt: string;
  size?: string;
  quality?: 'standard' | 'hd';
  n?: number;
  model?: string;
  maxRetries?: number;
  metadata?: Record<string, any>;
}) {
  const selectedModel = model || modelRouting.tasks.images;
  const fallbackChain = [selectedModel, ...getFallbackChain(selectedModel)];
  const logger = new RequestLogger('generateImage', { prompt, model: selectedModel, metadata });
  
  let lastError: any;
  
  for (const currentModel of fallbackChain) {
    try {
      const response = await executeWithRetry(
        async () => {
          return await litellm.images.generate({
            model: currentModel,
            prompt,
            size,
            quality,
            n,
          });
        },
        `Image generation with ${currentModel}`,
        maxRetries
      );
      
      const cost = (costPerModel[currentModel]?.image || 0) * n;
      logger.success(response, currentModel, cost);
      
      return {
        images: response.data,
        model: currentModel,
        cost,
        fallback: currentModel !== selectedModel,
        metadata: {
          ...metadata,
          attemptedModels: fallbackChain.slice(0, fallbackChain.indexOf(currentModel) + 1),
        },
      };
    } catch (error) {
      logger.error(error, currentModel);
      lastError = new ModelError(
        `Image model ${currentModel} failed: ${error.message}`,
        currentModel,
        error
      );
      
      if (currentModel !== fallbackChain[fallbackChain.length - 1]) {
        console.log(`[Fallback] Switching from ${currentModel} to next image model`);
        continue;
      }
    }
  }
  
  throw lastError;
}

/**
 * Calculate token usage cost
 */
function calculateCost(model: string, response: any): number {
  const usage = response.usage;
  if (!usage) return 0;
  
  const costs = costPerModel[model];
  if (!costs) return 0;
  
  const inputCost = (usage.prompt_tokens / 1000) * costs.input;
  const outputCost = (usage.completion_tokens / 1000) * costs.output;
  
  return inputCost + outputCost;
}

/**
 * Enhanced stream handler with error recovery
 */
export async function* streamCompletion({
  messages,
  model,
  task,
  onToken,
  onStart,
  onComplete,
  onError,
  maxRetries = retryConfig.maxRetries,
  metadata = {},
}: {
  messages: any[];
  model?: string;
  task?: keyof typeof modelRouting.tasks;
  onToken?: (token: string) => void;
  onStart?: (model: string) => void;
  onComplete?: (fullText: string, model: string, cost: number) => void;
  onError?: (error: any, model: string) => void;
  maxRetries?: number;
  metadata?: Record<string, any>;
}) {
  const selectedModel = getModelForTask(task, model);
  const fallbackChain = [selectedModel, ...getFallbackChain(selectedModel)];
  const logger = new RequestLogger('streamCompletion', { messages, model: selectedModel, metadata });
  
  let lastError: any;
  let fullText = '';
  let tokenCount = 0;
  
  for (const currentModel of fallbackChain) {
    try {
      const settings = modelSettings[currentModel] || {};
      onStart?.(currentModel);
      
      const stream = await executeWithRetry(
        async () => {
          return await litellm.chat.completions.create({
            model: currentModel,
            messages,
            stream: true,
            ...settings,
          });
        },
        `Stream with ${currentModel}`,
        maxRetries
      );
      
      // Process the stream
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullText += content;
          tokenCount++;
          onToken?.(content);
          yield {
            content,
            model: currentModel,
            tokenCount,
          };
        }
        
        // Check for finish reason
        if (chunk.choices[0]?.finish_reason) {
          const estimatedCost = calculateEstimatedCost(currentModel, tokenCount);
          logger.success({ tokenCount }, currentModel, estimatedCost);
          onComplete?.(fullText, currentModel, estimatedCost);
        }
      }
      
      return; // Successfully completed
      
    } catch (error) {
      logger.error(error, currentModel);
      onError?.(error, currentModel);
      lastError = new ModelError(
        `Stream model ${currentModel} failed: ${error.message}`,
        currentModel,
        error
      );
      
      if (currentModel !== fallbackChain[fallbackChain.length - 1]) {
        console.log(`[Fallback] Stream switching from ${currentModel} to next model`);
        fullText = ''; // Reset for new model
        tokenCount = 0;
        continue;
      }
    }
  }
  
  throw lastError;
}

/**
 * Calculate estimated cost based on token count
 */
function calculateEstimatedCost(model: string, tokenCount: number): number {
  const costs = costPerModel[model];
  if (!costs) return 0;
  
  // Rough estimation: assume 75% input, 25% output for streaming
  const estimatedInput = tokenCount * 0.75;
  const estimatedOutput = tokenCount * 0.25;
  
  return (estimatedInput / 1000) * (costs.input || 0) + 
         (estimatedOutput / 1000) * (costs.output || 0);
}

/**
 * Comprehensive health check with detailed status
 */
export async function checkHealth(): Promise<{
  healthy: boolean;
  litellm: boolean;
  models: Record<string, boolean>;
  latency: number;
  timestamp: string;
  errors?: string[];
}> {
  const startTime = Date.now();
  const errors: string[] = [];
  const modelStatus: Record<string, boolean> = {};
  
  // Check LiteLLM server health
  let litellmHealthy = false;
  try {
    const response = await fetch(`${config.LITELLM_API_BASE}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    litellmHealthy = response.ok;
    if (!response.ok) {
      errors.push(`LiteLLM health check failed: ${response.status}`);
    }
  } catch (error) {
    errors.push(`LiteLLM unreachable: ${error.message}`);
  }
  
  // Check model availability
  if (litellmHealthy) {
    try {
      const models = await listModels();
      const requiredModels = [
        config.AI_PRIMARY_MODEL,
        config.AI_FALLBACK_MODEL,
        config.AI_IMAGE_MODEL,
      ];
      
      for (const requiredModel of requiredModels) {
        modelStatus[requiredModel] = models.some(m => m.id === requiredModel);
        if (!modelStatus[requiredModel]) {
          errors.push(`Model ${requiredModel} not available`);
        }
      }
    } catch (error) {
      errors.push(`Failed to check models: ${error.message}`);
    }
  }
  
  const latency = Date.now() - startTime;
  const healthy = litellmHealthy && errors.length === 0;
  
  return {
    healthy,
    litellm: litellmHealthy,
    models: modelStatus,
    latency,
    timestamp: new Date().toISOString(),
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * List available models with caching
 */
let modelCache: { data: any[]; timestamp: number } | null = null;
const MODEL_CACHE_TTL = 60000; // 1 minute

export async function listModels() {
  // Check cache
  if (modelCache && Date.now() - modelCache.timestamp < MODEL_CACHE_TTL) {
    return modelCache.data;
  }
  
  try {
    const response = await executeWithRetry(
      async () => litellm.models.list(),
      'List models',
      2
    );
    
    modelCache = {
      data: response.data,
      timestamp: Date.now(),
    };
    
    return response.data;
  } catch (error) {
    console.error('Failed to list models:', error);
    return modelCache?.data || [];
  }
}

/**
 * Get model capabilities and limits
 */
export async function getModelCapabilities(model: string) {
  const models = await listModels();
  const modelInfo = models.find(m => m.id === model);
  
  if (!modelInfo) {
    return null;
  }
  
  return {
    id: modelInfo.id,
    maxTokens: modelSettings[model]?.maxTokens || 4096,
    supportStreaming: true,
    supportFunctions: modelInfo.id.includes('gpt'),
    costPerToken: costPerModel[model],
    fallbackChain: getFallbackChain(model),
  };
}

// Export types
export type CompletionResponse = Awaited<ReturnType<typeof generateCompletion>>;
export type ImageResponse = Awaited<ReturnType<typeof generateImage>>;
export type StreamChunk = {
  content: string;
  model: string;
  tokenCount: number;
};
export type HealthStatus = Awaited<ReturnType<typeof checkHealth>>;
