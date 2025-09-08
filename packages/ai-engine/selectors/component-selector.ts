/**
 * Component Selector for AI-powered component selection from Registry
 * 
 * Replaces direct component generation with intelligent selection
 * Reduces token usage by 90% while maintaining quality
 */

import { getRegistry } from '../../component-registry/src/registry';
import { ComponentDefinition, SearchCriteria } from '../../component-registry/src/types/component';
import { z } from 'zod';

// Schema for Stage 1: Component ID selection only
export const ComponentSelectionSchema = z.object({
  selections: z.array(z.string())
});

export type ComponentSelection = z.infer<typeof ComponentSelectionSchema>;

// Schema for Stage 2: Full component with props
export const ComponentWithPropsSchema = z.object({
  componentId: z.string(),
  props: z.record(z.any())
});

/**
 * Context for component selection
 */
export interface SelectionContext {
  industry?: string;
  businessType?: string;
  style?: 'minimal' | 'modern' | 'classic' | 'bold';
  performance?: 'high' | 'balanced' | 'basic';
  accessibility?: 'basic' | 'enhanced' | 'full';
  keywords?: string[];
  targetAudience?: string;
  designKit?: string; // Preferred design kit
}

/**
 * Main component selector class
 */
export class ComponentSelector {
  private registry = getRegistry();
  private initialized = false;

  /**
   * Ensure registry is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.registry.initialize();
      this.initialized = true;
    }
  }

  /**
   * Parse AI response to extract component selections
   */
  async parseSelectionResponse(aiResponse: string): Promise<ComponentSelection> {
    try {
      // Clean response (remove markdown formatting if present)
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleanedResponse);
      return ComponentSelectionSchema.parse(parsed);
    } catch (error) {
      throw new Error(`Failed to parse AI selection response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Select optimal components based on context
   */
  async selectComponentsForContext(context: SelectionContext): Promise<ComponentDefinition[]> {
    await this.ensureInitialized();
    
    // Auto-select design kit if not specified
    if (!context.designKit && context.industry) {
      context.designKit = this.selectOptimalDesignKit(context);
    }

    const searchCriteria: SearchCriteria = {
      industry: context.industry,
      keywords: context.keywords,
      designKit: context.designKit,
      performance: this.mapPerformanceCriteria(context.performance),
      accessibility: this.mapAccessibilityCriteria(context.accessibility)
    };

    const candidates = this.registry.search(searchCriteria);
    
    // If no specific matches, get recommended components
    if (candidates.length === 0) {
      return this.registry.getRecommendedComponents(context);
    }

    return this.prioritizeComponents(candidates, context);
  }

  /**
   * Get components optimized for a specific design kit
   */
  async selectComponentsForKit(kitId: string, context?: Partial<SelectionContext>): Promise<ComponentDefinition[]> {
    await this.ensureInitialized();
    return this.registry.getComponentsByDesignKit(kitId);
  }

  /**
   * Select optimal design kit for context
   */
  selectOptimalDesignKit(context: SelectionContext): string {
    const industryMapping: Record<string, string> = {
      'saas': 'modern-saas',
      'startup': 'modern-saas',
      'tech': 'modern-saas',
      'enterprise': 'corporate',
      'financial': 'corporate',
      'consulting': 'corporate',
      'design': 'creative-agency',
      'marketing': 'creative-agency',
      'retail': 'e-commerce',
      'fashion': 'e-commerce',
      'app': 'startup',
    };

    const industry = context.industry || context.businessType;
    return industry ? (industryMapping[industry.toLowerCase()] || 'modern-saas') : 'modern-saas';
  }

  /**
   * Get available component IDs for AI prompt
   */
  async getAvailableComponents(): Promise<string[]> {
    await this.ensureInitialized();
    return this.registry.getAllComponents().map(comp => comp.id);
  }

  /**
   * Get component metadata for AI context
   */
  getComponentDescriptions(): Record<string, string> {
    const components = this.registry.getAllComponents();
    const descriptions: Record<string, string> = {};

    for (const comp of components) {
      descriptions[comp.id] = `${comp.name}: ${comp.metadata.description} (${comp.metadata.aiHints?.industries.join(', ') || 'general'})`;
    }

    return descriptions;
  }

  /**
   * Validate selected component combination
   */
  async validateSelection(componentIds: string[]): Promise<{
    valid: boolean;
    issues: string[];
    suggestions: string[];
    estimatedTokenSavings: number;
  }> {
    await this.ensureInitialized();
    const validation = this.registry.validateCombination(componentIds);
    
    // Calculate token savings (compared to direct generation)
    const baseTokensPerComponent = 3000; // Estimated tokens for direct generation
    const registryTokensPerComponent = 150; // Estimated tokens for selection
    const tokenSavings = componentIds.length * (baseTokensPerComponent - registryTokensPerComponent);

    return {
      valid: validation.valid,
      issues: validation.issues.map(issue => issue.message),
      suggestions: validation.suggestions,
      estimatedTokenSavings: tokenSavings
    };
  }

  /**
   * Get component selection prompt for AI (optimized for minimal tokens)
   */
  async generateSelectionPrompt(context: SelectionContext): Promise<string> {
    await this.ensureInitialized();
    
    // Auto-select design kit
    const designKit = context.designKit || this.selectOptimalDesignKit(context);
    
    // Get pre-filtered components for the kit
    const kitComponents = this.registry.getComponentsByDesignKit(designKit);
    
    // Get recommended combinations for this kit
    const recommendations = this.registry.getRecommendedForKit(designKit, context.industry);

    // Generate ultra-compact prompt (target: 500 tokens vs 2000)
    return `Select components for ${context.industry || 'website'} using ${designKit} kit.

Available:
${kitComponents.slice(0, 10).map(c => `${c.id}: ${c.category}`).join('\n')}

Recommended:
Hero: ${recommendations.hero.slice(0, 2).map(c => c.id).join(', ')}
Features: ${recommendations.features.slice(0, 2).map(c => c.id).join(', ')}
Pricing: ${recommendations.pricing.slice(0, 2).map(c => c.id).join(', ')}

Required: hero, features, pricing, cta
Max components: 5

JSON format:
{"selections":["hero-split","features-grid","pricing-table","contact-form"]}`;
  }

  /**
   * Generate even more compact prompt for known patterns
   */
  generateCompactPrompt(context: SelectionContext): string {
    const kit = context.designKit || this.selectOptimalDesignKit(context);
    const industry = context.industry || 'general';
    
    return `${industry} site, ${kit} kit. Select: hero,features,pricing,cta. JSON only:{"selections":["component-id-1","component-id-2"]}`;
  }

  /**
   * Estimate token usage for selection vs generation
   */
  estimateTokenSavings(componentCount: number): {
    directGeneration: number;
    registrySelection: number;
    savings: number;
    savingsPercent: number;
  } {
    const directGeneration = componentCount * 3000; // Average tokens per component
    const registrySelection = componentCount * 150; // Tokens for selection + props
    const savings = directGeneration - registrySelection;
    const savingsPercent = Math.round((savings / directGeneration) * 100);

    return {
      directGeneration,
      registrySelection,
      savings,
      savingsPercent
    };
  }

  // Private helper methods

  private mapPerformanceCriteria(level?: string) {
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

  private mapAccessibilityCriteria(level?: string) {
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

  private prioritizeComponents(components: ComponentDefinition[], context: SelectionContext): ComponentDefinition[] {
    return components.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Industry relevance
      if (context.industry) {
        const aIndustries = a.metadata.aiHints?.industries || [];
        const bIndustries = b.metadata.aiHints?.industries || [];
        if (aIndustries.includes(context.industry)) scoreA += 2;
        if (bIndustries.includes(context.industry)) scoreB += 2;
      }

      // Performance preference
      if (context.performance === 'high') {
        scoreA += a.metadata.performance.lighthouse / 100;
        scoreB += b.metadata.performance.lighthouse / 100;
      }

      // Success rate
      scoreA += a.metadata.usage.successRate;
      scoreB += b.metadata.usage.successRate;

      // Conversion rate
      scoreA += a.metadata.usage.conversionRate || 0;
      scoreB += b.metadata.usage.conversionRate || 0;

      return scoreB - scoreA;
    });
  }
}

/**
 * Singleton selector instance
 */
let selectorInstance: ComponentSelector | null = null;

export function getComponentSelector(): ComponentSelector {
  if (!selectorInstance) {
    selectorInstance = new ComponentSelector();
  }
  return selectorInstance;
}

/**
 * Quick helper for getting selection prompt
 */
export async function createSelectionPrompt(context: SelectionContext): Promise<string> {
  return getComponentSelector().generateSelectionPrompt(context);
}

/**
 * Quick helper for parsing AI response
 */
export async function parseAISelection(response: string): Promise<ComponentSelection> {
  return getComponentSelector().parseSelectionResponse(response);
}

/**
 * Two-stage website generation
 */
import { createSelectionPrompt as createPromptTemplate } from '../prompts/selection-prompts';
import { generateComponentContent, ComponentContent } from '../generators/content-generator';

export type ComponentWithProps = ComponentContent;

export interface SiteGenerationResult {
  success: boolean;
  components: ComponentWithProps[];
  errors: Array<{ stage: string; error: string }>;
  metadata: {
    selectedComponents: string[];
    totalComponents: number;
    generationTime: number;
    tokensSaved: number;
  };
}

/**
 * Generate complete website using 2-stage process
 */
export async function generateWebsite(
  userInput: string,
  context: SelectionContext
): Promise<SiteGenerationResult> {
  const startTime = Date.now();
  const errors: Array<{ stage: string; error: string }> = [];
  
  console.log('🚀 Starting 2-stage website generation');
  console.log('📝 User input:', userInput);
  console.log('🎯 Context:', context);

  try {
    // Stage 1: Component Selection
    console.log('🔄 Stage 1: Selecting components...');
    
    const selectionPrompt = createPromptTemplate(userInput, context);
    
    console.log('🤖 Using AI to select components...');
    
    // Use actual AI to select components
    const { generateCompletion } = await import('../lib/litellm-client');
    
    const aiSelectionResult = await generateCompletion({
      messages: [
        {
          role: 'system',
          content: 'You are an expert web designer. Select the most appropriate components for the given business and return only valid JSON with component IDs.'
        },
        {
          role: 'user',
          content: selectionPrompt
        }
      ],
      task: 'component_selection',
      maxRetries: 2
    });

    const mockSelectionResult = {
      text: aiSelectionResult.response.choices[0].message.content.trim()
    };

    // Parse component IDs
    let componentIds: string[] = [];
    try {
      const parsedSelection = JSON.parse(mockSelectionResult.text.trim());
      componentIds = parsedSelection.selections || [];
    } catch (parseError) {
      throw new Error(`Failed to parse Stage 1 response: ${parseError}`);
    }

    console.log('✅ Stage 1 complete. Selected components:', componentIds);

    if (componentIds.length === 0) {
      throw new Error('No components selected in Stage 1');
    }

    // Stage 2: Content Generation
    console.log('🔄 Stage 2: Generating component content...');
    
    const contentResult = await generateComponentContent(
      componentIds,
      userInput,
      context
    );

    // Merge successful components with any that had errors
    const allComponents: ComponentWithProps[] = contentResult.components;
    
    // Add error info
    contentResult.errors.forEach(err => {
      errors.push({ stage: 'content-generation', error: `${err.componentId}: ${err.error}` });
    });

    // Calculate metadata
    const generationTime = Date.now() - startTime;
    const selector = getComponentSelector();
    const tokenSavings = selector.estimateTokenSavings(componentIds.length);

    console.log('✅ 2-stage generation complete:', {
      totalComponents: allComponents.length,
      errors: errors.length,
      generationTime: `${generationTime}ms`,
      tokensSaved: tokenSavings.savings
    });

    return {
      success: errors.length < componentIds.length, // Success if at least some components worked
      components: allComponents,
      errors,
      metadata: {
        selectedComponents: componentIds,
        totalComponents: allComponents.length,
        generationTime,
        tokensSaved: tokenSavings.savings
      }
    };

  } catch (error) {
    console.error('❌ 2-stage generation failed:', error);
    
    return {
      success: false,
      components: [],
      errors: [{ 
        stage: 'generation', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }],
      metadata: {
        selectedComponents: [],
        totalComponents: 0,
        generationTime: Date.now() - startTime,
        tokensSaved: 0
      }
    };
  }
}