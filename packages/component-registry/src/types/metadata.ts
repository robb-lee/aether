import { z } from 'zod';
import { DesignTokensSchema } from './design-tokens';

/**
 * Performance metrics schema
 */
export const PerformanceMetricsSchema = z.object({
  lighthouse: z.number().min(0).max(100),
  bundleSize: z.number().min(0), // KB
  renderTime: z.number().min(0), // ms
  cls: z.number().min(0),        // Cumulative Layout Shift
  fcp: z.number().min(0),        // First Contentful Paint (seconds)
  lcp: z.number().min(0)         // Largest Contentful Paint (seconds)
});

/**
 * Accessibility metrics schema
 */
export const AccessibilityMetricsSchema = z.object({
  wcagLevel: z.enum(['A', 'AA', 'AAA']),
  ariaCompliant: z.boolean(),
  keyboardNavigable: z.boolean(),
  screenReaderOptimized: z.boolean(),
  colorContrast: z.number().min(1),
  focusManagement: z.boolean(),
  semanticMarkup: z.boolean().optional()
});

/**
 * Compatibility information schema
 */
export const CompatibilityInfoSchema = z.object({
  mobile: z.boolean(),
  responsive: z.boolean(),
  browsers: z.array(z.string()),
  frameworks: z.array(z.string()),
  serverComponents: z.boolean(),
  clientComponents: z.boolean().optional(),
  nodeVersion: z.string().optional()
});

/**
 * Usage statistics schema
 */
export const UsageStatisticsSchema = z.object({
  totalUsage: z.number().min(0),
  successRate: z.number().min(0).max(1),
  conversionRate: z.number().min(0).max(1).optional(),
  industries: z.array(z.string()),
  popularCombinations: z.array(z.string()),
  averageProps: z.record(z.any()),
  feedbackScore: z.number().min(0).max(5).optional(),
  lastUsed: z.string().optional()
});

/**
 * Component variants schema
 */
export const ComponentVariantsSchema = z.object({
  layout: z.array(z.string()).optional(),
  style: z.array(z.string()).optional(),
  colorScheme: z.array(z.string()).optional(),
  size: z.array(z.string()).optional(),
  animation: z.array(z.string()).optional(),
  density: z.array(z.string()).optional(), // ['compact', 'comfortable', 'spacious']
  orientation: z.array(z.string()).optional() // ['horizontal', 'vertical']
});

/**
 * AI selection hints schema
 */
export const AIHintsSchema = z.object({
  industries: z.array(z.string()),
  useCases: z.array(z.string()),
  keywords: z.array(z.string()),
  avoidWhen: z.array(z.string()),
  preferWhen: z.array(z.string()).optional(),
  alternatives: z.array(z.string()).optional(),
  
  // AI prompt context
  promptHints: z.object({
    description: z.string(),
    bestPractices: z.array(z.string()).optional(),
    commonMistakes: z.array(z.string()).optional()
  }).optional()
});

/**
 * Component metadata schema (extensible)
 */
export const ComponentMetadataSchema = z.object({
  version: z.string(),
  author: z.string().optional(),
  description: z.string(),
  tags: z.array(z.string()),
  category: z.enum(['hero', 'features', 'cta', 'header', 'footer', 'pricing', 'testimonials', 'contact', 'navigation', 'content', 'layout', 'team', 'gallery', 'faq', 'stats', 'blog', 'timeline']),
  
  // Core metrics
  performance: PerformanceMetricsSchema,
  accessibility: AccessibilityMetricsSchema,
  compatibility: CompatibilityInfoSchema,
  usage: UsageStatisticsSchema,
  
  // Design and customization
  designTokens: DesignTokensSchema.optional(),
  variants: ComponentVariantsSchema.optional(),
  
  // AI integration
  aiHints: AIHintsSchema.optional(),
  
  // Documentation
  documentation: z.object({
    readme: z.string().optional(),
    examples: z.array(z.any()).optional(),
    changelog: z.string().optional()
  }).optional(),
  
  // Extensible custom fields (for JSON expansion)
  custom: z.record(z.any()).optional(),
  
  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string()
});

/**
 * Industry mapping schema
 */
export const IndustryMappingSchema = z.object({
  industry: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  
  // Component recommendations
  recommended: z.array(z.string()),
  avoid: z.array(z.string()).optional(),
  required: z.array(z.string()).optional(),
  
  // Style preferences
  preferredStyle: z.string(),
  designTokens: DesignTokensSchema.optional(),
  
  // Customizations
  componentCustomizations: z.record(z.object({
    defaultProps: z.record(z.any()).optional(),
    forcedProps: z.record(z.any()).optional(),
    variants: z.record(z.any()).optional()
  })).optional(),
  
  // Success metrics
  metrics: z.object({
    conversionRate: z.number().min(0).max(1).optional(),
    engagementRate: z.number().min(0).max(1).optional(),
    bounceRate: z.number().min(0).max(1).optional()
  }).optional(),
  
  // Extensible
  custom: z.record(z.any()).optional()
});

/**
 * External metadata format (for JSON files)
 */
export const ExternalMetadataSchema = z.object({
  version: z.string(),
  lastUpdated: z.string(),
  
  // Component updates
  components: z.record(z.object({
    metadata: ComponentMetadataSchema.partial().optional(),
    designTokens: DesignTokensSchema.optional(),
    variants: ComponentVariantsSchema.optional(),
    aiHints: AIHintsSchema.optional(),
    custom: z.record(z.any()).optional()
  })).optional(),
  
  // Industry mappings
  industries: z.record(IndustryMappingSchema).optional(),
  
  // Global design system
  designSystem: DesignTokensSchema.optional(),
  
  // New components definitions
  newComponents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    componentPath: z.string(), // Path to React component file
    metadata: ComponentMetadataSchema,
    defaultProps: z.record(z.any()),
    propsSchema: z.any() // Zod schema as JSON
  })).optional(),
  
  // Registry configuration updates
  config: z.record(z.any()).optional()
});

// Type exports
export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>;
export type AccessibilityMetrics = z.infer<typeof AccessibilityMetricsSchema>;
export type CompatibilityInfo = z.infer<typeof CompatibilityInfoSchema>;
export type UsageStatistics = z.infer<typeof UsageStatisticsSchema>;
export type ComponentVariants = z.infer<typeof ComponentVariantsSchema>;
export type AIHints = z.infer<typeof AIHintsSchema>;
export type ComponentMetadata = z.infer<typeof ComponentMetadataSchema>;
export type IndustryMapping = z.infer<typeof IndustryMappingSchema>;
export type ExternalMetadata = z.infer<typeof ExternalMetadataSchema>;