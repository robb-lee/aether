/**
 * Zod Schemas for Site Structure Validation
 * 
 * Ensures AI-generated content matches expected format
 * Based on prompt.md structure specifications
 */

import { z } from 'zod';

/**
 * Base component props schema
 */
export const ComponentPropsSchema = z.record(z.any()).default({});

/**
 * Style configuration schema
 */
export const StyleConfigSchema = z.object({
  className: z.string().optional(),
  style: z.record(z.string()).optional(),
  responsive: z.object({
    mobile: z.record(z.string()).optional(),
    tablet: z.record(z.string()).optional(),
    desktop: z.record(z.string()).optional()
  }).optional()
}).optional();

/**
 * Component node schema - recursive structure
 */
export const ComponentNodeSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  type: z.string(),
  props: ComponentPropsSchema,
  children: z.array(ComponentNodeSchema).optional(),
  content: z.object({
    text: z.string().optional(),
    html: z.string().optional(),
    markdown: z.string().optional()
  }).optional(),
  styles: StyleConfigSchema,
  metadata: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional()
  }).optional()
}));

/**
 * Component tree schema - full site structure
 */
export const ComponentTreeSchema = z.object({
  root: ComponentNodeSchema,
  version: z.string().optional(),
  metadata: z.object({
    generatedAt: z.string().datetime(),
    model: z.string(),
    promptVersion: z.string().optional(),
    generationTime: z.number().optional(), // milliseconds
    tokenCount: z.number().optional()
  })
});

/**
 * Context extraction schema
 */
export const ContextExtractionSchema = z.object({
  industry: z.string(),
  audience: z.string(),
  goals: z.array(z.string()),
  style: z.string(),
  features: z.array(z.string()),
  tone: z.string().optional(),
  competitors: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional()
});

/**
 * SEO metadata schema
 */
export const SEOMetadataSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(160),
  keywords: z.array(z.string()),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
  robots: z.string().optional(),
  structuredData: z.object({}).optional() // JSON-LD
});

/**
 * Page structure schema
 */
export const PageStructureSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  template: z.string().optional(),
  components: ComponentTreeSchema,
  seo: SEOMetadataSchema,
  settings: z.object({
    isPublic: z.boolean().default(true),
    requiresAuth: z.boolean().default(false),
    layout: z.enum(['full', 'sidebar', 'centered']).default('full')
  })
});

/**
 * Site structure schema - complete website
 */
export const SiteStructureSchema = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.string().optional(),
  pages: z.array(PageStructureSchema),
  globalStyles: z.object({
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      background: z.string(),
      text: z.string(),
      muted: z.string().optional(),
      border: z.string().optional()
    }),
    typography: z.object({
      headingFont: z.string(),
      bodyFont: z.string(),
      monoFont: z.string().optional(),
      scale: z.number().optional()
    }),
    spacing: z.object({
      base: z.string(),
      scale: z.array(z.string()).optional()
    }),
    borderRadius: z.string(),
    shadows: z.enum(['none', 'subtle', 'medium', 'strong'])
  }),
  navigation: z.object({
    main: z.array(z.object({
      label: z.string(),
      path: z.string(),
      icon: z.string().optional(),
      children: z.array(z.object({
        label: z.string(),
        path: z.string()
      })).optional()
    })),
    footer: z.array(z.object({
      label: z.string(),
      path: z.string()
    })).optional()
  }),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    version: z.string(),
    template: z.string().optional(),
    industry: z.string().optional()
  })
});

/**
 * Generation progress schema
 */
export const GenerationProgressSchema = z.object({
  stage: z.enum([
    'initializing',
    'context_analysis',
    'structure_generation',
    'content_generation',
    'design_system',
    'optimization',
    'validation',
    'complete'
  ]),
  progress: z.number().min(0).max(100),
  currentTask: z.string(),
  message: z.string().optional(),
  partialResult: z.any().optional(),
  estimatedTimeRemaining: z.number().optional(), // seconds
  errors: z.array(z.string()).optional()
});

/**
 * Validation result schema
 */
export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  score: z.number().min(0).max(100),
  issues: z.array(z.object({
    type: z.enum(['error', 'warning', 'info']),
    component: z.string().optional(),
    path: z.string().optional(),
    message: z.string(),
    autoFixed: z.boolean().default(false),
    suggestion: z.string().optional()
  })),
  fixedStructure: z.any().optional(),
  metadata: z.object({
    validatedAt: z.string().datetime(),
    validationTime: z.number(), // milliseconds
    rulesApplied: z.array(z.string())
  })
});

/**
 * Generation request schema
 */
export const GenerationRequestSchema = z.object({
  prompt: z.string().min(1),
  industry: z.string().optional(),
  style: z.string().optional(),
  features: z.array(z.string()).optional(),
  template: z.string().optional(),
  options: z.object({
    streaming: z.boolean().default(true),
    validateOutput: z.boolean().default(true),
    optimizePerformance: z.boolean().default(true),
    generateImages: z.boolean().default(false),
    maxTokens: z.number().optional(),
    temperature: z.number().min(0).max(2).optional()
  }).optional()
});

/**
 * Generation response schema
 */
export const GenerationResponseSchema = z.object({
  success: z.boolean(),
  siteStructure: SiteStructureSchema.optional(),
  validation: ValidationResultSchema.optional(),
  metadata: z.object({
    generationId: z.string(),
    model: z.string(),
    totalTime: z.number(), // milliseconds
    totalCost: z.number(), // dollars
    tokenUsage: z.object({
      prompt: z.number(),
      completion: z.number(),
      total: z.number()
    }),
    fallbackUsed: z.boolean(),
    attemptedModels: z.array(z.string())
  }),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  }).optional()
});

/**
 * Type exports for TypeScript
 */
export type ComponentNode = z.infer<typeof ComponentNodeSchema>;
export type ComponentTree = z.infer<typeof ComponentTreeSchema>;
export type ContextExtraction = z.infer<typeof ContextExtractionSchema>;
export type SEOMetadata = z.infer<typeof SEOMetadataSchema>;
export type PageStructure = z.infer<typeof PageStructureSchema>;
export type SiteStructure = z.infer<typeof SiteStructureSchema>;
export type GenerationProgress = z.infer<typeof GenerationProgressSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export type GenerationResponse = z.infer<typeof GenerationResponseSchema>;

/**
 * Validation helper functions
 */
export function validateSiteStructure(data: unknown): SiteStructure {
  return SiteStructureSchema.parse(data);
}

export function validateComponentTree(data: unknown): ComponentTree {
  return ComponentTreeSchema.parse(data);
}

export function validateGenerationRequest(data: unknown): GenerationRequest {
  return GenerationRequestSchema.parse(data);
}

export function isValidSiteStructure(data: unknown): boolean {
  try {
    SiteStructureSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe parsing with error details
 */
export function safeParseSiteStructure(data: unknown): {
  success: boolean;
  data?: SiteStructure;
  error?: z.ZodError;
} {
  const result = SiteStructureSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}