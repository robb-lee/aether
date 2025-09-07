/**
 * Client-side Component Registry
 * Browser-safe version without server-side dependencies
 */
import { z } from 'zod';
import React from 'react';
import { 
  ComponentDefinition, 
  ComponentMetadata, 
  SearchCriteria, 
  ValidationResult,
  ValidationIssue,
  ComponentCategory
} from './types/component';
import { 
  IndustryMapping,
  ComponentMetadataSchema
} from './types/metadata';

/**
 * Client-safe Component Registry
 * Excludes server-side file operations and metadata loaders
 */
export class ClientComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map();
  private industryMappings: Map<string, IndustryMapping> = new Map();
  private initialized: boolean = false;

  constructor() {
    // Client-side initialization only
  }

  /**
   * Initialize registry with unified components (client-side only)
   */
  async initialize(): Promise<void> {
    try {
      // Load unified components (single source of truth for all components)
      const { UNIFIED_COMPONENTS } = await import('./unified-components.js');
      this.registerBatch(UNIFIED_COMPONENTS);
      console.log(`📦 Client Registry loaded ${UNIFIED_COMPONENTS.length} unified components`);
      
      this.initialized = true;
      console.log(`✅ Client Component Registry initialized with ${this.components.size} total components`);
    } catch (error) {
      console.error('❌ Failed to initialize Client Component Registry:', error);
      // Initialize with empty registry as fallback
      this.initialized = true;
      console.log('⚠️ Client Component Registry initialized with empty state');
    }
  }

  /**
   * Register a component in the registry
   */
  register(component: ComponentDefinition): void {
    // Basic validation for client-side
    if (!component.id || !component.name || !component.category) {
      throw new Error('Component must have id, name, and category');
    }
    
    if (this.components.has(component.id)) {
      console.warn(`Component with id ${component.id} already exists, overwriting`);
    }
    
    // Store component
    this.components.set(component.id, component);
    console.log(`📦 Registered component: ${component.id} (${component.category})`);
  }

  /**
   * Register multiple components
   */
  registerBatch(components: ComponentDefinition[]): void {
    for (const component of components) {
      this.register(component);
    }
  }

  /**
   * Get component by ID
   */
  getById(componentId: string): ComponentDefinition | undefined {
    return this.components.get(componentId);
  }

  /**
   * Get components by category
   */
  getByCategory(category: ComponentCategory): ComponentDefinition[] {
    return Array.from(this.components.values())
      .filter(component => component.category === category);
  }

  /**
   * Search components with flexible criteria
   */
  search(criteria: SearchCriteria): ComponentDefinition[] {
    const components = Array.from(this.components.values());
    
    return components.filter(component => {
      // Category filter
      if (criteria.category) {
        const categories = Array.isArray(criteria.category) 
          ? criteria.category 
          : [criteria.category];
        if (!categories.includes(component.category)) return false;
      }
      
      // Tags filter
      if (criteria.tags && criteria.tags.length > 0) {
        const hasMatchingTag = criteria.tags.some(tag => 
          component.metadata.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }
      
      // Industry filter
      if (criteria.industry) {
        const industries = component.metadata.aiHints?.industries || [];
        if (!industries.includes(criteria.industry)) return false;
      }
      
      // Design Kit filter
      if (criteria.designKit) {
        const compatibleKits = component.metadata.designKit?.compatibleKits || [];
        if (!compatibleKits.includes(criteria.designKit)) return false;
      }
      
      // Performance filter
      if (criteria.performance) {
        const perf = component.metadata.performance;
        if (criteria.performance.minLighthouse && perf.lighthouse < criteria.performance.minLighthouse) return false;
        if (criteria.performance.maxBundleSize && perf.bundleSize > criteria.performance.maxBundleSize) return false;
        if (criteria.performance.maxRenderTime && perf.renderTime > criteria.performance.maxRenderTime) return false;
      }
      
      // Accessibility filter
      if (criteria.accessibility) {
        const acc = component.metadata.accessibility;
        if (criteria.accessibility.minWcagLevel) {
          const levels = ['A', 'AA', 'AAA'];
          const minIndex = levels.indexOf(criteria.accessibility.minWcagLevel);
          const componentIndex = levels.indexOf(acc.wcagLevel);
          if (componentIndex < minIndex) return false;
        }
        if (criteria.accessibility.requireAriaCompliant && !acc.ariaCompliant) return false;
      }
      
      // Keywords filter
      if (criteria.keywords && criteria.keywords.length > 0) {
        const searchableText = [
          component.name,
          component.metadata.description,
          ...component.metadata.tags,
          ...(component.metadata.aiHints?.keywords || [])
        ].join(' ').toLowerCase();
        
        const hasMatchingKeyword = criteria.keywords.some(keyword => 
          searchableText.includes(keyword.toLowerCase())
        );
        if (!hasMatchingKeyword) return false;
      }
      
      // Exclude filter
      if (criteria.excludeComponents && criteria.excludeComponents.includes(component.id)) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Get recommended components for industry/context
   */
  getRecommendedComponents(context: {
    industry?: string;
    style?: string;
    performance?: 'high' | 'balanced' | 'basic';
    accessibility?: 'basic' | 'enhanced' | 'full';
  }): ComponentDefinition[] {
    // Check industry mappings first
    if (context.industry) {
      const mapping = this.industryMappings.get(context.industry);
      if (mapping) {
        const recommended = mapping.recommended
          .map(id => this.getById(id))
          .filter(Boolean) as ComponentDefinition[];
        
        if (recommended.length > 0) {
          return this.sortByRelevance(recommended, context);
        }
      }
    }
    
    // Fallback to search-based recommendations
    const searchCriteria: SearchCriteria = {
      industry: context.industry,
      performance: this.getPerformanceCriteria(context.performance),
      accessibility: this.getAccessibilityCriteria(context.accessibility)
    };
    
    const results = this.search(searchCriteria);
    return this.sortByRelevance(results, context);
  }

  /**
   * Get all registered components
   */
  getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  /**
   * Get all categories
   */
  getAllCategories(): ComponentCategory[] {
    const categories = new Set<ComponentCategory>();
    for (const component of this.components.values()) {
      categories.add(component.category);
    }
    return Array.from(categories);
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalComponents: number;
    categoryCounts: Record<ComponentCategory, number>;
    performanceDistribution: Record<string, number>;
    accessibilityDistribution: Record<string, number>;
    industryMappings: number;
  } {
    const components = this.getAllComponents();
    
    const categoryCounts = {} as Record<ComponentCategory, number>;
    const performanceDistribution = { high: 0, medium: 0, low: 0 };
    const accessibilityDistribution = { A: 0, AA: 0, AAA: 0 };
    
    for (const component of components) {
      // Category counts
      categoryCounts[component.category] = (categoryCounts[component.category] || 0) + 1;
      
      // Performance distribution
      const lighthouse = component.metadata.performance.lighthouse;
      if (lighthouse >= 90) performanceDistribution.high++;
      else if (lighthouse >= 70) performanceDistribution.medium++;
      else performanceDistribution.low++;
      
      // Accessibility distribution
      accessibilityDistribution[component.metadata.accessibility.wcagLevel]++;
    }
    
    return {
      totalComponents: components.length,
      categoryCounts,
      performanceDistribution,
      accessibilityDistribution,
      industryMappings: this.industryMappings.size
    };
  }

  // Private helper methods
  
  private sortByRelevance(
    components: ComponentDefinition[], 
    context: any
  ): ComponentDefinition[] {
    return components.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      // Performance preference
      if (context.performance === 'high') {
        scoreA += a.metadata.performance.lighthouse / 100;
        scoreB += b.metadata.performance.lighthouse / 100;
      }
      
      // Usage success rate
      scoreA += a.metadata.usage.successRate;
      scoreB += b.metadata.usage.successRate;
      
      // Conversion rate (if available)
      scoreA += a.metadata.usage.conversionRate || 0;
      scoreB += b.metadata.usage.conversionRate || 0;
      
      return scoreB - scoreA;
    });
  }

  private getPerformanceCriteria(level?: string) {
    switch (level) {
      case 'high':
        return { minLighthouse: 90, maxBundleSize: 50, maxRenderTime: 100 };
      case 'balanced':
        return { minLighthouse: 70, maxBundleSize: 100, maxRenderTime: 200 };
      case 'basic':
        return { minLighthouse: 50, maxBundleSize: 200, maxRenderTime: 500 };
      default:
        return undefined;
    }
  }

  private getAccessibilityCriteria(level?: string) {
    switch (level) {
      case 'full':
        return { minWcagLevel: 'AAA' as const, requireAriaCompliant: true };
      case 'enhanced':
        return { minWcagLevel: 'AA' as const, requireAriaCompliant: true };
      case 'basic':
        return { minWcagLevel: 'A' as const, requireAriaCompliant: false };
      default:
        return undefined;
    }
  }
}

/**
 * Singleton instance for global client registry access
 */
let globalClientRegistry: ClientComponentRegistry | null = null;

/**
 * Get or create global client registry instance
 */
export function getClientRegistry(): ClientComponentRegistry {
  if (!globalClientRegistry) {
    globalClientRegistry = new ClientComponentRegistry();
  }
  return globalClientRegistry;
}

/**
 * Initialize global client registry
 */
export async function initializeClientRegistry(): Promise<ClientComponentRegistry> {
  const registry = getClientRegistry();
  await registry.initialize();
  return registry;
}

/**
 * Quick component selector for AI integration (client-side)
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
  const registry = getClientRegistry();
  await registry.initialize();
  
  // Simple keyword matching for now
  const keywords = prompt.toLowerCase().split(' ');
  
  const matches = [];
  
  // Header section (optional but recommended)
  if (keywords.some(k => ['navigation', 'menu', 'header', 'nav'].includes(k))) {
    matches.push({
      componentId: 'header-simple',
      category: 'header',
      suggestedProps: {
        logoText: 'Company',
        style: 'minimal',
        transparent: false
      },
      confidence: 0.85
    });
  }
  
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
  
  // CTA section
  if (keywords.some(k => ['signup', 'register', 'join', 'start', 'action', 'cta'].includes(k))) {
    matches.push({
      componentId: 'cta-simple',
      category: 'cta',
      suggestedProps: {
        title: 'Ready to Get Started?',
        ctaText: 'Get Started',
        layout: 'center',
        style: 'solid'
      },
      confidence: 0.75
    });
  }
  
  const totalConfidence = matches.reduce((sum, m) => sum + m.confidence, 0) / matches.length;
  
  return {
    components: matches,
    totalConfidence
  };
}