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
  ExternalMetadata,
  ComponentMetadataSchema
} from './types/metadata';
import { DesignTokens, DesignSystem } from './types/design-tokens';
import { MetadataLoader, DEFAULT_METADATA_PATHS } from './loaders/json-loader';

/**
 * Extensible Component Registry with JSON metadata support
 * Supports dynamic loading of components, metadata, and design systems
 */
export class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map();
  private industryMappings: Map<string, IndustryMapping> = new Map();
  private designSystem: DesignSystem | null = null;
  private metadataLoader: MetadataLoader;
  private initialized: boolean = false;

  constructor(options: {
    metadataPath?: string;
    autoLoad?: boolean;
    cacheEnabled?: boolean;
    cacheTTL?: number;
  } = {}) {
    this.metadataLoader = new MetadataLoader({
      cacheEnabled: options.cacheEnabled,
      cacheTTL: options.cacheTTL
    });

    if (options.autoLoad) {
      this.initialize(options.metadataPath);
    }
  }

  /**
   * Initialize registry with default or custom metadata
   */
  async initialize(metadataPath?: string): Promise<void> {
    try {
      // Load default components first to ensure we have basic components
      try {
        const { defaultComponents } = await import('./data/default-components');
        this.registerBatch(defaultComponents);
        console.log(`📦 Loaded ${defaultComponents.length} default components`);
      } catch (defaultError) {
        console.warn('⚠️ Could not load default components:', defaultError);
      }
      
      // Load external metadata if path provided
      if (metadataPath) {
        await this.loadMetadataFromJSON(metadataPath);
      }
      
      this.initialized = true;
      console.log(`✅ Component Registry initialized with ${this.components.size} total components`);
    } catch (error) {
      console.error('❌ Failed to initialize Component Registry:', error);
      // Initialize with empty registry as fallback
      this.initialized = true;
      console.log('⚠️ Component Registry initialized with empty state');
    }
  }

  /**
   * Register a component in the registry
   */
  register(component: ComponentDefinition): void {
    // Validate component definition
    this.validateComponentDefinition(component);
    
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
   * Get components that work well together
   */
  getCompatibleComponents(componentId: string): ComponentDefinition[] {
    const component = this.getById(componentId);
    if (!component) return [];
    
    const compatibleIds = component.metadata.usage.popularCombinations;
    return compatibleIds
      .map(id => this.getById(id))
      .filter(Boolean) as ComponentDefinition[];
  }

  /**
   * Get components compatible with a specific design kit
   */
  getComponentsByDesignKit(kitId: string): ComponentDefinition[] {
    return Array.from(this.components.values())
      .filter(component => {
        const compatibleKits = component.metadata.designKit?.compatibleKits || [];
        return compatibleKits.includes(kitId);
      })
      .sort((a, b) => {
        // Sort by performance score for the kit
        const scoreA = a.metadata.designKit?.performanceScore || 0;
        const scoreB = b.metadata.designKit?.performanceScore || 0;
        return scoreB - scoreA;
      });
  }

  /**
   * Get recommended components for a design kit and industry combination
   */
  getRecommendedForKit(kitId: string, industry?: string): {
    hero: ComponentDefinition[];
    features: ComponentDefinition[];
    pricing: ComponentDefinition[];
    testimonials: ComponentDefinition[];
    cta: ComponentDefinition[];
  } {
    const result = {
      hero: [] as ComponentDefinition[],
      features: [] as ComponentDefinition[],
      pricing: [] as ComponentDefinition[],
      testimonials: [] as ComponentDefinition[],
      cta: [] as ComponentDefinition[]
    };

    for (const [category, components] of Object.entries(result)) {
      result[category as keyof typeof result] = this.search({
        category: category as ComponentCategory,
        designKit: kitId,
        industry
      });
    }

    return result;
  }

  /**
   * Validate component combination
   */
  validateCombination(componentIds: string[]): ValidationResult {
    const components = componentIds
      .map(id => this.getById(id))
      .filter(Boolean) as ComponentDefinition[];
    
    if (components.length !== componentIds.length) {
      return {
        valid: false,
        score: 0,
        issues: [{
          type: 'error',
          componentId: 'unknown',
          message: 'One or more components not found in registry'
        }],
        suggestions: []
      };
    }
    
    const issues: ValidationIssue[] = [];
    const suggestions: string[] = [];
    let score = 1.0;
    
    // Check for duplicate categories (potential conflicts)
    const categories = components.map(c => c.category);
    const duplicateCategories = categories.filter((cat, i) => categories.indexOf(cat) !== i);
    
    for (const category of duplicateCategories) {
      issues.push({
        type: 'warning',
        componentId: components.find(c => c.category === category)?.id || 'unknown',
        message: `Multiple ${category} components detected`,
        suggestion: `Consider using only one ${category} component per page`
      });
      score -= 0.1;
    }
    
    // Check performance impact
    const totalBundleSize = components.reduce((sum, c) => sum + c.metadata.performance.bundleSize, 0);
    if (totalBundleSize > 500) { // 500KB threshold
      issues.push({
        type: 'warning',
        componentId: 'combination',
        message: `Large bundle size: ${totalBundleSize.toFixed(1)}KB`,
        suggestion: 'Consider lighter components or code splitting'
      });
      score -= 0.2;
    }
    
    // Check accessibility compatibility
    const minWcagLevel = components.reduce((min, c) => {
      const levels = ['A', 'AA', 'AAA'];
      const currentIndex = levels.indexOf(min);
      const componentIndex = levels.indexOf(c.metadata.accessibility.wcagLevel);
      return componentIndex < currentIndex ? c.metadata.accessibility.wcagLevel : min;
    }, 'AAA');
    
    if (minWcagLevel === 'A') {
      suggestions.push('Consider upgrading components to AA accessibility level');
    }
    
    return {
      valid: issues.filter(i => i.type === 'error').length === 0,
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }

  /**
   * Load metadata from JSON file (extensible)
   */
  async loadMetadataFromJSON(filePath: string): Promise<void> {
    const externalData = await this.metadataLoader.loadExternalMetadata(filePath);
    
    // Update component metadata
    if (externalData.components) {
      for (const [componentId, updateData] of Object.entries(externalData.components)) {
        const existingComponent = this.getById(componentId);
        if (existingComponent && updateData.metadata) {
          const mergedMetadata = this.metadataLoader.mergeMetadata(
            existingComponent.metadata,
            updateData.metadata
          );
          existingComponent.metadata = mergedMetadata;
        }
      }
    }
    
    // Update industry mappings
    if (externalData.industries) {
      for (const [industry, mapping] of Object.entries(externalData.industries)) {
        this.industryMappings.set(industry, mapping);
      }
    }
    
    // Update design system
    if (externalData.designSystem) {
      if (!this.designSystem) {
        this.designSystem = {
          name: 'Default',
          version: '1.0.0',
          description: 'Default design system',
          tokens: externalData.designSystem,
          themes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } else {
        this.designSystem.tokens = {
          ...this.designSystem.tokens,
          ...externalData.designSystem
        };
        this.designSystem.updatedAt = new Date().toISOString();
      }
    }
    
    console.log(`✅ Loaded metadata from ${filePath}`);
  }

  /**
   * Update component metadata at runtime
   */
  updateComponentMetadata(componentId: string, metadata: Partial<ComponentMetadata>): void {
    const component = this.getById(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }
    
    component.metadata = this.metadataLoader.mergeMetadata(component.metadata, metadata);
    console.log(`🔄 Updated metadata for ${componentId}`);
  }

  /**
   * Add industry mapping
   */
  addIndustryMapping(industry: string, mapping: IndustryMapping): void {
    this.industryMappings.set(industry, mapping);
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

  /**
   * Export registry data for backup or sharing
   */
  exportRegistry(): {
    components: Record<string, ComponentDefinition>;
    industryMappings: Record<string, IndustryMapping>;
    designSystem: DesignSystem | null;
    metadata: {
      version: string;
      exportedAt: string;
      totalComponents: number;
    };
  } {
    return {
      components: Object.fromEntries(this.components),
      industryMappings: Object.fromEntries(this.industryMappings),
      designSystem: this.designSystem,
      metadata: {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        totalComponents: this.components.size
      }
    };
  }

  /**
   * Import registry data from backup
   */
  async importRegistry(data: any): Promise<void> {
    // Validate format
    if (!data.components || !data.metadata) {
      throw new Error('Invalid registry data format');
    }
    
    // Clear existing data
    this.components.clear();
    this.industryMappings.clear();
    
    // Import components
    for (const [id, component] of Object.entries(data.components as Record<string, ComponentDefinition>)) {
      this.components.set(id, component);
    }
    
    // Import industry mappings
    if (data.industryMappings) {
      for (const [industry, mapping] of Object.entries(data.industryMappings as Record<string, IndustryMapping>)) {
        this.industryMappings.set(industry, mapping);
      }
    }
    
    // Import design system
    if (data.designSystem) {
      this.designSystem = data.designSystem;
    }
    
    console.log(`✅ Imported ${this.components.size} components and ${this.industryMappings.size} industry mappings`);
  }

  // Private helper methods
  
  private validateComponentDefinition(component: ComponentDefinition): void {
    if (!component.id || !component.name || !component.category) {
      throw new Error('Component must have id, name, and category');
    }
    
    if (this.components.has(component.id)) {
      throw new Error(`Component with id ${component.id} already exists`);
    }
    
    // Validate metadata schema
    try {
      ComponentMetadataSchema.parse(component.metadata);
    } catch (error) {
      throw new Error(`Invalid component metadata for ${component.id}: ${error}`);
    }
  }

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
 * Singleton instance for global registry access
 */
let globalRegistry: ComponentRegistry | null = null;

/**
 * Get or create global registry instance
 */
export function getRegistry(options?: {
  metadataPath?: string;
  autoLoad?: boolean;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}): ComponentRegistry {
  if (!globalRegistry) {
    globalRegistry = new ComponentRegistry(options);
  }
  return globalRegistry;
}

/**
 * Initialize global registry with metadata
 */
export async function initializeRegistry(metadataPath?: string): Promise<ComponentRegistry> {
  const registry = getRegistry({ autoLoad: false });
  await registry.initialize(metadataPath);
  return registry;
}

/**
 * Helper function to create a component definition
 */
export function createComponent(config: {
  id: string;
  name: string;
  category: ComponentCategory;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
  propsSchema?: z.ZodSchema;
  metadata: Partial<ComponentMetadata>;
}): ComponentDefinition {
  const now = new Date().toISOString();
  
  return {
    id: config.id,
    name: config.name,
    category: config.category,
    component: config.component,
    defaultProps: config.defaultProps || {},
    propsSchema: config.propsSchema || z.object({}),
    metadata: {
      version: '1.0.0',
      description: '',
      tags: [],
      category: config.category,
      performance: {
        lighthouse: 85,
        bundleSize: 20,
        renderTime: 100,
        cls: 0.1,
        fcp: 1.5,
        lcp: 2.5
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.5,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 0,
        successRate: 0.8,
        industries: [],
        popularCombinations: [],
        averageProps: {}
      },
      createdAt: now,
      updatedAt: now,
      ...config.metadata
    }
  };
}