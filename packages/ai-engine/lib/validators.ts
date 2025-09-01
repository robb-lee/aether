/**
 * Comprehensive Validation System for AI Responses
 * 
 * Provides validation, auto-fixing, and detailed error reporting
 * for AI-generated content across different models
 */

import { z } from 'zod';
import {
  SiteStructureSchema,
  ComponentTreeSchema,
  ComponentNodeSchema,
  SEOMetadataSchema,
  type SiteStructure,
  type ComponentTree,
  type ComponentNode
} from '../schemas/site-structure';

/**
 * Validation issue with severity and fix suggestions
 */
export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  component?: string;
  path?: string;
  field?: string;
  message: string;
  suggestion?: string;
  autoFixable: boolean;
  code: string;
}

/**
 * Validation result with detailed reporting
 */
export interface ValidationResult {
  valid: boolean;
  score: number; // 0-100
  issues: ValidationIssue[];
  autoFixed: boolean;
  fixedData?: any;
  metadata: {
    validatedAt: string;
    validationTime: number;
    rulesApplied: string[];
    modelUsed?: string;
  };
}

/**
 * Validation rules for different content types
 */
const VALIDATION_RULES = {
  siteStructure: [
    'required_fields',
    'component_hierarchy',
    'style_consistency',
    'seo_compliance',
    'accessibility',
    'performance',
    'security'
  ],
  componentTree: [
    'tree_structure',
    'component_types',
    'prop_validation',
    'style_format',
    'content_safety'
  ],
  content: [
    'text_quality',
    'seo_optimization',
    'accessibility',
    'brand_consistency'
  ]
};

/**
 * Auto-fix strategies for common issues
 */
class AutoFixer {
  static fixMissingIds(data: any): { fixed: boolean; changes: string[] } {
    const changes: string[] = [];
    let fixed = false;
    
    function addIds(obj: any, prefix = 'auto'): void {
      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => addIds(item, `${prefix}_${index}`));
        } else {
          if (obj.type && !obj.id) {
            obj.id = `${prefix}_${obj.type}_${Math.random().toString(36).substr(2, 9)}`;
            changes.push(`Added ID to ${obj.type} component`);
            fixed = true;
          }
          
          Object.values(obj).forEach(value => {
            if (typeof value === 'object') addIds(value, obj.id || prefix);
          });
        }
      }
    }
    
    addIds(data);
    return { fixed, changes };
  }
  
  static fixStyleFormat(data: any): { fixed: boolean; changes: string[] } {
    const changes: string[] = [];
    let fixed = false;
    
    function normalizeStyles(obj: any): void {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.styles && typeof obj.styles === 'string') {
          // Convert string styles to object
          obj.styles = { className: obj.styles };
          changes.push('Converted string styles to object format');
          fixed = true;
        }
        
        if (obj.className && !obj.styles) {
          // Move className into styles object
          obj.styles = { className: obj.className };
          delete obj.className;
          changes.push('Moved className into styles object');
          fixed = true;
        }
        
        Object.values(obj).forEach(value => {
          if (typeof value === 'object') normalizeStyles(value);
        });
      }
    }
    
    normalizeStyles(data);
    return { fixed, changes };
  }
  
  static fixSEOMetadata(data: any): { fixed: boolean; changes: string[] } {
    const changes: string[] = [];
    let fixed = false;
    
    if (data.pages && Array.isArray(data.pages)) {
      for (const page of data.pages) {
        if (!page.seo) {
          page.seo = {
            title: page.title || page.name || 'Untitled Page',
            description: 'Generated page description',
            keywords: []
          };
          changes.push(`Added SEO metadata to ${page.path || 'page'}`);
          fixed = true;
        }
        
        // Validate SEO field lengths
        if (page.seo.title && page.seo.title.length > 60) {
          page.seo.title = page.seo.title.substring(0, 57) + '...';
          changes.push('Truncated long SEO title');
          fixed = true;
        }
        
        if (page.seo.description && page.seo.description.length > 160) {
          page.seo.description = page.seo.description.substring(0, 157) + '...';
          changes.push('Truncated long SEO description');
          fixed = true;
        }
      }
    }
    
    return { fixed, changes };
  }
  
  static fixComponentStructure(data: any): { fixed: boolean; changes: string[] } {
    const changes: string[] = [];
    let fixed = false;
    
    function normalizeComponent(component: any): void {
      if (typeof component === 'object' && component !== null) {
        // Ensure required fields
        if (!component.type) {
          component.type = 'div';
          changes.push('Added default component type');
          fixed = true;
        }
        
        if (!component.props) {
          component.props = {};
          changes.push('Added empty props object');
          fixed = true;
        }
        
        // Normalize children structure
        if (component.children && Array.isArray(component.children)) {
          component.children.forEach(child => normalizeComponent(child));
        }
      }
    }
    
    if (data.pages) {
      data.pages.forEach((page: any) => {
        if (page.components?.root) {
          normalizeComponent(page.components.root);
        }
      });
    }
    
    return { fixed, changes };
  }
}

/**
 * Main validation function with auto-fix
 */
export async function validateAIResponse(
  data: any,
  schema: z.ZodSchema,
  options: {
    autoFix?: boolean;
    strictMode?: boolean;
    model?: string;
  } = {}
): Promise<ValidationResult> {
  const startTime = Date.now();
  const { autoFix = true, strictMode = false, model } = options;
  
  const issues: ValidationIssue[] = [];
  let fixedData = JSON.parse(JSON.stringify(data)); // Deep clone
  let autoFixed = false;
  const rulesApplied: string[] = [];
  
  // Step 1: Auto-fix common issues if enabled
  if (autoFix) {
    const fixers = [
      AutoFixer.fixMissingIds,
      AutoFixer.fixStyleFormat,
      AutoFixer.fixSEOMetadata,
      AutoFixer.fixComponentStructure
    ];
    
    for (const fixer of fixers) {
      const result = fixer(fixedData);
      if (result.fixed) {
        autoFixed = true;
        rulesApplied.push(fixer.name);
        issues.push(...result.changes.map(change => ({
          type: 'info' as const,
          severity: 'low' as const,
          message: change,
          suggestion: 'Auto-fixed during validation',
          autoFixable: true,
          code: 'AUTO_FIX'
        })));
      }
    }
  }
  
  // Step 2: Schema validation
  const validation = schema.safeParse(fixedData);
  
  if (!validation.success) {
    for (const error of validation.error.errors) {
      const severity = getSeverityForError(error);
      const autoFixable = isAutoFixable(error);
      
      issues.push({
        type: strictMode ? 'error' : 'warning',
        severity,
        path: error.path.join('.'),
        field: error.path[error.path.length - 1]?.toString(),
        message: error.message,
        suggestion: getSuggestionForError(error),
        autoFixable,
        code: error.code.toUpperCase()
      });
    }
  }
  
  // Step 3: Content quality checks
  const qualityIssues = await validateContentQuality(fixedData);
  issues.push(...qualityIssues);
  
  // Step 4: Calculate validation score
  const score = calculateValidationScore(issues, fixedData);
  
  const validationTime = Date.now() - startTime;
  
  return {
    valid: issues.filter(i => i.type === 'error').length === 0,
    score,
    issues,
    autoFixed,
    fixedData: autoFixed ? fixedData : undefined,
    metadata: {
      validatedAt: new Date().toISOString(),
      validationTime,
      rulesApplied,
      modelUsed: model
    }
  };
}

/**
 * Validate content quality and safety
 */
async function validateContentQuality(data: any): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  
  function checkContent(obj: any, path = ''): void {
    if (typeof obj === 'object' && obj !== null) {
      // Check for empty or placeholder content
      if (obj.content?.text === 'Lorem ipsum' || obj.content?.text === '') {
        issues.push({
          type: 'warning',
          severity: 'medium',
          path,
          message: 'Placeholder or empty content detected',
          suggestion: 'Generate actual content for this component',
          autoFixable: false,
          code: 'PLACEHOLDER_CONTENT'
        });
      }
      
      // Check for broken image URLs
      if (obj.props?.src && typeof obj.props.src === 'string') {
        if (obj.props.src.includes('placeholder') || obj.props.src === '') {
          issues.push({
            type: 'info',
            severity: 'low',
            path,
            message: 'Placeholder image detected',
            suggestion: 'Replace with actual image URL',
            autoFixable: true,
            code: 'PLACEHOLDER_IMAGE'
          });
        }
      }
      
      // Check for accessibility issues
      if (obj.type === 'img' && !obj.props?.alt) {
        issues.push({
          type: 'warning',
          severity: 'high',
          path,
          message: 'Image missing alt text',
          suggestion: 'Add descriptive alt text for accessibility',
          autoFixable: true,
          code: 'MISSING_ALT_TEXT'
        });
      }
      
      // Recursively check children
      if (obj.children && Array.isArray(obj.children)) {
        obj.children.forEach((child: any, index: number) => 
          checkContent(child, `${path}.children[${index}]`)
        );
      }
      
      // Check nested objects
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && key !== 'children') {
          checkContent(value, path ? `${path}.${key}` : key);
        }
      });
    }
  }
  
  checkContent(data);
  return issues;
}

/**
 * Calculate validation score (0-100)
 */
function calculateValidationScore(issues: ValidationIssue[], data: any): number {
  let score = 100;
  
  // Deduct points based on issue severity
  for (const issue of issues) {
    switch (issue.severity) {
      case 'critical':
        score -= 25;
        break;
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 8;
        break;
      case 'low':
        score -= 3;
        break;
    }
  }
  
  // Bonus points for completeness
  if (data.pages && data.pages.length > 0) score += 5;
  if (data.globalStyles) score += 5;
  if (data.navigation) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Get severity level for Zod error
 */
function getSeverityForError(error: z.ZodIssue): ValidationIssue['severity'] {
  switch (error.code) {
    case 'invalid_type':
      return error.path.includes('id') ? 'critical' : 'high';
    case 'too_small':
    case 'too_big':
      return 'medium';
    case 'invalid_string':
      return error.path.includes('url') ? 'high' : 'medium';
    case 'unrecognized_keys':
      return 'low';
    default:
      return 'medium';
  }
}

/**
 * Check if error can be auto-fixed
 */
function isAutoFixable(error: z.ZodIssue): boolean {
  switch (error.code) {
    case 'invalid_type':
      return error.expected === 'string' || error.expected === 'object';
    case 'too_small':
    case 'too_big':
      return true;
    case 'unrecognized_keys':
      return true;
    default:
      return false;
  }
}

/**
 * Get helpful suggestion for error resolution
 */
function getSuggestionForError(error: z.ZodIssue): string {
  switch (error.code) {
    case 'invalid_type':
      return `Convert to ${error.expected} type or provide default value`;
    case 'too_small':
      return `Minimum ${error.minimum} ${error.type} required`;
    case 'too_big':
      return `Maximum ${error.maximum} ${error.type} allowed`;
    case 'invalid_string':
      if (error.validation === 'url') return 'Provide valid URL format';
      if (error.validation === 'email') return 'Provide valid email format';
      return 'Check string format requirements';
    case 'unrecognized_keys':
      return 'Remove extra properties or update schema';
    default:
      return 'Review field requirements in schema';
  }
}

/**
 * Validate site structure with comprehensive checks
 */
export async function validateSiteStructure(data: any, options: {
  autoFix?: boolean;
  strictMode?: boolean;
  model?: string;
} = {}): Promise<ValidationResult> {
  return validateAIResponse(data, SiteStructureSchema, options);
}

/**
 * Validate component tree structure
 */
export async function validateComponentTree(data: any, options: {
  autoFix?: boolean;
  strictMode?: boolean;
  model?: string;
} = {}): Promise<ValidationResult> {
  return validateAIResponse(data, ComponentTreeSchema, options);
}

/**
 * Validate individual component
 */
export async function validateComponent(data: any, options: {
  autoFix?: boolean;
  strictMode?: boolean;
} = {}): Promise<ValidationResult> {
  return validateAIResponse(data, ComponentNodeSchema, options);
}

/**
 * Validate SEO metadata
 */
export async function validateSEO(data: any, options: {
  autoFix?: boolean;
  strictMode?: boolean;
} = {}): Promise<ValidationResult> {
  return validateAIResponse(data, SEOMetadataSchema, options);
}

/**
 * Batch validation for multiple items
 */
export async function validateBatch(
  items: Array<{ data: any; schema: z.ZodSchema; name: string }>,
  options: { autoFix?: boolean; strictMode?: boolean } = {}
): Promise<{ [key: string]: ValidationResult }> {
  const results: { [key: string]: ValidationResult } = {};
  
  // Validate all items in parallel
  const validations = items.map(async (item) => {
    const result = await validateAIResponse(item.data, item.schema, options);
    return { name: item.name, result };
  });
  
  const completed = await Promise.all(validations);
  
  for (const { name, result } of completed) {
    results[name] = result;
  }
  
  return results;
}

/**
 * Custom validation rules for business logic
 */
export class CustomValidator {
  private rules: Array<{
    name: string;
    validate: (data: any) => ValidationIssue[];
  }> = [];
  
  addRule(name: string, validate: (data: any) => ValidationIssue[]): void {
    this.rules.push({ name, validate });
  }
  
  async validate(data: any): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    for (const rule of this.rules) {
      try {
        const ruleIssues = rule.validate(data);
        issues.push(...ruleIssues);
      } catch (error) {
        issues.push({
          type: 'error',
          severity: 'high',
          message: `Validation rule '${rule.name}' failed: ${error.message}`,
          suggestion: 'Check custom validation rule implementation',
          autoFixable: false,
          code: 'RULE_ERROR'
        });
      }
    }
    
    return issues;
  }
}

/**
 * Pre-built custom validation rules
 */
export const CUSTOM_RULES = {
  // Ensure proper component hierarchy
  componentHierarchy: (data: any): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    
    function checkHierarchy(component: any, depth = 0): void {
      if (depth > 10) {
        issues.push({
          type: 'warning',
          severity: 'medium',
          component: component.id,
          message: 'Component hierarchy too deep (>10 levels)',
          suggestion: 'Flatten component structure',
          autoFixable: false,
          code: 'DEEP_HIERARCHY'
        });
      }
      
      if (component.children) {
        component.children.forEach((child: any) => checkHierarchy(child, depth + 1));
      }
    }
    
    if (data.pages) {
      data.pages.forEach((page: any) => {
        if (page.components?.root) {
          checkHierarchy(page.components.root);
        }
      });
    }
    
    return issues;
  },
  
  // Check for required business elements
  businessElements: (data: any): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];
    const requiredElements = ['hero', 'contact', 'footer'];
    
    if (data.pages && data.pages.length > 0) {
      const homePage = data.pages.find((p: any) => p.path === '/');
      if (homePage && homePage.components?.root) {
        const componentTypes = extractComponentTypes(homePage.components.root);
        
        for (const required of requiredElements) {
          if (!componentTypes.includes(required)) {
            issues.push({
              type: 'warning',
              severity: 'medium',
              message: `Missing recommended ${required} component`,
              suggestion: `Add ${required} component to improve user experience`,
              autoFixable: false,
              code: 'MISSING_COMPONENT'
            });
          }
        }
      }
    }
    
    return issues;
  }
};

/**
 * Extract component types from tree
 */
function extractComponentTypes(component: any): string[] {
  const types: string[] = [];
  
  function traverse(comp: any): void {
    if (comp.type) types.push(comp.type);
    if (comp.children) {
      comp.children.forEach(traverse);
    }
  }
  
  traverse(component);
  return types;
}

/**
 * Quick validation helpers
 */
export const quickValidate = {
  isValidJSON: (content: string): boolean => {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  },
  
  hasRequiredFields: (data: any, fields: string[]): boolean => {
    return fields.every(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], data);
      return value !== undefined && value !== null;
    });
  },
  
  isValidComponentTree: (data: any): boolean => {
    try {
      ComponentTreeSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  },
  
  isValidSiteStructure: (data: any): boolean => {
    try {
      SiteStructureSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }
};

export default {
  validateAIResponse,
  validateSiteStructure,
  validateComponentTree,
  validateComponent,
  validateSEO,
  validateBatch,
  CustomValidator,
  CUSTOM_RULES,
  quickValidate
};