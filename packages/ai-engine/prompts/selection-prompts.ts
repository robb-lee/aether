/**
 * Selection-based prompts for Component Registry integration
 * 
 * Optimized prompts that instruct AI to select components instead of generating code
 * Target: 90% token reduction from 20,000 to 2,000 tokens per site
 */

import { SelectionContext } from '../selectors/component-selector';

/**
 * System prompt for component selection mode
 */
export const COMPONENT_SELECTION_SYSTEM_PROMPT = `You are a website component selector, not a code generator.

YOUR ROLE:
- Select the BEST component IDs from the available registry
- Generate ONLY props and content for selected components
- DO NOT generate HTML, JSX, CSS, or component structure
- Focus on optimal component combinations and compelling content

AVAILABLE COMPONENTS:
- hero-centered: Perfect for product showcases, portfolios, creative agencies
- hero-split: Ideal for SaaS, tech products, feature explanations  
- hero-video-bg: Best for entertainment, lifestyle, immersive experiences
- features-grid: Showcase multiple features with equal importance

SELECTION CRITERIA:
1. Industry fit (SaaS → hero-split, E-commerce → hero-centered, etc.)
2. Performance requirements (hero-centered = 95 Lighthouse, hero-video-bg = 75)
3. Target audience alignment
4. Component compatibility and flow

OUTPUT FORMAT (JSON ONLY):
{
  "selections": [
    {
      "componentId": "hero-split",
      "props": {
        "title": "Compelling headline",
        "description": "Value proposition",
        "ctaText": "Call to action"
      }
    },
    {
      "componentId": "features-grid", 
      "props": {
        "title": "Features section title",
        "features": [
          {"title": "Feature 1", "description": "Benefit description"},
          {"title": "Feature 2", "description": "Benefit description"}
        ]
      }
    }
  ]
}

IMPORTANT: Return ONLY the JSON structure. No explanations, no code blocks, no markdown.`;

/**
 * Generate selection prompt for specific context
 */
export function createSelectionPrompt(
  userInput: string, 
  context: SelectionContext
): string {
  return `${COMPONENT_SELECTION_SYSTEM_PROMPT}

USER REQUEST: "${userInput}"

CONTEXT:
- Industry: ${context.industry || 'general'}
- Business Type: ${context.businessType || 'not specified'}
- Style Preference: ${context.style || 'modern'}
- Performance Requirement: ${context.performance || 'balanced'}
- Target Audience: ${context.targetAudience || 'general'}

TASK: Select 2-4 components that create the best website for this user's needs. Focus on conversion optimization and user experience.`;
}

/**
 * Industry-specific prompt templates
 */
export const INDUSTRY_PROMPTS = {
  saas: {
    systemAddition: `
SAAS OPTIMIZATION:
- Prioritize hero-split for feature explanation
- Include features-grid for capability showcase
- Focus on conversion and trial signups
- Emphasize technical benefits and ROI`,
    recommendedComponents: ['hero-split', 'features-grid']
  },

  ecommerce: {
    systemAddition: `
E-COMMERCE OPTIMIZATION:
- Prioritize hero-centered for product focus
- Emphasize visual appeal and trust signals
- Focus on purchase conversion
- Highlight product benefits and social proof`,
    recommendedComponents: ['hero-centered', 'features-grid']
  },

  entertainment: {
    systemAddition: `
ENTERTAINMENT OPTIMIZATION:
- Consider hero-video-bg for immersive experience
- Focus on engagement and emotional connection
- Prioritize visual impact over technical details
- Emphasize experience and entertainment value`,
    recommendedComponents: ['hero-video-bg', 'features-grid']
  },

  portfolio: {
    systemAddition: `
PORTFOLIO OPTIMIZATION:
- Use hero-centered for personal branding focus
- Emphasize unique value and creative work
- Focus on professional presentation
- Highlight skills and achievements`,
    recommendedComponents: ['hero-centered']
  }
};

/**
 * Performance-aware prompt modifications
 */
export const PERFORMANCE_PROMPTS = {
  high: `
PERFORMANCE PRIORITY:
- Prefer components with Lighthouse score 90+
- Avoid hero-video-bg (performance impact)
- Prioritize hero-centered (95) or hero-split (92)
- Keep component count minimal`,

  balanced: `
BALANCED APPROACH:
- All components acceptable
- Balance features with performance
- Consider mobile optimization`,

  basic: `
BASIC REQUIREMENTS:
- All components acceptable
- Focus on functionality over optimization`
};

/**
 * Generate context-aware prompt
 */
export function generateContextualPrompt(
  userInput: string,
  context: SelectionContext,
  availableComponents: string[]
): {
  prompt: string;
  estimatedTokens: number;
} {
  let prompt = createSelectionPrompt(userInput, context);

  // Add industry-specific guidance
  if (context.industry && INDUSTRY_PROMPTS[context.industry as keyof typeof INDUSTRY_PROMPTS]) {
    const industryPrompt = INDUSTRY_PROMPTS[context.industry as keyof typeof INDUSTRY_PROMPTS];
    prompt += `\n\n${industryPrompt.systemAddition}`;
  }

  // Add performance guidance
  if (context.performance && PERFORMANCE_PROMPTS[context.performance as keyof typeof PERFORMANCE_PROMPTS]) {
    prompt += `\n\n${PERFORMANCE_PROMPTS[context.performance as keyof typeof PERFORMANCE_PROMPTS]}`;
  }

  // Estimate token count (rough calculation)
  const estimatedTokens = Math.ceil(prompt.length / 4); // ~4 characters per token

  return {
    prompt,
    estimatedTokens
  };
}

/**
 * Fallback prompt for when selection fails
 */
export const FALLBACK_GENERATION_PROMPT = `If component selection fails or components are not available, generate a minimal site structure using this format:

{
  "fallback": true,
  "structure": {
    "components": {
      "root": {
        "type": "page",
        "children": [
          {
            "id": "hero_1",
            "type": "section",
            "props": {},
            "content": {"title": "...", "description": "..."}
          }
        ]
      }
    }
  }
}

Keep the structure minimal and focus on essential content only.`;

/**
 * Token usage comparison prompts
 */
export function createTokenComparisonPrompt(): string {
  return `
TOKEN USAGE COMPARISON:
- Old method: Generate full component code (~20,000 tokens)
- New method: Select component ID + props (~2,000 tokens)
- Target savings: 90% token reduction
- Expected improvement: 3x faster generation
`;
}