import React from 'react';
import { z } from 'zod';

/**
 * Core component categories
 */
export type ComponentCategory = 
  | 'hero'
  | 'features'
  | 'cta'
  | 'header'
  | 'footer'
  | 'pricing'
  | 'testimonials'
  | 'contact'
  | 'navigation'
  | 'content'
  | 'layout';

/**
 * Performance metrics for components
 */
export interface PerformanceMetrics {
  lighthouse: number;      // 0-100 Lighthouse score
  bundleSize: number;      // KB
  renderTime: number;      // ms
  cls: number;            // Cumulative Layout Shift
  fcp: number;            // First Contentful Paint (seconds)
  lcp: number;            // Largest Contentful Paint (seconds)
}

/**
 * Accessibility metrics
 */
export interface AccessibilityMetrics {
  wcagLevel: 'A' | 'AA' | 'AAA';
  ariaCompliant: boolean;
  keyboardNavigable: boolean;
  screenReaderOptimized: boolean;
  colorContrast: number;  // ratio
  focusManagement: boolean;
}

/**
 * Compatibility information
 */
export interface CompatibilityInfo {
  mobile: boolean;
  responsive: boolean;
  browsers: string[];
  frameworks: string[];  // ['next', 'react', 'gatsby']
  serverComponents: boolean;
}

/**
 * Component usage statistics
 */
export interface UsageStatistics {
  totalUsage: number;
  successRate: number;        // 0-1
  conversionRate?: number;    // 0-1
  industries: string[];       // Most used industries
  popularCombinations: string[]; // Often used with these components
  averageProps: Record<string, any>; // Most common prop values
}

/**
 * Design tokens for theming
 */
export interface DesignTokens {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    muted?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    sizes?: Record<string, string>;
    weights?: Record<string, number>;
    lineHeights?: Record<string, number>;
  };
  spacing?: {
    base?: string;
    scale?: number[];
    containerPadding?: string;
    sectionGap?: string;
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  animations?: {
    duration?: Record<string, string>;
    easing?: Record<string, string>;
    keyframes?: Record<string, any>;
  };
}

/**
 * Component variants and customization options
 */
export interface ComponentVariants {
  layout?: string[];        // ['left', 'center', 'right']
  style?: string[];         // ['minimal', 'rich', 'modern']
  colorScheme?: string[];   // ['light', 'dark', 'auto']
  size?: string[];          // ['sm', 'md', 'lg', 'xl']
  animation?: string[];     // ['none', 'fade', 'slide', 'bounce']
}

/**
 * Extended component metadata (extensible via JSON)
 */
export interface ComponentMetadata {
  version: string;
  author?: string;
  description: string;
  tags: string[];
  category: ComponentCategory;
  
  // Core metrics
  performance: PerformanceMetrics;
  accessibility: AccessibilityMetrics;
  compatibility: CompatibilityInfo;
  usage: UsageStatistics;
  
  // Design system
  designTokens?: DesignTokens;
  variants?: ComponentVariants;
  
  // AI selection hints
  aiHints?: {
    industries: string[];
    useCases: string[];
    keywords: string[];
    avoidWhen: string[];
  };
  
  // Extensible custom fields (loaded from JSON)
  custom?: Record<string, any>;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Main component definition
 */
export interface ComponentDefinition {
  id: string;
  name: string;
  category: ComponentCategory;
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
  propsSchema: z.ZodSchema;
  metadata: ComponentMetadata;
  
  // Preview and documentation
  preview?: {
    thumbnail?: string;
    description?: string;
    demoProps?: Record<string, any>;
  };
}

/**
 * Search criteria for component discovery
 */
export interface SearchCriteria {
  category?: ComponentCategory | ComponentCategory[];
  tags?: string[];
  industry?: string;
  style?: string;
  performance?: {
    minLighthouse?: number;
    maxBundleSize?: number;
    maxRenderTime?: number;
  };
  accessibility?: {
    minWcagLevel?: 'A' | 'AA' | 'AAA';
    requireAriaCompliant?: boolean;
  };
  keywords?: string[];
  excludeComponents?: string[];
}

/**
 * Component combination validation result
 */
export interface ValidationResult {
  valid: boolean;
  score: number;          // 0-1 compatibility score
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  componentId: string;
  message: string;
  suggestion?: string;
}

/**
 * Industry-specific mappings (loaded from JSON)
 */
export interface IndustryMapping {
  industry: string;
  recommended: string[];
  avoid: string[];
  style: string;
  designTokens: DesignTokens;
  customizations: Record<string, any>;
}

/**
 * Registry configuration
 */
export interface RegistryConfig {
  metadataPath?: string;
  designTokensPath?: string;
  industryMappingsPath?: string;
  autoLoadMetadata?: boolean;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}