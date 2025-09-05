/**
 * Selection-based prompts for Component Registry integration
 * 
 * Optimized prompts that instruct AI to select components instead of generating code
 * Target: 90% token reduction from 20,000 to 2,000 tokens per site
 */

import { SelectionContext } from '../selectors/component-selector';
import { getDesignKit, designKits, selectKitByIndustry } from '../../component-registry/src/design-system';

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
- header-simple: Clean navigation header with logo and menu (Lighthouse: 98)
- hero-centered: Perfect for product showcases, portfolios, creative agencies (Lighthouse: 95)
- hero-split: Ideal for SaaS, tech products, feature explanations (Lighthouse: 92)
- hero-video-bg: Best for entertainment, lifestyle, immersive experiences (Lighthouse: 75)
- hero-enterprise: Enterprise-grade hero with trust badges (Lighthouse: 93)
- features-grid: Showcase multiple features with equal importance (Lighthouse: 88)
- testimonials-slider: Customer reviews and testimonials carousel (Lighthouse: 90)
- pricing-table: Professional 3-tier pricing plans (Lighthouse: 94)
- team-grid: Team member showcase with photos and bios (Lighthouse: 88)
- portfolio-gallery: Project showcase with filtering (Lighthouse: 86)
- contact-form: Professional contact form with validation (Lighthouse: 93)
- faq-section: Expandable FAQ with search (Lighthouse: 91)
- stats-section: Key metrics and achievements display (Lighthouse: 89)
- blog-grid: Blog posts display with categories (Lighthouse: 87)
- timeline: Company milestones and processes (Lighthouse: 90)
- cta-simple: Simple call-to-action section (Lighthouse: 95)
- footer-simple: Clean footer with essential links (Lighthouse: 96)
- footer-enterprise: Enterprise footer with social links (Lighthouse: 96)

COMPONENT FLOW GUIDELINES:
1. Optional HEADER: header-simple for site navigation (recommended for multi-page sites)
2. Choose ONE hero component (hero-centered, hero-split, hero-video-bg, or hero-enterprise) 
3. Add 2-6 supporting sections based on user needs:
   - features-grid: Product/service capabilities
   - testimonials-slider: Social proof and credibility
   - pricing-table: Plans and subscription tiers
   - team-grid: About page or team showcase
   - portfolio-gallery: Work samples and projects
   - stats-section: Key metrics and achievements
   - blog-grid: Content and articles
   - timeline: Company history or processes
   - faq-section: Common questions and support
   - contact-form: Lead generation and inquiries
   - cta-simple: Call-to-action sections
4. Optional FOOTER: footer-simple or footer-enterprise for site closure
5. Choose components that create a complete user journey for the specific business type

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
      "componentId": "contact-form",
      "props": {
        "title": "Get In Touch",
        "subtitle": "We'd love to hear from you",
        "includePhone": true,
        "includeCompany": true
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

TASK: Select 3-8 components that create a complete website for this user's specific business needs. Focus on:
- Creating a logical user journey from awareness to action
- Including relevant sections for the industry (pricing for SaaS, portfolio for agencies, etc.)
- Balancing performance with functionality
- Optimizing for conversion and user experience`;
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
- Add pricing-table for subscription plans
- Include testimonials-slider for social proof
- Add stats-section for credibility
- Consider faq-section for common questions
- End with contact-form for lead generation
- Focus on conversion and trial signups`,
    recommendedComponents: ['hero-split', 'features-grid', 'pricing-table', 'testimonials-slider', 'stats-section', 'faq-section', 'contact-form']
  },

  ecommerce: {
    systemAddition: `
E-COMMERCE OPTIMIZATION:
- Prioritize hero-centered for product focus
- Include features-grid for product benefits
- Add testimonials-slider for customer reviews
- Include stats-section for trust signals
- Consider portfolio-gallery for product showcase
- Add contact-form for customer service
- Focus on purchase conversion and trust`,
    recommendedComponents: ['hero-centered', 'features-grid', 'testimonials-slider', 'stats-section', 'portfolio-gallery', 'contact-form']
  },

  entertainment: {
    systemAddition: `
ENTERTAINMENT OPTIMIZATION:
- Use hero-video-bg for immersive experience
- Include portfolio-gallery for content showcase
- Add blog-grid for news and updates
- Consider team-grid for cast/crew
- Include testimonials-slider for reviews
- Focus on engagement and emotional connection`,
    recommendedComponents: ['hero-video-bg', 'portfolio-gallery', 'blog-grid', 'team-grid', 'testimonials-slider']
  },

  portfolio: {
    systemAddition: `
PORTFOLIO OPTIMIZATION:
- Use hero-centered for personal branding
- Include portfolio-gallery for work showcase
- Add team-grid for personal/team introduction
- Include testimonials-slider for client feedback
- Consider timeline for career/company history
- Add contact-form for business inquiries
- Focus on professional presentation`,
    recommendedComponents: ['hero-centered', 'portfolio-gallery', 'team-grid', 'testimonials-slider', 'timeline', 'contact-form']
  },

  agency: {
    systemAddition: `
AGENCY OPTIMIZATION:
- Use hero-split or hero-centered for brand focus
- Include portfolio-gallery for case studies
- Add team-grid for expertise showcase
- Include testimonials-slider for client success
- Add stats-section for achievements
- Include contact-form for new business
- Consider timeline for company growth`,
    recommendedComponents: ['hero-split', 'portfolio-gallery', 'team-grid', 'testimonials-slider', 'stats-section', 'contact-form', 'timeline']
  },

  consulting: {
    systemAddition: `
CONSULTING OPTIMIZATION:
- Use hero-split for professional positioning
- Include features-grid for service overview
- Add team-grid for expertise showcase
- Include testimonials-slider for client success
- Add timeline for methodology/process
- Include contact-form for consultations
- Focus on expertise and results`,
    recommendedComponents: ['hero-split', 'features-grid', 'team-grid', 'testimonials-slider', 'timeline', 'contact-form']
  },

  blog: {
    systemAddition: `
BLOG/CONTENT OPTIMIZATION:
- Use hero-centered for blog introduction
- Include blog-grid for latest articles
- Add team-grid for author showcase
- Consider faq-section for reader help
- Include contact-form for submissions
- Focus on content discovery and engagement`,
    recommendedComponents: ['hero-centered', 'blog-grid', 'team-grid', 'faq-section', 'contact-form']
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
  _availableComponents?: string[]
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
1. HEADER (if needed): header-simple for site navigation
2. HERO: One primary hero component (hero-centered, hero-split, or hero-video-bg)
3. CONTENT: Supporting sections (features-grid, cta-simple)
4. FOOTER (if needed): footer-enterprise for site closure

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
    sidebar: 'Consider header-simple with side navigation, asymmetrical layouts',
    centered: 'Prioritize hero-centered, center-aligned content, focused messaging'
  };
  
  return guidance[layout as keyof typeof guidance] || '';
}

/**
 * Get content-length specific guidance
 */
function getContentGuidance(length: string): string {
  const guidance = {
    minimal: 'Select 3-4 components max, focus on essential messaging only',
    medium: 'Select 4-6 components, balance information with comprehensive coverage',
    comprehensive: 'Select 6-8 components, provide detailed information and complete user journey'
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
- Include header-simple (98) and footer-enterprise (95) for high scores`,

    lighthouse95: `
PERFORMANCE TARGET: Lighthouse 95+
- Use ONLY hero-centered (95), header-simple (98), footer-enterprise (95)
- Avoid video backgrounds and heavy animations
- Minimal component count (3 components max)
- Focus on speed over visual complexity`,

    fastest: `
PERFORMANCE TARGET: Maximum Speed
- Use header-simple + hero-centered + footer-enterprise only
- Minimal props and content
- No image generation requests
- Optimize for sub-10 second generation`
  };

  return createSelectionPrompt(userInput, context) + performanceGuidance[performanceTarget];
}

/**
 * DESIGN KIT-BASED ULTRA-COMPACT PROMPTS (Target: 500 tokens)
 */
export function createKitOptimizedPrompt(
  userInput: string,
  context: SelectionContext
): string {
  // Auto-select design kit
  const kitId = context.designKit || selectKitByIndustry(context.industry || 'general');
  const kit = getDesignKit(kitId);
  
  // Get preferred components for this kit
  const preferredComponents = [
    ...kit.componentPreferences.hero.slice(0, 2),
    ...kit.componentPreferences.features.slice(0, 2),
    ...kit.componentPreferences.pricing.slice(0, 1),
    ...kit.componentPreferences.cta.slice(0, 1)
  ];

  // Ultra-compact prompt
  return `${userInput}

Kit: ${kitId}
Industry: ${context.industry || 'general'}

Available: ${preferredComponents.join(', ')}

Select 3-5 components. JSON only:
{"selections":[{"componentId":"","props":{"title":"","subtitle":"","ctaText":""}}]}`;
}

/**
 * Minimal prompt for pattern matching (Target: 300 tokens)
 */
export function createMinimalPrompt(
  businessType: string,
  userGoal: string
): string {
  const kit = selectKitByIndustry(businessType);
  
  return `${businessType} ${userGoal}
Kit: ${kit}
Output: {"selections":[{"componentId":"hero-split","props":{"title":"","subtitle":"","ctaText":""}}]}`;
}

/**
 * Design kit selection helper
 */
function selectKitByIndustry(industry: string): string {
  const mapping: Record<string, string> = {
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
    'ecommerce': 'e-commerce',
    'app': 'startup',
    'mobile': 'startup',
  };
  
  return mapping[industry.toLowerCase()] || 'modern-saas';
}

/**
 * Token usage comparison prompts
 */
export function createTokenComparisonPrompt(): string {
  return `
TOKEN USAGE COMPARISON:
- Old method: Generate full component code (~2,000 tokens)
- Kit method: Select component ID + kit (~500 tokens)
- Target savings: 75% token reduction
- Expected improvement: 66% faster generation
`;
}

/**
 * Performance measurement for different prompt strategies
 */
export function measurePromptEfficiency(): {
  strategies: {
    name: string;
    tokenEstimate: number;
    description: string;
  }[];
} {
  return {
    strategies: [
      {
        name: 'Kit Optimized',
        tokenEstimate: 500,
        description: 'Use design kit + component selection'
      },
      {
        name: 'Compact Selection',
        tokenEstimate: 800,
        description: 'Registry selection with minimal context'
      },
      {
        name: 'Standard Selection', 
        tokenEstimate: 1500,
        description: 'Full registry prompt with all context'
      },
      {
        name: 'Legacy Generation',
        tokenEstimate: 2000,
        description: 'Direct component code generation'
      }
    ]
  };
}