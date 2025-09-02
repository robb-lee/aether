/**
 * Component Selector for AI-powered component selection from Registry
 * 
 * Replaces direct component generation with intelligent selection
 * Reduces token usage by 90% while maintaining quality
 */

import { getRegistry } from '../../component-registry/src/registry';
import { ComponentDefinition, SearchCriteria } from '../../component-registry/src/types/component';
import { z } from 'zod';

// Schema for AI selection response
export const ComponentSelectionSchema = z.object({
  selections: z.array(z.object({
    componentId: z.string(),
    props: z.record(z.any()),
    reasoning: z.string().optional()
  }))
});

export type ComponentSelection = z.infer<typeof ComponentSelectionSchema>;

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
}

/**
 * Main component selector class
 */
export class ComponentSelector {
  private registry = getRegistry();

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
  selectComponentsForContext(context: SelectionContext): ComponentDefinition[] {
    const searchCriteria: SearchCriteria = {
      industry: context.industry,
      keywords: context.keywords,
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
   * Get available component IDs for AI prompt
   */
  getAvailableComponents(): string[] {
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
  validateSelection(componentIds: string[]): {
    valid: boolean;
    issues: string[];
    suggestions: string[];
    estimatedTokenSavings: number;
  } {
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
   * Get component selection prompt for AI
   */
  generateSelectionPrompt(context: SelectionContext): string {
    const availableComponents = this.getComponentDescriptions();
    const recommendations = this.selectComponentsForContext(context);

    return `You are a website component selector. Choose the BEST component IDs from the registry below for this context:

CONTEXT:
${JSON.stringify(context, null, 2)}

AVAILABLE COMPONENTS:
${Object.entries(availableComponents).map(([id, desc]) => `- ${id}: ${desc}`).join('\n')}

RECOMMENDED FOR THIS CONTEXT:
${recommendations.map(comp => `- ${comp.id}: ${comp.metadata.description}`).join('\n')}

INSTRUCTIONS:
1. Select 2-4 component IDs that work well together
2. Generate appropriate props for each component
3. Consider industry best practices and target audience
4. Ensure components are compatible and create good user flow

OUTPUT FORMAT (JSON only):
{
  "selections": [
    {
      "componentId": "hero-split",
      "props": {
        "title": "Your compelling title",
        "description": "Your description",
        "ctaText": "Your CTA"
      }
    }
  ]
}

Return ONLY the JSON, no explanations.`;
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
export function createSelectionPrompt(context: SelectionContext): string {
  return getComponentSelector().generateSelectionPrompt(context);
}

/**
 * Quick helper for parsing AI response
 */
export async function parseAISelection(response: string): Promise<ComponentSelection> {
  return getComponentSelector().parseSelectionResponse(response);
}