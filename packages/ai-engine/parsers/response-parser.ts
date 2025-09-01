/**
 * AI Response Parser for LiteLLM Multi-Model Support
 * 
 * Handles responses from different AI models (GPT-4, Claude, etc.)
 * with robust parsing, validation, and error recovery
 */

import { z } from 'zod';
import {
  SiteStructureSchema,
  ComponentTreeSchema,
  ContextExtractionSchema,
  GenerationResponseSchema,
  ValidationResultSchema,
  type SiteStructure,
  type ComponentTree,
  type GenerationResponse
} from '../schemas/site-structure';
import { ModelError } from '../lib/errors';

/**
 * Raw AI response structure
 */
export interface RawAIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  metadata?: Record<string, any>;
  cost?: number;
  fallback?: boolean;
}

/**
 * Parsed response with validation
 */
export interface ParsedResponse<T = any> {
  success: boolean;
  data?: T;
  validation: {
    valid: boolean;
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      path?: string;
      message: string;
      suggestion?: string;
    }>;
    autoFixed: boolean;
  };
  metadata: {
    model: string;
    cost: number;
    tokens: {
      prompt: number;
      completion: number;
      total: number;
    };
    parsingTime: number;
    fallbackUsed: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * JSON extraction patterns for different models
 */
const JSON_PATTERNS = {
  // Standard JSON block
  codeBlock: /```(?:json)?\s*(\{[\s\S]*?\})\s*```/gi,
  // Raw JSON object
  rawJson: /(\{[\s\S]*?\})/g,
  // JSON with surrounding text
  embedded: /.*?(\{[\s\S]*?\}).*?/gs,
};

/**
 * Model-specific response formatters
 */
const MODEL_FORMATTERS = {
  gpt: (content: string) => content.trim(),
  claude: (content: string) => {
    // Claude often includes explanations before JSON
    const lines = content.split('\n');
    const jsonStart = lines.findIndex(line => line.trim().startsWith('{'));
    if (jsonStart !== -1) {
      return lines.slice(jsonStart).join('\n').trim();
    }
    return content.trim();
  },
  default: (content: string) => content.trim(),
};

/**
 * Extract JSON from AI response content
 */
function extractJSON(content: string, model: string): any {
  const formatter = getModelFormatter(model);
  const formatted = formatter(content);
  
  // Try different extraction patterns
  for (const [patternName, pattern] of Object.entries(JSON_PATTERNS)) {
    pattern.lastIndex = 0; // Reset regex state
    const matches = [...formatted.matchAll(pattern)];
    
    for (const match of matches) {
      const jsonString = match[1] || match[0];
      try {
        const parsed = JSON.parse(jsonString.trim());
        // Basic validation - must be an object
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      } catch (error) {
        // Continue to next match
        continue;
      }
    }
  }
  
  // Final attempt: try parsing the entire content
  try {
    return JSON.parse(formatted);
  } catch (error) {
    throw new ModelError(
      `Failed to extract valid JSON from ${model} response`,
      model,
      error
    );
  }
}

/**
 * Get model-specific formatter
 */
function getModelFormatter(model: string): (content: string) => string {
  if (model.includes('gpt')) return MODEL_FORMATTERS.gpt;
  if (model.includes('claude')) return MODEL_FORMATTERS.claude;
  return MODEL_FORMATTERS.default;
}

/**
 * Auto-fix common JSON issues
 */
function autoFixJSON(data: any, schema: z.ZodSchema): { data: any; fixed: boolean; fixes: string[] } {
  const fixes: string[] = [];
  let fixed = false;
  
  // Clone to avoid mutations
  const fixedData = JSON.parse(JSON.stringify(data));
  
  // Fix missing required fields
  if (typeof fixedData === 'object' && fixedData !== null) {
    // Add default IDs if missing
    if (!fixedData.id && schema === SiteStructureSchema) {
      fixedData.id = `site_${Date.now()}`;
      fixes.push('Added missing site ID');
      fixed = true;
    }
    
    // Add default metadata if missing
    if (!fixedData.metadata && schema === SiteStructureSchema) {
      fixedData.metadata = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      fixes.push('Added missing metadata');
      fixed = true;
    }
    
    // Fix component tree structure
    if (fixedData.pages && Array.isArray(fixedData.pages)) {
      for (const page of fixedData.pages) {
        if (page.components && !page.components.root) {
          page.components = {
            root: page.components,
            version: '1.0.0',
            metadata: {
              generatedAt: new Date().toISOString(),
              model: 'unknown'
            }
          };
          fixes.push('Fixed component tree structure');
          fixed = true;
        }
      }
    }
    
    // Add unique IDs to components recursively
    function addComponentIds(component: any, prefix = 'comp'): void {
      if (typeof component === 'object' && component !== null) {
        if (!component.id) {
          component.id = `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
          fixes.push(`Added ID to ${component.type || 'component'}`);
          fixed = true;
        }
        
        if (component.children && Array.isArray(component.children)) {
          component.children.forEach((child: any, index: number) => 
            addComponentIds(child, `${component.id || prefix}_${index}`)
          );
        }
      }
    }
    
    if (fixedData.pages) {
      fixedData.pages.forEach((page: any) => {
        if (page.components?.root) {
          addComponentIds(page.components.root, 'page');
        }
      });
    }
  }
  
  return { data: fixedData, fixed, fixes };
}

/**
 * Main response parser function
 */
export async function parseAIResponse<T = SiteStructure>(
  response: RawAIResponse,
  schema: z.ZodSchema<T>,
  options: {
    autoFix?: boolean;
    strictValidation?: boolean;
    extractCost?: boolean;
  } = {}
): Promise<ParsedResponse<T>> {
  const startTime = Date.now();
  const {
    autoFix = true,
    strictValidation = false,
    extractCost = true
  } = options;
  
  let parsedData: any;
  let validationResult: any;
  const issues: any[] = [];
  let autoFixed = false;
  
  try {
    // Step 1: Extract JSON from response
    parsedData = extractJSON(response.content, response.model);
    
    // Step 2: Auto-fix if enabled
    if (autoFix) {
      const fixResult = autoFixJSON(parsedData, schema);
      parsedData = fixResult.data;
      autoFixed = fixResult.fixed;
      
      if (fixResult.fixes.length > 0) {
        issues.push(...fixResult.fixes.map(fix => ({
          type: 'info' as const,
          message: fix,
          suggestion: 'Auto-fixed during parsing'
        })));
      }
    }
    
    // Step 3: Validate against schema
    const validation = schema.safeParse(parsedData);
    
    if (validation.success) {
      validationResult = validation.data;
    } else {
      // Handle validation errors
      for (const error of validation.error.errors) {
        issues.push({
          type: strictValidation ? 'error' : 'warning',
          path: error.path.join('.'),
          message: error.message,
          suggestion: getSuggestionForError(error)
        });
      }
      
      if (strictValidation) {
        throw new ModelError(
          `Validation failed for ${response.model}: ${validation.error.errors[0].message}`,
          response.model,
          validation.error
        );
      }
      
      // Use partial data if not strict
      validationResult = parsedData;
    }
    
    const parsingTime = Date.now() - startTime;
    
    return {
      success: true,
      data: validationResult,
      validation: {
        valid: issues.filter(i => i.type === 'error').length === 0,
        issues,
        autoFixed
      },
      metadata: {
        model: response.model,
        cost: extractCost ? (response.cost || 0) : 0,
        tokens: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        },
        parsingTime,
        fallbackUsed: response.fallback || false
      }
    };
    
  } catch (error) {
    const parsingTime = Date.now() - startTime;
    
    return {
      success: false,
      validation: {
        valid: false,
        issues: [{
          type: 'error',
          message: error.message,
          suggestion: 'Check AI model output format'
        }],
        autoFixed: false
      },
      metadata: {
        model: response.model,
        cost: extractCost ? (response.cost || 0) : 0,
        tokens: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        },
        parsingTime,
        fallbackUsed: response.fallback || false
      },
      error: {
        code: error.code || 'PARSE_ERROR',
        message: error.message,
        details: error
      }
    };
  }
}

/**
 * Get helpful suggestion for validation errors
 */
function getSuggestionForError(error: z.ZodIssue): string {
  switch (error.code) {
    case 'invalid_type':
      return `Expected ${error.expected}, got ${error.received}`;
    case 'too_small':
      return `Value must be at least ${error.minimum}`;
    case 'too_big':
      return `Value must be at most ${error.maximum}`;
    case 'invalid_string':
      return 'String format validation failed';
    case 'unrecognized_keys':
      return 'Remove unexpected properties';
    default:
      return 'Check the expected data format';
  }
}

/**
 * Parse site structure from AI response
 */
export async function parseSiteStructure(response: RawAIResponse): Promise<ParsedResponse<SiteStructure>> {
  return parseAIResponse(response, SiteStructureSchema, {
    autoFix: true,
    strictValidation: false,
    extractCost: true
  });
}

/**
 * Parse component tree from AI response
 */
export async function parseComponentTree(response: RawAIResponse): Promise<ParsedResponse<ComponentTree>> {
  return parseAIResponse(response, ComponentTreeSchema, {
    autoFix: true,
    strictValidation: true,
    extractCost: true
  });
}

/**
 * Parse context extraction from AI response
 */
export async function parseContextExtraction(response: RawAIResponse): Promise<ParsedResponse<any>> {
  return parseAIResponse(response, ContextExtractionSchema, {
    autoFix: false,
    strictValidation: true,
    extractCost: false
  });
}

/**
 * Universal parser that auto-detects response type
 */
export async function parseUniversalResponse(response: RawAIResponse): Promise<ParsedResponse<any>> {
  const data = extractJSON(response.content, response.model);
  
  // Detect response type based on structure
  if (data.pages && data.globalStyles) {
    return parseSiteStructure(response);
  } else if (data.root && data.version) {
    return parseComponentTree(response);
  } else if (data.industry && data.audience) {
    return parseContextExtraction(response);
  }
  
  // Default to generic parsing
  return parseAIResponse(response, z.any(), {
    autoFix: false,
    strictValidation: false,
    extractCost: true
  });
}