/**
 * Selection-based prompts for Component Registry integration
 * 
 * Optimized prompts that instruct AI to select components instead of generating code
 * Target: 90% token reduction from 20,000 to 2,000 tokens per site
 */

import { SelectionContext } from '../selectors/component-selector';

/**
 * Enhanced system prompt for component selection and tree building
 */
export const COMPONENT_SELECTION_SYSTEM_PROMPT = `You are a website component selector and structure architect.

YOUR ROLE:
- Select the BEST component IDs from the available registry
- Generate ONLY props and content for selected components
- Design logical component hierarchy and flow
- DO NOT generate HTML, JSX, CSS, or component structure
- Focus on optimal component combinations, compelling content, and user experience flow

AVAILABLE COMPONENTS:
- hero-centered: Perfect for product showcases, portfolios, creative agencies (Lighthouse: 95)
- hero-split: Ideal for SaaS, tech products, feature explanations (Lighthouse: 92)
- hero-video-bg: Best for entertainment, lifestyle, immersive experiences (Lighthouse: 75)
- features-grid: Showcase multiple features with equal importance (Lighthouse: 88)
- header-nav: Navigation with logo and menu items (Lighthouse: 98)
- footer-simple: Basic footer with links and contact info (Lighthouse: 95)
- cta-banner: Call-to-action section for conversions (Lighthouse: 92)

COMPONENT FLOW GUIDELINES:
1. Start with header-nav for navigation (always first if needed)
2. Follow with hero component (hero-centered, hero-split, or hero-video-bg)
3. Add supporting sections (features-grid, cta-banner)
4. End with footer-simple for completeness
5. Maintain logical visual hierarchy and user journey

SELECTION CRITERIA:
1. Industry fit (SaaS → hero-split, E-commerce → hero-centered, etc.)
2. Performance requirements (hero-centered = 95 Lighthouse, hero-video-bg = 75)
3. Target audience alignment
4. Component compatibility and flow
5. Conversion optimization and user experience

COMPONENT ORDERING:
- Components will be rendered in the order you specify them
- Consider user reading patterns (top to bottom)
- Create logical information hierarchy
- Guide users toward conversion goals

OUTPUT FORMAT (JSON ONLY):
{
  "selections": [
    {
      "componentId": "header-nav",
      "props": {
        "logo": "Brand Name",
        "menuItems": [
          {"label": "Features", "href": "#features"},
          {"label": "Pricing", "href": "#pricing"},
          {"label": "Contact", "href": "#contact"}
        ],
        "ctaText": "Get Started"
      }
    },
    {
      "componentId": "hero-split",
      "props": {
        "title": "Compelling headline",
        "description": "Value proposition that clearly explains benefits",
        "ctaText": "Primary call to action",
        "imagePrompt": "Professional image description for AI generation"
      }
    },
    {
      "componentId": "features-grid", 
      "props": {
        "title": "Features section title",
        "description": "Brief overview of capabilities",
        "features": [
          {"title": "Feature 1", "description": "Specific benefit description", "icon": "icon-name"},
          {"title": "Feature 2", "description": "Specific benefit description", "icon": "icon-name"},
          {"title": "Feature 3", "description": "Specific benefit description", "icon": "icon-name"}
        ]
      }
    },
    {
      "componentId": "footer-simple",
      "props": {
        "companyName": "Company Name",
        "links": [
          {"label": "Privacy", "href": "/privacy"},
          {"label": "Terms", "href": "/terms"}
        ],
        "contact": "contact@example.com"
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
 * Enhanced hierarchical selection prompt for tree building
 */
export function createHierarchicalSelectionPrompt(
  userInput: string,
  context: SelectionContext,
  availableComponents: string[]
): string {
  const basePrompt = createSelectionPrompt(userInput, context);
  
  const hierarchicalGuidance = `

HIERARCHICAL STRUCTURE GUIDELINES:
1. HEADER (if needed): header-nav for site navigation
2. HERO: One primary hero component (hero-centered, hero-split, or hero-video-bg)
3. CONTENT: Supporting sections (features-grid, cta-banner)
4. FOOTER (if needed): footer-simple for site closure

COMPONENT RELATIONSHIPS:
- Each component should serve a specific purpose in the user journey
- Maintain logical flow from introduction → value proposition → action
- Ensure components work together visually and functionally
- Consider responsive behavior across all device sizes

LAYOUT HIERARCHY:
- Components will be stacked vertically in the order specified
- Each component will have proper spacing and layout
- Responsive breakpoints will be applied automatically
- Performance optimization will be maintained

CONTENT STRATEGY:
- Hero: Grab attention and communicate core value
- Features: Build credibility and demonstrate capabilities  
- CTA: Drive user action and conversion
- Navigation: Enable easy site exploration
- Footer: Provide necessary links and contact info

AVAILABLE COMPONENTS: ${availableComponents.join(', ')}`;

  return basePrompt + hierarchicalGuidance;
}

/**
 * Layout-aware component selection prompt
 */
export function createLayoutAwarePrompt(
  userInput: string,
  context: SelectionContext & {
    layoutPreference?: 'stacked' | 'grid' | 'sidebar' | 'centered';
    contentLength?: 'minimal' | 'medium' | 'comprehensive';
  }
): string {
  const layoutGuidance = context.layoutPreference ? `

LAYOUT PREFERENCE: ${context.layoutPreference}
${getLayoutGuidance(context.layoutPreference)}` : '';

  const contentGuidance = context.contentLength ? `

CONTENT LENGTH: ${context.contentLength}
${getContentGuidance(context.contentLength)}` : '';

  return createSelectionPrompt(userInput, context) + layoutGuidance + contentGuidance;
}

/**
 * Get layout-specific guidance
 */
function getLayoutGuidance(layout: string): string {
  const guidance = {
    stacked: 'Focus on vertical flow, full-width components, clear section breaks',
    grid: 'Emphasize features-grid, balanced content distribution, visual harmony',
    sidebar: 'Consider header-nav with side navigation, asymmetrical layouts',
    centered: 'Prioritize hero-centered, center-aligned content, focused messaging'
  };
  
  return guidance[layout as keyof typeof guidance] || '';
}

/**
 * Get content-length specific guidance
 */
function getContentGuidance(length: string): string {
  const guidance = {
    minimal: 'Select 2-3 components max, focus on essential messaging only',
    medium: 'Select 3-4 components, balance information with brevity',
    comprehensive: 'Select 4-6 components, provide detailed information and multiple CTAs'
  };
  
  return guidance[length as keyof typeof guidance] || '';
}

/**
 * Performance-optimized component selection
 */
export function createPerformanceOptimizedPrompt(
  userInput: string,
  context: SelectionContext,
  performanceTarget: 'lighthouse90' | 'lighthouse95' | 'fastest'
): string {
  const performanceGuidance = {
    lighthouse90: `
PERFORMANCE TARGET: Lighthouse 90+
- Avoid hero-video-bg (performance impact)
- Prefer hero-centered (95) or hero-split (92)
- Limit to 4 components maximum
- Include header-nav (98) and footer-simple (95) for high scores`,

    lighthouse95: `
PERFORMANCE TARGET: Lighthouse 95+
- Use ONLY hero-centered (95), header-nav (98), footer-simple (95)
- Avoid video backgrounds and heavy animations
- Minimal component count (3 components max)
- Focus on speed over visual complexity`,

    fastest: `
PERFORMANCE TARGET: Maximum Speed
- Use header-nav + hero-centered + footer-simple only
- Minimal props and content
- No image generation requests
- Optimize for sub-10 second generation`
  };

  return createSelectionPrompt(userInput, context) + performanceGuidance[performanceTarget];
}

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