/**
 * Site Composer - Assembles sites from selected components
 * 
 * Converts AI component selections into complete site structures
 * Handles component compatibility and generates final site JSON
 */

import { getRegistry } from '../../component-registry/src/registry';
import { ComponentDefinition } from '../../component-registry/src/types/component';
import { ComponentSelection } from '../selectors/component-selector';
import { generateUniqueId } from '../lib/utils';

export interface ComposedSite {
  id: string;
  name: string;
  pages: ComposedPage[];
  globalStyles: GlobalStyles;
  navigation: Navigation;
  metadata: SiteMetadata;
}

export interface ComposedPage {
  id: string;
  name: string;
  path: string;
  components: ComponentTree;
  seo: SEOMetadata;
}

export interface ComponentTree {
  root: ComponentNode;
  version: string;
  metadata: {
    generatedAt: string;
    model: string;
    method: 'registry' | 'legacy';
    componentsUsed: string[];
    tokenSavings?: number;
  };
}

export interface ComponentNode {
  id: string;
  componentId: string; // Registry component ID
  type: string;
  props: Record<string, any>;
  content?: Record<string, any>;
  children?: ComponentNode[];
  metadata?: {
    registryComponent: string;
    performanceScore: number;
    accessibilityLevel: string;
  };
}

export interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  spacing: {
    base: string;
  };
  borderRadius: string;
  shadows: string;
}

export interface Navigation {
  main: Array<{ label: string; path: string; }>;
  footer: Array<{ label: string; path: string; }>;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export interface SiteMetadata {
  createdAt: string;
  updatedAt: string;
  version: string;
  generationMethod: 'registry' | 'legacy';
  performance: {
    estimatedLighthouse: number;
    estimatedBundleSize: number;
    tokenSavings: number;
  };
}

/**
 * Main site composer class
 */
export class SiteComposer {
  private registry = getRegistry();

  /**
   * Compose complete site from AI component selections
   */
  async composeSiteFromSelections(
    userPrompt: string,
    selection: ComponentSelection,
    metadata: {
      model: string;
      cost: number;
      tokensUsed?: number;
      tokenSavings?: number;
    }
  ): Promise<ComposedSite> {
    
    // Validate components exist in registry
    const componentIds = selection.selections.map(s => s.componentId);
    const validation = this.registry.validateCombination(componentIds);
    
    if (!validation.valid) {
      console.warn('⚠️ Component combination issues:', validation.issues);
    }

    // Extract business context from prompt
    const businessContext = this.extractBusinessContext(userPrompt);
    
    // Generate component nodes
    const componentNodes = await this.assembleComponentNodes(selection);
    
    // Create component tree
    const componentTree: ComponentTree = {
      root: {
        id: 'root',
        componentId: 'page-root',
        type: 'page',
        props: {},
        children: componentNodes,
      },
      version: '1.0.0',
      metadata: {
        generatedAt: new Date().toISOString(),
        model: metadata.model,
        method: 'registry',
        componentsUsed: componentIds,
        tokenSavings: metadata.tokenSavings
      }
    };

    // Generate SEO metadata
    const seo = this.generateSEO(userPrompt, businessContext, selection);
    
    // Calculate performance estimates
    const performance = this.calculatePerformanceEstimates(componentIds);

    // Create complete site structure
    const site: ComposedSite = {
      id: generateUniqueId('site'),
      name: businessContext.businessName || this.extractSiteName(userPrompt),
      pages: [{
        id: generateUniqueId('page'),
        name: 'Home',
        path: '/',
        components: componentTree,
        seo
      }],
      globalStyles: this.generateGlobalStyles(businessContext),
      navigation: this.generateNavigation(businessContext),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
        generationMethod: 'registry',
        performance
      }
    };

    console.log(`🏗️ Composed site with ${componentIds.length} components`);
    console.log(`📊 Estimated performance: ${performance.estimatedLighthouse} Lighthouse score`);
    
    return site;
  }

  /**
   * Assemble component nodes from selections
   */
  private async assembleComponentNodes(selection: ComponentSelection): Promise<ComponentNode[]> {
    const nodes: ComponentNode[] = [];

    for (const sel of selection.selections) {
      const registryComponent = this.registry.getById(sel.componentId);
      
      if (!registryComponent) {
        console.warn(`⚠️ Component ${sel.componentId} not found in registry`);
        continue;
      }

      // Merge provided props with default props
      const mergedProps = {
        ...registryComponent.defaultProps,
        ...sel.props
      };

      // Create component node
      const node: ComponentNode = {
        id: generateUniqueId(sel.componentId),
        componentId: sel.componentId,
        type: registryComponent.category,
        props: mergedProps,
        metadata: {
          registryComponent: sel.componentId,
          performanceScore: registryComponent.metadata.performance.lighthouse,
          accessibilityLevel: registryComponent.metadata.accessibility.wcagLevel
        }
      };

      nodes.push(node);
    }

    return nodes;
  }

  /**
   * Generate SEO metadata from context
   */
  private generateSEO(
    userPrompt: string, 
    businessContext: any, 
    selection: ComponentSelection
  ): SEOMetadata {
    // Extract title from hero component props
    const heroSelection = selection.selections.find(s => s.componentId.startsWith('hero-'));
    const title = heroSelection?.props?.title || businessContext.businessName || 'Professional Website';
    
    // Generate description from business context
    const description = heroSelection?.props?.description || 
      `${businessContext.businessName || 'Our business'} - ${businessContext.industry || 'Professional services'} solutions`;

    // Extract keywords from prompt and components
    const promptKeywords = this.extractKeywords(userPrompt);
    const componentKeywords = selection.selections.map(s => s.componentId.split('-')).flat();
    
    return {
      title,
      description,
      keywords: [...new Set([...promptKeywords, ...componentKeywords])]
    };
  }

  /**
   * Extract business context from user prompt
   */
  private extractBusinessContext(prompt: string): {
    businessName?: string;
    industry?: string;
    businessType?: string;
    targetAudience?: string;
  } {
    const context: any = {};

    // Simple keyword extraction (could be enhanced with NLP)
    const lowerPrompt = prompt.toLowerCase();
    
    // Industry detection
    if (lowerPrompt.includes('saas') || lowerPrompt.includes('software')) {
      context.industry = 'saas';
    } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop')) {
      context.industry = 'ecommerce';
    } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal')) {
      context.industry = 'portfolio';
    } else if (lowerPrompt.includes('entertainment') || lowerPrompt.includes('media')) {
      context.industry = 'entertainment';
    }

    // Business type detection
    if (lowerPrompt.includes('startup')) {
      context.businessType = 'startup';
    } else if (lowerPrompt.includes('agency')) {
      context.businessType = 'agency';
    } else if (lowerPrompt.includes('freelancer')) {
      context.businessType = 'freelancer';
    }

    return context;
  }

  /**
   * Generate global styles based on business context
   */
  private generateGlobalStyles(businessContext: any): GlobalStyles {
    // Default Aether design system
    let colors = {
      primary: '#3b82f6',    // Blue
      secondary: '#8b5cf6',  // Purple
      background: '#ffffff',
      text: '#1f2937'
    };

    // Industry-specific color adjustments
    switch (businessContext.industry) {
      case 'saas':
        colors.primary = '#3b82f6';    // Tech blue
        colors.secondary = '#6366f1';  // Indigo
        break;
      case 'ecommerce':
        colors.primary = '#059669';    // Green (trust)
        colors.secondary = '#dc2626';  // Red (urgency)
        break;
      case 'entertainment':
        colors.primary = '#7c3aed';    // Purple
        colors.secondary = '#ec4899';  // Pink
        break;
      case 'portfolio':
        colors.primary = '#1f2937';    // Dark
        colors.secondary = '#6b7280';  // Gray
        break;
    }

    return {
      colors,
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter'
      },
      spacing: {
        base: '1rem'
      },
      borderRadius: '0.5rem',
      shadows: 'medium'
    };
  }

  /**
   * Generate navigation structure
   */
  private generateNavigation(businessContext: any): Navigation {
    const main = [{ label: 'Home', path: '/' }];
    
    // Add industry-specific navigation
    switch (businessContext.industry) {
      case 'saas':
        main.push(
          { label: 'Features', path: '#features' },
          { label: 'Pricing', path: '#pricing' },
          { label: 'Contact', path: '#contact' }
        );
        break;
      case 'ecommerce':
        main.push(
          { label: 'Products', path: '#products' },
          { label: 'About', path: '#about' },
          { label: 'Contact', path: '#contact' }
        );
        break;
      case 'portfolio':
        main.push(
          { label: 'Work', path: '#work' },
          { label: 'About', path: '#about' },
          { label: 'Contact', path: '#contact' }
        );
        break;
      default:
        main.push(
          { label: 'About', path: '#about' },
          { label: 'Services', path: '#services' },
          { label: 'Contact', path: '#contact' }
        );
    }

    return {
      main,
      footer: [
        { label: 'Privacy', path: '/privacy' },
        { label: 'Terms', path: '/terms' }
      ]
    };
  }

  /**
   * Calculate performance estimates from selected components
   */
  private calculatePerformanceEstimates(componentIds: string[]): {
    estimatedLighthouse: number;
    estimatedBundleSize: number;
    tokenSavings: number;
  } {
    const components = componentIds
      .map(id => this.registry.getById(id))
      .filter(Boolean) as ComponentDefinition[];

    if (components.length === 0) {
      return {
        estimatedLighthouse: 85,
        estimatedBundleSize: 50,
        tokenSavings: 0
      };
    }

    // Calculate weighted averages
    const totalUsage = components.reduce((sum, comp) => sum + comp.metadata.usage.totalUsage, 0);
    
    const estimatedLighthouse = components.reduce((sum, comp) => {
      const weight = comp.metadata.usage.totalUsage / totalUsage;
      return sum + (comp.metadata.performance.lighthouse * weight);
    }, 0);

    const estimatedBundleSize = components.reduce((sum, comp) => 
      sum + comp.metadata.performance.bundleSize, 0
    );

    // Calculate token savings (3000 tokens per component for direct generation)
    const tokenSavings = components.length * 3000 - (components.length * 150);

    return {
      estimatedLighthouse: Math.round(estimatedLighthouse),
      estimatedBundleSize: Math.round(estimatedBundleSize * 10) / 10,
      tokenSavings
    };
  }

  /**
   * Extract keywords from prompt
   */
  private extractKeywords(prompt: string): string[] {
    const keywords: string[] = [];
    const words = prompt.toLowerCase().split(/\s+/);
    
    // Common business keywords
    const businessKeywords = [
      'saas', 'software', 'app', 'platform', 'service', 'solution',
      'agency', 'studio', 'consulting', 'freelance', 'business',
      'ecommerce', 'shop', 'store', 'marketplace', 'retail',
      'portfolio', 'personal', 'creative', 'artist', 'designer',
      'entertainment', 'media', 'content', 'streaming', 'gaming'
    ];

    for (const word of words) {
      if (businessKeywords.includes(word)) {
        keywords.push(word);
      }
    }

    return [...new Set(keywords)];
  }

  /**
   * Extract site name from prompt
   */
  private extractSiteName(prompt: string): string {
    // Look for quoted names or "for [business name]" patterns
    const quotedMatch = prompt.match(/"([^"]+)"/);
    if (quotedMatch) {
      return quotedMatch[1];
    }

    const forMatch = prompt.match(/for\s+([A-Z][a-zA-Z\s]+?)(?:\s|$|\.)/);
    if (forMatch) {
      return forMatch[1].trim();
    }

    const namedMatch = prompt.match(/called\s+([A-Z][a-zA-Z\s]+?)(?:\s|$|\.)/);
    if (namedMatch) {
      return namedMatch[1].trim();
    }

    // Default fallback
    return 'Professional Website';
  }
}

/**
 * Singleton composer instance
 */
let composerInstance: SiteComposer | null = null;

export function getSiteComposer(): SiteComposer {
  if (!composerInstance) {
    composerInstance = new SiteComposer();
  }
  return composerInstance;
}

/**
 * Quick helper for composing site from selections
 */
export async function composeSite(
  userPrompt: string,
  selection: ComponentSelection,
  metadata: {
    model: string;
    cost: number;
    tokensUsed?: number;
    tokenSavings?: number;
  }
): Promise<ComposedSite> {
  return getSiteComposer().composeSiteFromSelections(userPrompt, selection, metadata);
}

/**
 * Utility function to generate unique IDs
 */
export function generateUniqueId(prefix: string = 'comp'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}_${timestamp}_${random}`;
}