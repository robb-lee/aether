/**
 * Aether Component Registry
 * Extensible component system for AI-powered website generation
 */

// Core registry
export { ComponentRegistry, getRegistry, initializeRegistry, createComponent } from './registry';

// Types
export type {
  ComponentDefinition,
  ComponentMetadata,
  ComponentCategory,
  SearchCriteria,
  ValidationResult,
  PerformanceMetrics,
  AccessibilityMetrics,
  CompatibilityInfo,
  UsageStatistics,
  ComponentVariants
} from './types/component';

export type {
  DesignTokens,
  DesignSystem,
  Theme,
  ColorTokens,
  TypographyTokens,
  SpacingTokens
} from './types/design-tokens';

export type {
  ExternalMetadata,
  IndustryMapping,
  AIHints
} from './types/metadata';

// Metadata loader
export { MetadataLoader, DEFAULT_METADATA_PATHS } from './loaders/json-loader';

// Components
export { 
  CORE_COMPONENTS, 
  COMPONENT_MAP,
  HeroCentered,
  HeroSplit,
  HeroVideoBg,
  FeaturesGrid
} from './components';

// Schemas
export {
  HeroCenteredPropsSchema,
  HeroSplitPropsSchema,
  HeroVideoBgPropsSchema,
  FeaturesGridPropsSchema
} from './components';

// Initialize default registry
import { ComponentRegistry } from './registry';
import { CORE_COMPONENTS } from './components';

let defaultRegistry: ComponentRegistry | null = null;

/**
 * Get initialized default registry with core components
 */
export async function getDefaultRegistry(): Promise<ComponentRegistry> {
  if (!defaultRegistry) {
    defaultRegistry = new ComponentRegistry({
      cacheEnabled: true,
      cacheTTL: 30 // 30 minutes
    });
    
    // Register core components
    defaultRegistry.registerBatch(CORE_COMPONENTS);
    
    // Try to load external metadata if available
    try {
      await defaultRegistry.loadMetadataFromJSON('./metadata/component-meta.json');
      console.log('✅ Loaded external metadata for component registry');
    } catch (error) {
      console.log('ℹ️ No external metadata found, using default component metadata');
    }
    
    console.log(`🎯 Component Registry initialized with ${CORE_COMPONENTS.length} core components`);
  }
  
  return defaultRegistry;
}

/**
 * Helper function to search components with smart defaults
 */
export async function searchComponents(criteria: {
  industry?: string;
  style?: string;
  category?: string;
  keywords?: string[];
  performance?: 'high' | 'balanced' | 'basic';
}) {
  const registry = await getDefaultRegistry();
  
  const searchCriteria = {
    category: criteria.category as any,
    industry: criteria.industry,
    keywords: criteria.keywords,
    performance: criteria.performance ? {
      minLighthouse: criteria.performance === 'high' ? 90 : criteria.performance === 'balanced' ? 70 : 50
    } : undefined
  };
  
  return registry.search(searchCriteria);
}

/**
 * Helper function to get recommended components for a specific use case
 */
export async function getRecommendedComponents(context: {
  industry?: string;
  style?: string;
  pageType?: string;
  priority?: 'conversion' | 'performance' | 'accessibility';
}) {
  const registry = await getDefaultRegistry();
  
  return registry.getRecommendedComponents({
    industry: context.industry,
    style: context.style,
    performance: context.priority === 'performance' ? 'high' : 'balanced',
    accessibility: context.priority === 'accessibility' ? 'full' : 'enhanced'
  });
}

/**
 * Quick component selector for AI integration
 * Returns array of component IDs and suggested props
 */
export async function selectComponentsForPrompt(prompt: string): Promise<{
  components: Array<{
    componentId: string;
    category: string;
    suggestedProps: Record<string, any>;
    confidence: number;
  }>;
  totalConfidence: number;
}> {
  const registry = await getDefaultRegistry();
  
  // Simple keyword matching for now
  // This will be enhanced in Task 2.8 with AI selection
  const keywords = prompt.toLowerCase().split(' ');
  
  const matches = [];
  
  // Hero section (always needed)
  if (keywords.some(k => ['saas', 'software', 'platform', 'tech'].includes(k))) {
    matches.push({
      componentId: 'hero-split',
      category: 'hero',
      suggestedProps: {
        layout: 'left-content',
        style: 'modern',
        showDemo: true
      },
      confidence: 0.9
    });
  } else if (keywords.some(k => ['portfolio', 'creative', 'artist', 'showcase'].includes(k))) {
    matches.push({
      componentId: 'hero-centered',
      category: 'hero',
      suggestedProps: {
        variant: 'center',
        style: 'minimal'
      },
      confidence: 0.85
    });
  } else {
    matches.push({
      componentId: 'hero-centered',
      category: 'hero',
      suggestedProps: {
        variant: 'center',
        style: 'minimal'
      },
      confidence: 0.7
    });
  }
  
  // Features section
  if (keywords.some(k => ['features', 'benefits', 'services'].includes(k))) {
    matches.push({
      componentId: 'features-grid',
      category: 'features',
      suggestedProps: {
        layout: '3-col',
        style: 'cards'
      },
      confidence: 0.8
    });
  }
  
  const totalConfidence = matches.reduce((sum, m) => sum + m.confidence, 0) / matches.length;
  
  return {
    components: matches,
    totalConfidence
  };
}