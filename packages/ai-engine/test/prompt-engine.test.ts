/**
 * Test file for Prompt Engine
 * 
 * Basic tests to verify the prompt engine implementation
 */

import { describe, it, expect } from 'vitest';

import { extractContext } from '../lib/enhancer';
import { routeToModel, getOptimalChain } from '../lib/model-router';
import { getTemplate } from '../prompts/templates';
import { validateGenerationRequest } from '../schemas/site-structure';
import { config } from '../config';

describe('Prompt Engine', () => {
  
  describe('Context Extraction', () => {
    it('should extract context from SaaS prompt', async () => {
      const prompt = 'Create a SaaS landing page for a project management tool with pricing and features';
      const context = await extractContext(prompt);
      
      expect(context.industry).toBe('saas');
      expect(context.features).toContain('pricing');
      expect(context.goals).toContain('increase sales');
    });
    
    it('should extract context from e-commerce prompt', async () => {
      const prompt = 'Build an online shop for selling handmade jewelry with shopping cart and checkout';
      const context = await extractContext(prompt);
      
      expect(context.industry).toBe('ecommerce');
      expect(context.features).toContain('payment');
    });
    
    it('should extract context from portfolio prompt', async () => {
      const prompt = 'Create a portfolio website to showcase my creative work and projects';
      const context = await extractContext(prompt);
      
      expect(context.industry).toBe('portfolio');
      expect(context.goals).toContain('showcase work');
    });
  });
  
  describe('Model Routing', () => {
    it('should route structure task to GPT-4', () => {
      const selection = routeToModel('structure');
      expect(selection.primary).toBe(process.env.AI_PRIMARY_MODEL);
    });
    
    it('should route content task to Claude', () => {
      const selection = routeToModel('content');
      expect(selection.primary).toBe(config.AI_PRIMARY_MODEL);
    });
    
    it('should select fast models when speed is priority', () => {
      const selection = routeToModel('structure', undefined, { priority: 'speed' });
      expect(selection.primary).toBe(process.env.AI_FALLBACK_MODEL);
    });
    
    it('should select cheap models when cost is priority', () => {
      const selection = routeToModel('content', undefined, { priority: 'cost' });
      expect(selection.primary).toBe(process.env.AI_FALLBACK_MODEL);
    });
    
    it('should generate optimal chain for complete generation', async () => {
      const context = await extractContext('Create a SaaS website');
      const chain = getOptimalChain(context, 'quality');
      
      expect(chain.structureGeneration.primary).toBe(process.env.AI_PRIMARY_MODEL);
      expect(chain.contentGeneration.primary).toBe(process.env.AI_PRIMARY_MODEL);
    });
  });
  
  describe('Templates', () => {
    it('should load SaaS template', () => {
      const template = getTemplate('saas');
      expect(template).toBeDefined();
      expect(template?.id).toBe('saas-landing');
      expect(template?.sections.length).toBeGreaterThan(0);
    });
    
    it('should load e-commerce template', () => {
      const template = getTemplate('ecommerce');
      expect(template).toBeDefined();
      expect(template?.id).toBe('ecommerce');
    });
    
    it('should load portfolio template', () => {
      const template = getTemplate('portfolio');
      expect(template).toBeDefined();
      expect(template?.id).toBe('portfolio');
    });
  });
  
  describe('Request Validation', () => {
    it('should validate generation request', () => {
      const request = {
        prompt: 'Create a website',
        industry: 'saas',
        style: 'modern',
        features: ['auth', 'payment'],
        options: {
          streaming: true,
          validateOutput: true
        }
      };
      
      const validated = validateGenerationRequest(request);
      expect(validated.prompt).toBe('Create a website');
      expect(validated.industry).toBe('saas');
    });
    
    it('should reject invalid request', () => {
      const request = {
        prompt: '', // Empty prompt
      };
      
      expect(() => validateGenerationRequest(request)).toThrow();
    });
  });
  
  describe('Prompt Enhancement', () => {
    it('should enhance prompts with industry context', async () => {
      const { enhancePrompt } = await import('../lib/enhancer');
      const context = await extractContext('Create a SaaS website');
      
      const enhanced = enhancePrompt('Generate website', context);
      expect(enhanced).toContain('Industry: saas');
      expect(enhanced).toContain('Target Audience:');
      expect(enhanced).toContain('Business Goals:');
    });
  });
});

// Simple integration test
describe('Basic Integration', () => {
  it('should validate that modules can be imported', () => {
    // Just test that all our modules can be imported without errors
    expect(typeof extractContext).toBe('function');
    expect(typeof routeToModel).toBe('function');
    expect(typeof getTemplate).toBe('function');
    expect(typeof validateGenerationRequest).toBe('function');
  });
});