/**
 * Multi-Model Response Normalizer
 * 
 * Normalizes output differences between different AI models
 * (GPT-4, Claude, etc.) to a consistent format
 */

import { z } from 'zod';
import { 
  SiteStructureSchema,
  ComponentTreeSchema,
  type SiteStructure,
  type ComponentTree,
  type ComponentNode 
} from '../schemas/site-structure';

/**
 * Model-specific response patterns
 */
interface ModelPatterns {
  name: string;
  patterns: {
    // How the model typically structures responses
    siteStructure: (data: any) => any;
    componentTree: (data: any) => any;
    content: (data: any) => any;
  };
  quirks: {
    // Model-specific issues to normalize
    extraFields?: string[];
    missingFields?: Record<string, any>;
    fieldMapping?: Record<string, string>;
    arrayFormat?: 'single' | 'nested';
  };
}

/**
 * Model normalization patterns
 */
const MODEL_PATTERNS: Record<string, ModelPatterns> = {
  'gpt-4': {
    name: 'GPT-4',
    patterns: {
      siteStructure: (data) => data,
      componentTree: (data) => data,
      content: (data) => data
    },
    quirks: {
      extraFields: ['reasoning', 'explanation'],
      fieldMapping: {
        'siteName': 'name',
        'pageTitle': 'title',
        'componentType': 'type'
      }
    }
  },
  
  'claude-3': {
    name: 'Claude-3',
    patterns: {
      siteStructure: (data) => {
        // Claude often wraps in explanation
        if (data.website || data.site) {
          return data.website || data.site;
        }
        return data;
      },
      componentTree: (data) => {
        // Claude might structure differently
        if (data.structure || data.tree) {
          return data.structure || data.tree;
        }
        return data;
      },
      content: (data) => {
        // Claude often provides richer context
        if (data.content && data.context) {
          return { ...data.content, metadata: data.context };
        }
        return data;
      }
    },
    quirks: {
      extraFields: ['reasoning', 'considerations', 'alternatives'],
      missingFields: {
        version: '1.0.0'
      },
      fieldMapping: {
        'websiteName': 'name',
        'siteTitle': 'name',
        'componentName': 'type'
      }
    }
  },
  
  'claude-3-haiku': {
    name: 'Claude-3-Haiku',
    patterns: {
      siteStructure: (data) => data,
      componentTree: (data) => data,
      content: (data) => data
    },
    quirks: {
      extraFields: ['notes'],
      missingFields: {
        metadata: {
          generatedAt: new Date().toISOString(),
          model: 'claude-3-haiku'
        }
      }
    }
  }
};

/**
 * Get model pattern based on model name
 */
function getModelPattern(model: string): ModelPatterns {
  // Check for exact matches first
  if (MODEL_PATTERNS[model]) {
    return MODEL_PATTERNS[model];
  }
  
  // Check for partial matches
  for (const [key, pattern] of Object.entries(MODEL_PATTERNS)) {
    if (model.includes(key) || key.includes(model.split('-')[0])) {
      return pattern;
    }
  }
  
  // Default to GPT-4 pattern
  return MODEL_PATTERNS['gpt-4'];
}

/**
 * Normalize response to standard format
 */
export function normalizeResponse(
  data: any,
  model: string,
  responseType: 'siteStructure' | 'componentTree' | 'content' = 'siteStructure'
): any {
  const pattern = getModelPattern(model);
  const normalizer = pattern.patterns[responseType];
  
  // Step 1: Apply model-specific normalization
  let normalized = normalizer(data);
  
  // Step 2: Apply quirk fixes
  normalized = applyQuirkFixes(normalized, pattern.quirks);
  
  // Step 3: Apply standard transformations
  normalized = applyStandardTransforms(normalized, responseType);
  
  return normalized;
}

/**
 * Apply model-specific quirk fixes
 */
function applyQuirkFixes(data: any, quirks: ModelPatterns['quirks']): any {
  let fixed = JSON.parse(JSON.stringify(data)); // Deep clone
  
  // Remove extra fields
  if (quirks.extraFields) {
    for (const field of quirks.extraFields) {
      if (fixed[field] !== undefined) {
        delete fixed[field];
      }
    }
  }
  
  // Add missing fields
  if (quirks.missingFields) {
    for (const [field, value] of Object.entries(quirks.missingFields)) {
      if (fixed[field] === undefined) {
        fixed[field] = typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value;
      }
    }
  }
  
  // Apply field mapping
  if (quirks.fieldMapping) {
    for (const [oldField, newField] of Object.entries(quirks.fieldMapping)) {
      if (fixed[oldField] !== undefined && fixed[newField] === undefined) {
        fixed[newField] = fixed[oldField];
        delete fixed[oldField];
      }
    }
  }
  
  return fixed;
}

/**
 * Apply standard transformations regardless of model
 */
function applyStandardTransforms(data: any, responseType: string): any {
  let transformed = JSON.parse(JSON.stringify(data)); // Deep clone
  
  switch (responseType) {
    case 'siteStructure':
      transformed = normalizeSiteStructure(transformed);
      break;
    case 'componentTree':
      transformed = normalizeComponentTree(transformed);
      break;
    case 'content':
      transformed = normalizeContent(transformed);
      break;
  }
  
  return transformed;
}

/**
 * Normalize site structure format
 */
function normalizeSiteStructure(data: any): SiteStructure {
  // Ensure basic structure
  if (!data.id) {
    data.id = `site_${Date.now()}`;
  }
  
  if (!data.name && data.siteName) {
    data.name = data.siteName;
    delete data.siteName;
  }
  
  if (!data.pages) {
    data.pages = [];
  }
  
  // Normalize pages
  data.pages = data.pages.map((page: any, index: number) => ({
    id: page.id || `page_${index}`,
    name: page.name || page.title || `Page ${index + 1}`,
    path: page.path || page.route || `/${index}`,
    template: page.template,
    components: normalizeComponentTree(page.components || { root: { id: 'empty', type: 'div', props: {} } }),
    seo: normalizeSEO(page.seo || {}),
    settings: page.settings || { isPublic: true, requiresAuth: false, layout: 'full' }
  }));
  
  // Normalize global styles
  if (!data.globalStyles) {
    data.globalStyles = getDefaultGlobalStyles();
  }
  
  // Normalize navigation
  if (!data.navigation) {
    data.navigation = {
      main: data.pages.map((page: any) => ({
        label: page.name,
        path: page.path
      })),
      footer: []
    };
  }
  
  // Ensure metadata
  if (!data.metadata) {
    data.metadata = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }
  
  return data;
}

/**
 * Normalize component tree format
 */
function normalizeComponentTree(data: any): ComponentTree {
  if (!data.root) {
    // If data is the root component directly
    if (data.type || data.id) {
      data = {
        root: data,
        version: '1.0.0',
        metadata: {
          generatedAt: new Date().toISOString(),
          model: 'unknown'
        }
      };
    }
  }
  
  // Normalize root component
  if (data.root) {
    data.root = normalizeComponent(data.root);
  }
  
  if (!data.version) {
    data.version = '1.0.0';
  }
  
  if (!data.metadata) {
    data.metadata = {
      generatedAt: new Date().toISOString(),
      model: 'unknown'
    };
  }
  
  return data;
}

/**
 * Normalize individual component
 */
function normalizeComponent(component: any): ComponentNode {
  const normalized: any = {
    id: component.id || `comp_${Math.random().toString(36).substr(2, 9)}`,
    type: component.type || 'div',
    props: component.props || {},
    children: component.children || [],
    styles: component.styles || component.style || {},
    content: component.content || {},
    metadata: component.metadata || {}
  };
  
  // Normalize children recursively
  if (normalized.children && Array.isArray(normalized.children)) {
    normalized.children = normalized.children.map(normalizeComponent);
  }
  
  // Normalize styles format
  if (typeof normalized.styles === 'string') {
    normalized.styles = { className: normalized.styles };
  }
  
  // Normalize content format
  if (typeof normalized.content === 'string') {
    normalized.content = { text: normalized.content };
  }
  
  return normalized;
}

/**
 * Normalize SEO metadata
 */
function normalizeSEO(seo: any): any {
  return {
    title: seo.title || seo.pageTitle || 'Untitled Page',
    description: seo.description || seo.pageDescription || '',
    keywords: seo.keywords || seo.tags || [],
    ogTitle: seo.ogTitle || seo.title,
    ogDescription: seo.ogDescription || seo.description,
    ogImage: seo.ogImage,
    canonicalUrl: seo.canonicalUrl,
    robots: seo.robots || 'index,follow'
  };
}

/**
 * Normalize content format
 */
function normalizeContent(content: any): any {
  if (typeof content === 'string') {
    return { text: content };
  }
  
  return {
    text: content.text || content.content || '',
    html: content.html,
    markdown: content.markdown || content.md
  };
}

/**
 * Get default global styles
 */
function getDefaultGlobalStyles() {
  return {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#ffffff',
      text: '#1f2937',
      muted: '#6b7280',
      border: '#e5e7eb'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      monoFont: 'JetBrains Mono'
    },
    spacing: {
      base: '1rem'
    },
    borderRadius: '0.5rem',
    shadows: 'medium'
  };
}

/**
 * Model-specific content extraction
 */
export function extractModelContent(rawContent: string, model: string): string {
  const pattern = getModelPattern(model);
  
  // Apply model-specific content extraction
  if (model.includes('claude')) {
    // Claude often includes thinking and explanation
    const lines = rawContent.split('\n');
    const contentStart = lines.findIndex(line => 
      line.includes('{') || line.toLowerCase().includes('here') || line.toLowerCase().includes('result')
    );
    
    if (contentStart !== -1) {
      return lines.slice(contentStart).join('\n');
    }
  } else if (model.includes('gpt')) {
    // GPT usually provides clean JSON
    return rawContent.trim();
  }
  
  return rawContent.trim();
}

/**
 * Normalize differences between model outputs
 */
export function normalizeModelDifferences(
  data: any,
  fromModel: string,
  targetFormat: 'standard' | 'aether' = 'aether'
): any {
  // Step 1: Extract content based on model
  const content = typeof data === 'string' ? extractModelContent(data, fromModel) : data;
  
  // Step 2: Parse if it's a string
  let parsed = content;
  if (typeof content === 'string') {
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse ${fromModel} response as JSON: ${error.message}`);
    }
  }
  
  // Step 3: Apply model-specific normalization
  const pattern = getModelPattern(fromModel);
  let normalized = pattern.patterns.siteStructure(parsed);
  
  // Step 4: Apply quirk fixes
  normalized = applyQuirkFixes(normalized, pattern.quirks);
  
  // Step 5: Apply target format transformations
  if (targetFormat === 'aether') {
    normalized = transformToAetherFormat(normalized);
  }
  
  return normalized;
}

/**
 * Transform to Aether-specific format
 */
function transformToAetherFormat(data: any): any {
  const transformed = JSON.parse(JSON.stringify(data)); // Deep clone
  
  // Ensure Aether-specific structure
  if (!transformed.id) {
    transformed.id = `aether_${Date.now()}`;
  }
  
  // Ensure Aether metadata format
  if (!transformed.metadata) {
    transformed.metadata = {};
  }
  
  transformed.metadata = {
    ...transformed.metadata,
    createdAt: transformed.metadata.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: transformed.metadata.version || '1.0.0',
    generator: 'aether-ai'
  };
  
  // Transform pages to Aether format
  if (transformed.pages) {
    transformed.pages = transformed.pages.map((page: any) => ({
      ...page,
      id: page.id || `page_${Math.random().toString(36).substr(2, 9)}`,
      components: normalizeComponentTree(page.components || {}),
      seo: normalizeSEO(page.seo || {})
    }));
  }
  
  // Ensure Aether global styles
  if (!transformed.globalStyles) {
    transformed.globalStyles = getDefaultGlobalStyles();
  } else {
    transformed.globalStyles = {
      ...getDefaultGlobalStyles(),
      ...transformed.globalStyles
    };
  }
  
  return transformed;
}

/**
 * Detect response type from structure
 */
export function detectResponseType(data: any): 'siteStructure' | 'componentTree' | 'content' | 'unknown' {
  if (data.pages && (data.globalStyles || data.navigation)) {
    return 'siteStructure';
  }
  
  if (data.root && data.version) {
    return 'componentTree';
  }
  
  if (data.text || data.html || data.markdown) {
    return 'content';
  }
  
  // Check for component-like structure
  if (data.type && (data.props || data.children)) {
    return 'componentTree';
  }
  
  return 'unknown';
}

/**
 * Smart normalization that auto-detects format
 */
export function smartNormalize(data: any, model: string): {
  type: string;
  normalized: any;
  confidence: number;
} {
  const responseType = detectResponseType(data);
  const confidence = calculateConfidence(data, responseType);
  
  let normalized: any;
  
  switch (responseType) {
    case 'siteStructure':
      normalized = normalizeResponse(data, model, 'siteStructure');
      break;
    case 'componentTree':
      normalized = normalizeResponse(data, model, 'componentTree');
      break;
    case 'content':
      normalized = normalizeResponse(data, model, 'content');
      break;
    default:
      // Try to infer and convert
      if (data.components || data.sections) {
        // Looks like site structure
        normalized = normalizeResponse(data, model, 'siteStructure');
      } else {
        // Default to content
        normalized = normalizeResponse(data, model, 'content');
      }
  }
  
  return {
    type: responseType,
    normalized,
    confidence
  };
}

/**
 * Calculate confidence level for detected type
 */
function calculateConfidence(data: any, type: string): number {
  let confidence = 50; // Base confidence
  
  switch (type) {
    case 'siteStructure':
      if (data.pages) confidence += 20;
      if (data.globalStyles) confidence += 15;
      if (data.navigation) confidence += 10;
      if (data.metadata) confidence += 5;
      break;
      
    case 'componentTree':
      if (data.root) confidence += 25;
      if (data.version) confidence += 10;
      if (data.metadata) confidence += 10;
      if (data.root?.children) confidence += 5;
      break;
      
    case 'content':
      if (data.text || data.html) confidence += 30;
      if (data.seo) confidence += 10;
      if (data.metadata) confidence += 10;
      break;
  }
  
  return Math.min(100, confidence);
}

/**
 * Batch normalize multiple responses
 */
export async function batchNormalize(
  responses: Array<{ data: any; model: string; type?: string }>,
  targetFormat: 'standard' | 'aether' = 'aether'
): Promise<Array<{ normalized: any; type: string; confidence: number }>> {
  return Promise.all(
    responses.map(async ({ data, model, type }) => {
      if (type) {
        const normalized = normalizeResponse(data, model, type as any);
        return { normalized, type, confidence: 100 };
      } else {
        return smartNormalize(data, model);
      }
    })
  );
}

/**
 * Validation-aware normalization
 */
export async function normalizeAndValidate(
  data: any,
  model: string,
  schema: z.ZodSchema,
  maxAttempts = 3
): Promise<{ normalized: any; valid: boolean; issues: any[] }> {
  let attempt = 0;
  let lastError: any;
  
  while (attempt < maxAttempts) {
    try {
      // Normalize data
      const smart = smartNormalize(data, model);
      const normalized = smart.normalized;
      
      // Validate
      const validation = schema.safeParse(normalized);
      
      if (validation.success) {
        return {
          normalized: validation.data,
          valid: true,
          issues: []
        };
      } else {
        // Apply additional fixes based on validation errors
        const fixed = applyValidationFixes(normalized, validation.error);
        const revalidation = schema.safeParse(fixed);
        
        if (revalidation.success) {
          return {
            normalized: revalidation.data,
            valid: true,
            issues: validation.error.errors.map(err => ({
              type: 'warning',
              message: err.message,
              path: err.path.join('.'),
              autoFixed: true
            }))
          };
        }
        
        lastError = validation.error;
      }
    } catch (error) {
      lastError = error;
    }
    
    attempt++;
  }
  
  // Return best effort result
  return {
    normalized: data,
    valid: false,
    issues: [{
      type: 'error',
      message: `Failed to normalize after ${maxAttempts} attempts: ${lastError.message}`,
      autoFixed: false
    }]
  };
}

/**
 * Apply fixes based on validation errors
 */
function applyValidationFixes(data: any, error: z.ZodError): any {
  const fixed = JSON.parse(JSON.stringify(data));
  
  for (const issue of error.errors) {
    const path = issue.path;
    const value = path.reduce((obj, key) => obj?.[key], fixed);
    
    // Apply specific fixes based on error type
    switch (issue.code) {
      case 'invalid_type':
        if (issue.expected === 'string' && typeof value !== 'string') {
          setNestedValue(fixed, path, String(value || ''));
        } else if (issue.expected === 'array' && !Array.isArray(value)) {
          setNestedValue(fixed, path, []);
        }
        break;
        
      case 'too_small':
        if (typeof value === 'string' && value.length < issue.minimum) {
          setNestedValue(fixed, path, value.padEnd(issue.minimum, ' '));
        }
        break;
    }
  }
  
  return fixed;
}

/**
 * Set nested object value by path
 */
function setNestedValue(obj: any, path: (string | number)[], value: any): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
}

/**
 * Export main functions
 */
export default {
  normalizeResponse,
  normalizeModelDifferences,
  smartNormalize,
  batchNormalize,
  normalizeAndValidate,
  detectResponseType,
  extractModelContent
};