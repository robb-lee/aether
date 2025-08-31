/**
 * LiteLLM Unified AI Client
 * 
 * This module provides a unified interface for all AI models through LiteLLM.
 * Supports GPT-4, Claude, DALL-E, and other models with automatic fallback.
 */

import OpenAI from 'openai';
import { z } from 'zod';

// Environment validation
const envSchema = z.object({
  LITELLM_API_BASE: z.string().url().optional().default('http://localhost:4000'),
  LITELLM_API_KEY: z.string().min(1),
  AI_PRIMARY_MODEL: z.string().default('gpt-4-turbo-preview'),
  AI_FALLBACK_MODEL: z.string().default('claude-3-haiku'),
  AI_IMAGE_MODEL: z.string().default('dall-e-3'),
});

const env = envSchema.parse(process.env);

// Initialize LiteLLM client (OpenAI-compatible)
export const litellm = new OpenAI({
  apiKey: env.LITELLM_API_KEY,
  baseURL: env.LITELLM_API_BASE,
  defaultHeaders: {
    'X-LiteLLM-Version': '1.0.0',
  },
});

// Model configuration
export const models = {
  primary: env.AI_PRIMARY_MODEL,
  fallback: env.AI_FALLBACK_MODEL,
  image: env.AI_IMAGE_MODEL,
  
  // Model-specific settings
  settings: {
    'gpt-4-turbo-preview': {
      maxTokens: 4096,
      temperature: 0.7,
      responseFormat: { type: 'json_object' },
    },
    'claude-3-opus': {
      maxTokens: 4096,
      temperature: 0.7,
    },
    'claude-3-haiku': {
      maxTokens: 4096,
      temperature: 0.7,
    },
    'gpt-3.5-turbo': {
      maxTokens: 4096,
      temperature: 0.7,
    },
  },
};

// Cost tracking (per 1K tokens)
const costPerModel = {
  'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'dall-e-3': { image: 0.04 },
};

/**
 * Generate completion with automatic fallback
 */
export async function generateCompletion({
  messages,
  model = models.primary,
  maxRetries = 2,
  stream = false,
}: {
  messages: any[];
  model?: string;
  maxRetries?: number;
  stream?: boolean;
}) {
  let lastError: any;
  
  // Try primary model
  try {
    const settings = models.settings[model] || {};
    
    const response = await litellm.chat.completions.create({
      model,
      messages,
      stream,
      ...settings,
    });
    
    return {
      response,
      model,
      cost: calculateCost(model, response),
    };
  } catch (error) {
    console.error(`Primary model ${model} failed:`, error);
    lastError = error;
  }
  
  // Try fallback model
  if (model !== models.fallback) {
    try {
      console.log(`Falling back to ${models.fallback}`);
      const settings = models.settings[models.fallback] || {};
      
      const response = await litellm.chat.completions.create({
        model: models.fallback,
        messages,
        stream,
        ...settings,
      });
      
      return {
        response,
        model: models.fallback,
        cost: calculateCost(models.fallback, response),
        fallback: true,
      };
    } catch (error) {
      console.error(`Fallback model ${models.fallback} failed:`, error);
      lastError = error;
    }
  }
  
  throw lastError;
}

/**
 * Generate images
 */
export async function generateImage({
  prompt,
  size = '1024x1024',
  quality = 'standard',
  n = 1,
}: {
  prompt: string;
  size?: string;
  quality?: 'standard' | 'hd';
  n?: number;
}) {
  try {
    const response = await litellm.images.generate({
      model: models.image,
      prompt,
      size,
      quality,
      n,
    });
    
    return {
      images: response.data,
      cost: costPerModel[models.image]?.image * n || 0,
    };
  } catch (error) {
    console.error('Image generation failed:', error);
    throw error;
  }
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
 * Stream handler for real-time responses
 */
export async function* streamCompletion({
  messages,
  model = models.primary,
  onToken,
}: {
  messages: any[];
  model?: string;
  onToken?: (token: string) => void;
}) {
  const settings = models.settings[model] || {};
  
  const stream = await litellm.chat.completions.create({
    model,
    messages,
    stream: true,
    ...settings,
  });
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      onToken?.(content);
      yield content;
    }
  }
}

/**
 * Check LiteLLM server health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    // LiteLLM health check endpoint
    const response = await fetch(`${env.LITELLM_API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * List available models
 */
export async function listModels() {
  try {
    const response = await litellm.models.list();
    return response.data;
  } catch (error) {
    console.error('Failed to list models:', error);
    return [];
  }
}

// Export types
export type CompletionResponse = Awaited<ReturnType<typeof generateCompletion>>;
export type ImageResponse = Awaited<ReturnType<typeof generateImage>>;
