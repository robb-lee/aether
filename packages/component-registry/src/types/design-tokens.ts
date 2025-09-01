import { z } from 'zod';

/**
 * Design token schemas for validation
 */

export const ColorTokenSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  surface: z.string().optional(),
  text: z.string().optional(),
  muted: z.string().optional(),
  success: z.string().optional(),
  warning: z.string().optional(),
  error: z.string().optional(),
  info: z.string().optional()
});

export const TypographyTokenSchema = z.object({
  headingFont: z.string().optional(),
  bodyFont: z.string().optional(),
  monoFont: z.string().optional(),
  sizes: z.record(z.string()).optional(),
  weights: z.record(z.number()).optional(),
  lineHeights: z.record(z.number()).optional(),
  letterSpacing: z.record(z.string()).optional()
});

export const SpacingTokenSchema = z.object({
  base: z.string().optional(),
  scale: z.array(z.number()).optional(),
  containerPadding: z.string().optional(),
  sectionGap: z.string().optional(),
  componentGap: z.string().optional(),
  gridGap: z.string().optional()
});

export const BorderRadiusTokenSchema = z.object({
  none: z.string().optional(),
  sm: z.string().optional(),
  md: z.string().optional(),
  lg: z.string().optional(),
  xl: z.string().optional(),
  full: z.string().optional()
});

export const ShadowTokenSchema = z.object({
  none: z.string().optional(),
  sm: z.string().optional(),
  md: z.string().optional(),
  lg: z.string().optional(),
  xl: z.string().optional(),
  inner: z.string().optional()
});

export const AnimationTokenSchema = z.object({
  duration: z.record(z.string()).optional(),
  easing: z.record(z.string()).optional(),
  keyframes: z.record(z.any()).optional(),
  transitions: z.record(z.string()).optional()
});

export const DesignTokensSchema = z.object({
  colors: ColorTokenSchema.optional(),
  typography: TypographyTokenSchema.optional(),
  spacing: SpacingTokenSchema.optional(),
  borderRadius: BorderRadiusTokenSchema.optional(),
  shadows: ShadowTokenSchema.optional(),
  animations: AnimationTokenSchema.optional(),
  
  // Custom tokens (extensible)
  custom: z.record(z.any()).optional()
});

/**
 * Theme definition for component styling
 */
export const ThemeSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  tokens: DesignTokensSchema,
  
  // Industry-specific optimizations
  industries: z.array(z.string()).optional(),
  
  // Usage context
  useCases: z.array(z.string()).optional(),
  
  // Accessibility considerations
  accessibility: z.object({
    highContrast: z.boolean().optional(),
    reducedMotion: z.boolean().optional(),
    colorBlindFriendly: z.boolean().optional()
  }).optional(),
  
  // Performance impact
  performance: z.object({
    bundleImpact: z.number().optional(), // KB
    renderImpact: z.number().optional()  // ms
  }).optional()
});

/**
 * Design system definition
 */
export const DesignSystemSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  
  // Base design tokens
  tokens: DesignTokensSchema,
  
  // Available themes
  themes: z.array(ThemeSchema),
  
  // Component customizations
  componentCustomizations: z.record(z.object({
    defaultVariant: z.string().optional(),
    allowedVariants: z.array(z.string()).optional(),
    customProps: z.record(z.any()).optional(),
    styleOverrides: z.record(z.any()).optional()
  })).optional(),
  
  // Industry-specific configurations
  industryConfigs: z.record(z.object({
    preferredTheme: z.string(),
    recommendedComponents: z.array(z.string()),
    avoidComponents: z.array(z.string()).optional(),
    customizations: z.record(z.any()).optional()
  })).optional(),
  
  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.string().optional()
});

// Type exports
export type ColorTokens = z.infer<typeof ColorTokenSchema>;
export type TypographyTokens = z.infer<typeof TypographyTokenSchema>;
export type SpacingTokens = z.infer<typeof SpacingTokenSchema>;
export type BorderRadiusTokens = z.infer<typeof BorderRadiusTokenSchema>;
export type ShadowTokens = z.infer<typeof ShadowTokenSchema>;
export type AnimationTokens = z.infer<typeof AnimationTokenSchema>;
export type DesignTokens = z.infer<typeof DesignTokensSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type DesignSystem = z.infer<typeof DesignSystemSchema>;