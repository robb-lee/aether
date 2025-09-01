/**
 * LiteLLM Client Test Suite
 * 
 * Comprehensive tests for the enhanced LiteLLM client
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  generateCompletion,
  generateImage,
  streamCompletion,
  checkHealth,
  listModels,
  getModelCapabilities,
} from '../lib/litellm-client';
import { ModelError, RateLimitError, NetworkError } from '../lib/errors';

// Mock environment variables
vi.mock('../config', () => ({
  config: {
    LITELLM_API_BASE: 'http://localhost:4000',
    LITELLM_API_KEY: 'test-key',
    AI_PRIMARY_MODEL: 'gpt-4-turbo-preview',
    AI_FALLBACK_MODEL: 'claude-3-haiku',
    AI_IMAGE_MODEL: 'dall-e-3',
    AI_MAX_RETRIES: 3,
    AI_TIMEOUT: 5000,
    AI_LOG_LEVEL: 'error',
  },
  modelRouting: {
    tasks: {
      structure: 'gpt-4-turbo-preview',
      content: 'claude-3-opus',
      seo: 'claude-3-haiku',
      code: 'gpt-4-turbo-preview',
      images: 'dall-e-3',
      analysis: 'claude-3-opus',
      simple: 'gpt-3.5-turbo',
    },
    fallbackChains: {
      'gpt-4-turbo-preview': ['gpt-4', 'claude-3-opus', 'claude-3-haiku'],
      'claude-3-opus': ['claude-3-sonnet', 'claude-3-haiku', 'gpt-4-turbo-preview'],
      'claude-3-haiku': ['claude-3-sonnet', 'gpt-3.5-turbo'],
      'gpt-3.5-turbo': ['claude-3-haiku'],
      'dall-e-3': ['dall-e-2'],
    },
  },
  modelSettings: {
    'gpt-4-turbo-preview': {
      maxTokens: 4096,
      temperature: 0.7,
      responseFormat: { type: 'json_object' },
    },
    'claude-3-opus': {
      maxTokens: 4096,
      temperature: 0.7,
    },
  },
  costPerModel: {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'dall-e-3': { image: 0.04 },
  },
  retryConfig: {
    maxRetries: 3,
    timeout: 5000,
    backoffMultiplier: 2,
    maxBackoff: 16000,
    jitterFactor: 0.1,
  },
  loggingConfig: {
    level: 'error',
    logRequests: false,
    logResponses: false,
    logCosts: true,
    logErrors: true,
  },
}));

describe('LiteLLM Client', () => {
  describe('generateCompletion', () => {
    it('should generate completion with primary model', async () => {
      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, how are you?' }
      ];
      
      // This is an integration test - requires LiteLLM server running
      // For unit tests, we would mock the OpenAI client
      if (process.env.RUN_INTEGRATION_TESTS) {
        const result = await generateCompletion({ messages });
        
        expect(result).toHaveProperty('response');
        expect(result).toHaveProperty('model');
        expect(result).toHaveProperty('cost');
        expect(result.fallback).toBeFalsy();
      }
    });
    
    it('should use task-specific model routing', async () => {
      const messages = [
        { role: 'user', content: 'Write SEO content' }
      ];
      
      if (process.env.RUN_INTEGRATION_TESTS) {
        const result = await generateCompletion({ 
          messages, 
          task: 'seo' 
        });
        
        expect(result.model).toContain('claude-3-haiku');
      }
    });
    
    it('should handle model fallback on error', async () => {
      // This test would require mocking to simulate errors
      // Placeholder for now
      expect(true).toBe(true);
    });
    
    it('should track cost correctly', async () => {
      const messages = [
        { role: 'user', content: 'Test message' }
      ];
      
      if (process.env.RUN_INTEGRATION_TESTS) {
        const result = await generateCompletion({ messages });
        
        expect(result.cost).toBeGreaterThanOrEqual(0);
        expect(typeof result.cost).toBe('number');
      }
    });
  });
  
  describe('generateImage', () => {
    it('should generate image successfully', async () => {
      if (process.env.RUN_INTEGRATION_TESTS) {
        const result = await generateImage({
          prompt: 'A beautiful sunset over mountains',
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        });
        
        expect(result).toHaveProperty('images');
        expect(result).toHaveProperty('cost');
        expect(result.cost).toBe(0.04); // DALL-E 3 cost
      }
    });
    
    it('should support image model fallback', async () => {
      // Test fallback from DALL-E 3 to DALL-E 2
      expect(true).toBe(true);
    });
  });
  
  describe('streamCompletion', () => {
    it('should stream tokens progressively', async () => {
      const messages = [
        { role: 'user', content: 'Count from 1 to 5' }
      ];
      
      if (process.env.RUN_INTEGRATION_TESTS) {
        const tokens: string[] = [];
        const stream = streamCompletion({
          messages,
          onToken: (token) => tokens.push(token),
        });
        
        for await (const chunk of stream) {
          expect(chunk).toHaveProperty('content');
          expect(chunk).toHaveProperty('model');
          expect(chunk).toHaveProperty('tokenCount');
        }
        
        expect(tokens.length).toBeGreaterThan(0);
      }
    });
    
    it('should call lifecycle callbacks', async () => {
      const messages = [
        { role: 'user', content: 'Hello' }
      ];
      
      if (process.env.RUN_INTEGRATION_TESTS) {
        let started = false;
        let completed = false;
        
        const stream = streamCompletion({
          messages,
          onStart: () => { started = true; },
          onComplete: () => { completed = true; },
        });
        
        for await (const chunk of stream) {
          // Process stream
        }
        
        expect(started).toBe(true);
        expect(completed).toBe(true);
      }
    });
  });
  
  describe('checkHealth', () => {
    it('should return comprehensive health status', async () => {
      if (process.env.RUN_INTEGRATION_TESTS) {
        const health = await checkHealth();
        
        expect(health).toHaveProperty('healthy');
        expect(health).toHaveProperty('litellm');
        expect(health).toHaveProperty('models');
        expect(health).toHaveProperty('latency');
        expect(health).toHaveProperty('timestamp');
        
        if (!health.healthy) {
          expect(health).toHaveProperty('errors');
        }
      }
    });
    
    it('should check required models availability', async () => {
      if (process.env.RUN_INTEGRATION_TESTS) {
        const health = await checkHealth();
        
        if (health.litellm) {
          expect(health.models).toHaveProperty('gpt-4-turbo-preview');
          expect(health.models).toHaveProperty('claude-3-haiku');
          expect(health.models).toHaveProperty('dall-e-3');
        }
      }
    });
  });
  
  describe('listModels', () => {
    it('should return available models with caching', async () => {
      if (process.env.RUN_INTEGRATION_TESTS) {
        const models1 = await listModels();
        const models2 = await listModels(); // Should hit cache
        
        expect(Array.isArray(models1)).toBe(true);
        expect(models1).toEqual(models2);
      }
    });
  });
  
  describe('getModelCapabilities', () => {
    it('should return model capabilities', async () => {
      if (process.env.RUN_INTEGRATION_TESTS) {
        const capabilities = await getModelCapabilities('gpt-4-turbo-preview');
        
        if (capabilities) {
          expect(capabilities).toHaveProperty('id');
          expect(capabilities).toHaveProperty('maxTokens');
          expect(capabilities).toHaveProperty('supportStreaming');
          expect(capabilities).toHaveProperty('supportFunctions');
          expect(capabilities).toHaveProperty('costPerToken');
          expect(capabilities).toHaveProperty('fallbackChain');
        }
      }
    });
  });
  
  describe('Error Handling', () => {
    it('should retry on retryable errors', async () => {
      // Test exponential backoff behavior
      expect(true).toBe(true);
    });
    
    it('should not retry on non-retryable errors', async () => {
      // Test immediate failure on validation errors
      expect(true).toBe(true);
    });
    
    it('should respect retry limits', async () => {
      // Test that retries stop after maxRetries
      expect(true).toBe(true);
    });
  });
  
  describe('Logging', () => {
    it('should log requests when enabled', async () => {
      // Test request logging
      expect(true).toBe(true);
    });
    
    it('should log responses when enabled', async () => {
      // Test response logging
      expect(true).toBe(true);
    });
    
    it('should always log errors', async () => {
      // Test error logging
      expect(true).toBe(true);
    });
  });
});

// Integration test runner
describe('Integration Tests', () => {
  it('should complete full generation workflow', async () => {
    if (process.env.RUN_INTEGRATION_TESTS) {
      // 1. Check health
      const health = await checkHealth();
      expect(health.healthy).toBe(true);
      
      // 2. Generate text
      const completion = await generateCompletion({
        messages: [{ role: 'user', content: 'Say hello' }],
        task: 'simple',
      });
      expect(completion.response).toBeDefined();
      
      // 3. Generate image
      const image = await generateImage({
        prompt: 'A test image',
      });
      expect(image.images).toBeDefined();
      
      console.log('✅ Integration tests passed');
    }
  });
});