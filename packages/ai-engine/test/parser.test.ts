/**
 * Comprehensive Tests for Response Parser and Stream Handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  parseAIResponse, 
  parseSiteStructure, 
  parseComponentTree,
  parseUniversalResponse,
  type RawAIResponse 
} from '../parsers/response-parser';
import { 
  StreamingResponseHandler, 
  handleStreamingResponse 
} from '../parsers/stream-handler';
import { 
  normalizeModelDifferences, 
  smartNormalize,
  detectResponseType 
} from '../lib/normalizer';
import { 
  validateSiteStructure, 
  validateComponentTree,
  quickValidate 
} from '../lib/validators';
import { SiteStructureSchema, ComponentTreeSchema } from '../schemas/site-structure';

// Mock responses from different models
const mockResponses = {
  gpt4Valid: {
    content: JSON.stringify({
      id: 'test_site',
      name: 'Test Site',
      pages: [{
        id: 'home',
        name: 'Home',
        path: '/',
        components: {
          root: {
            id: 'root',
            type: 'page',
            props: {},
            children: [{
              id: 'hero',
              type: 'hero',
              props: { title: 'Welcome' },
              content: { text: 'Hero content' },
              styles: { className: 'hero-section' }
            }]
          },
          version: '1.0.0',
          metadata: { generatedAt: new Date().toISOString(), model: 'gpt-4' }
        },
        seo: {
          title: 'Test Site',
          description: 'A test website',
          keywords: ['test']
        }
      }],
      globalStyles: {
        colors: { primary: '#3b82f6', secondary: '#8b5cf6', background: '#ffffff', text: '#1f2937' },
        typography: { headingFont: 'Inter', bodyFont: 'Inter' },
        spacing: { base: '1rem' },
        borderRadius: '0.5rem',
        shadows: 'medium'
      },
      navigation: {
        main: [{ label: 'Home', path: '/' }],
        footer: []
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    }),
    model: 'gpt-4-turbo',
    usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 },
    cost: 0.005
  },
  
  claudeWithMarkdown: {
    content: 'Here is the website structure:\n\n```json\n' + JSON.stringify({
      siteName: 'Claude Site',
      pages: [{
        title: 'Home Page',
        components: [{
          type: 'hero',
          content: 'Welcome message'
        }]
      }]
    }) + '\n```\n\nThis structure includes...',
    model: 'claude-3-opus',
    usage: { prompt_tokens: 120, completion_tokens: 180, total_tokens: 300 },
    cost: 0.004
  },
  
  malformedJSON: {
    content: '{ "invalid": json, missing quotes }',
    model: 'gpt-4-turbo',
    usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    cost: 0.002
  }
};

describe('Response Parser', () => {
  describe('parseAIResponse', () => {
    it('should parse valid GPT-4 response', async () => {
      const result = await parseAIResponse(
        mockResponses.gpt4Valid,
        SiteStructureSchema,
        { autoFix: true }
      );
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.metadata.model).toBe('gpt-4-turbo');
      expect(result.metadata.cost).toBe(0.005);
    });
    
    it('should handle malformed JSON gracefully', async () => {
      const result = await parseAIResponse(
        mockResponses.malformedJSON,
        SiteStructureSchema,
        { autoFix: true }
      );
      
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('MODEL_ERROR');
    });
  });
});

describe('Stream Handler', () => {
  let handler: StreamingResponseHandler;
  
  beforeEach(() => {
    handler = new StreamingResponseHandler({
      enablePartialParsing: true,
      validationInterval: 100
    });
  });
  
  it('should process chunks and emit progress', async () => {
    const progressUpdates: any[] = [];
    
    handler.on('progress', (progress) => progressUpdates.push(progress));
    
    await handler.processChunk({
      content: '{ "id": "streaming_test",',
      model: 'gpt-4-turbo',
      tokenCount: 10,
      timestamp: Date.now(),
      chunkIndex: 0
    });
    
    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(handler.getBuffer()).toContain('streaming_test');
  });
});

describe('Validators', () => {
  it('should validate JSON strings', () => {
    expect(quickValidate.isValidJSON('{"valid": true}')).toBe(true);
    expect(quickValidate.isValidJSON('invalid json')).toBe(false);
  });
  
  it('should check required fields', () => {
    const data = { user: { name: 'John', age: 30 } };
    
    expect(quickValidate.hasRequiredFields(data, ['user.name'])).toBe(true);
    expect(quickValidate.hasRequiredFields(data, ['user.email'])).toBe(false);
  });
});

describe('Normalizer', () => {
  it('should detect site structure', () => {
    const data = { pages: [], globalStyles: {} };
    expect(detectResponseType(data)).toBe('siteStructure');
  });
  
  it('should detect component tree', () => {
    const data = { root: { type: 'div' }, version: '1.0.0' };
    expect(detectResponseType(data)).toBe('componentTree');
  });
});