import { z } from 'zod';

export interface TemplateCustomization {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  spacing?: {
    padding?: string;
    margin?: string;
  };
  borderRadius?: string;
}

export interface AIHints {
  contentTone: string;
  targetAudience: string;
  keyMessages: string[];
  preferredSections: string[];
  seoKeywords: string[];
  callToActionStyle: 'urgent' | 'friendly' | 'professional' | 'creative';
}

export interface TemplateSection {
  componentId: string;
  defaultProps: Record<string, any>;
  aiHints: Partial<AIHints>;
  required: boolean;
  order: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  industry: 'saas' | 'portfolio' | 'ecommerce' | 'blog' | 'restaurant';
  thumbnail?: string;
  sections: TemplateSection[];
  defaultCustomization: TemplateCustomization;
  aiHints: AIHints;
  tags: string[];
}

export interface TemplateMatch {
  template: Template;
  confidence: number;
  reasons: string[];
}

export const TemplateCustomizationSchema = z.object({
  colors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
  }).optional(),
  fonts: z.object({
    heading: z.string().optional(),
    body: z.string().optional(),
  }).optional(),
  spacing: z.object({
    padding: z.string().optional(),
    margin: z.string().optional(),
  }).optional(),
  borderRadius: z.string().optional(),
});

export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  industry: z.enum(['saas', 'portfolio', 'ecommerce', 'blog', 'restaurant']),
  thumbnail: z.string().optional(),
  sections: z.array(z.object({
    componentId: z.string(),
    defaultProps: z.record(z.any()),
    aiHints: z.record(z.any()),
    required: z.boolean(),
    order: z.number(),
  })),
  defaultCustomization: TemplateCustomizationSchema,
  aiHints: z.object({
    contentTone: z.string(),
    targetAudience: z.string(),
    keyMessages: z.array(z.string()),
    preferredSections: z.array(z.string()),
    seoKeywords: z.array(z.string()),
    callToActionStyle: z.enum(['urgent', 'friendly', 'professional', 'creative']),
  }),
  tags: z.array(z.string()),
});

export type TemplateInput = z.infer<typeof TemplateSchema>;