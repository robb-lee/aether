/**
 * Component Tree Types for AI-generated site structures
 * 
 * These types define the hierarchical component structure
 * that gets built from AI component selections
 */

import { z } from 'zod';
import { ComponentDefinition } from '../../component-registry/src/types/component';

/**
 * Responsive breakpoint configuration
 */
export interface ResponsiveConfig {
  mobile?: Record<string, any>;
  tablet?: Record<string, any>;
  desktop?: Record<string, any>;
  wide?: Record<string, any>;
}

/**
 * Layout information for component positioning
 */
export interface LayoutInfo {
  order?: number;
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  width?: string;
  height?: string;
  margin?: string;
  padding?: string;
  gap?: string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  gridTemplate?: {
    columns?: string;
    rows?: string;
    areas?: string;
  };
}

/**
 * Single component node in the tree
 */
export interface ComponentNode {
  id: string;
  componentId: string;  // Reference to component in registry
  name: string;
  props: Record<string, any>;
  children: ComponentNode[];
  parent?: string;  // Parent node ID
  layout?: LayoutInfo;
  responsive?: ResponsiveConfig;
  metadata: {
    depth: number;
    index: number;  // Position among siblings
    category: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Complete component tree structure
 */
export interface ComponentTree {
  id: string;
  name: string;
  root: ComponentNode;
  metadata: {
    totalNodes: number;
    maxDepth: number;
    categories: string[];
    generatedFrom: string;  // Original user prompt
    version: string;
    createdAt: Date;
    updatedAt: Date;
  };
  designTokens?: {
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    spacing?: Record<string, string>;
    borderRadius?: Record<string, string>;
  };
}

/**
 * Zod schema for component node validation
 */
export const ComponentNodeSchema: z.ZodType<any> = z.object({
  id: z.string(),
  componentId: z.string(),
  name: z.string(),
  props: z.record(z.any()),
  children: z.array(z.lazy(() => ComponentNodeSchema)),
  parent: z.string().optional(),
  layout: z.object({
    order: z.number().optional(),
    display: z.enum(['block', 'flex', 'grid', 'inline', 'inline-block']).optional(),
    position: z.enum(['static', 'relative', 'absolute', 'fixed', 'sticky']).optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    margin: z.string().optional(),
    padding: z.string().optional(),
    gap: z.string().optional(),
    flexDirection: z.enum(['row', 'column', 'row-reverse', 'column-reverse']).optional(),
    justifyContent: z.enum(['start', 'end', 'center', 'between', 'around', 'evenly']).optional(),
    alignItems: z.enum(['start', 'end', 'center', 'stretch', 'baseline']).optional(),
    gridTemplate: z.object({
      columns: z.string().optional(),
      rows: z.string().optional(),
      areas: z.string().optional(),
    }).optional(),
  }).optional(),
  responsive: z.object({
    mobile: z.record(z.any()).optional(),
    tablet: z.record(z.any()).optional(),
    desktop: z.record(z.any()).optional(),
    wide: z.record(z.any()).optional(),
  }).optional(),
  metadata: z.object({
    depth: z.number(),
    index: z.number(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

/**
 * Zod schema for complete component tree validation
 */
export const ComponentTreeSchema = z.object({
  id: z.string(),
  name: z.string(),
  root: ComponentNodeSchema,
  metadata: z.object({
    totalNodes: z.number(),
    maxDepth: z.number(),
    categories: z.array(z.string()),
    generatedFrom: z.string(),
    version: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  designTokens: z.object({
    colors: z.record(z.string()).optional(),
    typography: z.record(z.string()).optional(),
    spacing: z.record(z.string()).optional(),
    borderRadius: z.record(z.string()).optional(),
  }).optional(),
});

/**
 * Type for tree building options
 */
export interface TreeBuildOptions {
  generateIds?: boolean;
  validateStructure?: boolean;
  applyLayoutHints?: boolean;
  includeResponsive?: boolean;
  designTokens?: Record<string, any>;
  maxDepth?: number;
  allowedCategories?: string[];
}

/**
 * Result of tree building operation
 */
export interface TreeBuildResult {
  tree: ComponentTree;
  warnings: string[];
  stats: {
    nodesCreated: number;
    maxDepth: number;
    categories: string[];
    buildTime: number;
  };
}

export type { ComponentDefinition };