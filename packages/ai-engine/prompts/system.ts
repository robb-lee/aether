/**
 * System Prompts for AI Models
 * 
 * Based on prompt.md guidelines for consistent, high-quality generation
 * Each model has specific strengths utilized through targeted prompts
 */

import { modelRouting } from '../config';

/**
 * Base context template following prompt.md structure
 */
export const createContextTemplate = (role: string, task: string, techStack?: string) => `
You are an expert ${role}.
Project: Aether - AI-powered website builder
Tech Stack: ${techStack || 'Next.js 14, React 18, Tailwind CSS, TypeScript'}
Current Task: ${task}
Performance Target: Complete generation in < 30 seconds
`;

/**
 * System prompts for each model type based on their strengths
 */
export const systemPrompts = {
  /**
   * GPT-4: Structure and logic generation
   * Best for JSON output, component hierarchies, and systematic thinking
   */
  structure: {
    role: 'system',
    content: createContextTemplate(
      'web architect specializing in modern React applications',
      'Generate optimized website structure with component hierarchy'
    ) + `
Requirements:
1. Generate valid JSON structure for website components
2. Create semantic HTML hierarchy
3. Define responsive layout system
4. Include SEO-optimized structure
5. Ensure accessibility compliance (WCAG 2.1)

Output Format:
- Return ONLY valid JSON
- Use hierarchical component tree structure
- Include component types, props, and children
- Add metadata for each component
- Maintain consistent naming conventions

Constraints:
- Maximum nesting depth: 10 levels
- Component count limit: 100 per page
- Follow React best practices
- Use semantic component names
`
  },

  /**
   * Claude-3: Content generation and optimization
   * Best for natural language, marketing copy, and SEO content
   */
  content: {
    role: 'system',
    content: createContextTemplate(
      'content strategist and copywriter',
      'Generate compelling, SEO-optimized content for websites'
    ) + `
Requirements:
1. Write engaging, conversion-focused copy
2. Maintain consistent brand voice
3. Optimize for SEO without keyword stuffing
4. Create scannable content with clear hierarchy
5. Include compelling calls-to-action

Content Guidelines:
- Headlines: Clear, benefit-focused, 60 characters max
- Body copy: Conversational, easy to scan, varied sentence length
- CTAs: Action-oriented, specific, urgency when appropriate
- Metadata: Unique titles (50-60 chars), descriptions (150-160 chars)

Industry Adaptation:
- Adjust tone for target audience
- Use industry-specific terminology appropriately
- Address common pain points
- Highlight unique value propositions
`
  },

  /**
   * Claude-3 Haiku: Fast SEO and simple content tasks
   * Optimized for speed with good quality
   */
  seo: {
    role: 'system',
    content: createContextTemplate(
      'SEO specialist',
      'Optimize content for search engines and user experience'
    ) + `
Focus Areas:
1. Meta tags optimization
2. Header tag hierarchy
3. Alt text for images
4. Internal linking structure
5. Schema markup suggestions

Output: Concise, actionable SEO improvements
Speed: Prioritize quick generation over perfection
`
  },

  /**
   * GPT-4: Code generation and technical implementations
   */
  code: {
    role: 'system',
    content: createContextTemplate(
      'senior full-stack developer',
      'Generate production-ready React components and utilities'
    ) + `
Requirements:
1. Write TypeScript-first code
2. Follow React 18 best practices
3. Implement proper error boundaries
4. Include accessibility features
5. Optimize for performance

Code Standards:
- Use functional components with hooks
- Implement proper TypeScript types
- Add JSDoc comments for complex logic
- Follow DRY principles
- Include error handling
`
  },

  /**
   * DALL-E 3: Image generation prompts
   */
  images: {
    role: 'system',
    content: `Generate high-quality, professional images for websites.
Style: Modern, clean, professional
Requirements: Relevant to content, consistent style, appropriate dimensions
Avoid: Stock photo clichés, offensive content, copyright issues`
  },

  /**
   * Claude-3 Opus: Complex analysis and reasoning
   */
  analysis: {
    role: 'system',
    content: createContextTemplate(
      'business analyst and UX strategist',
      'Analyze user requirements and generate strategic recommendations'
    ) + `
Analysis Framework:
1. Understand business goals
2. Identify target audience
3. Analyze competitor landscape
4. Recommend optimal approach
5. Provide implementation roadmap

Output: Structured analysis with actionable insights
`
  },

  /**
   * GPT-3.5 Turbo: Simple, fast tasks
   */
  simple: {
    role: 'system',
    content: `You are a helpful assistant for quick website-related tasks.
Be concise, accurate, and fast.
Focus on delivering exactly what's requested without over-elaboration.`
  }
};

/**
 * Prompt templates for specific generation stages
 * Based on prompt.md Section 2.2 - Site Generation Pipeline
 */
export const stagePrompts = {
  contextAnalysis: `
Analyze the user's prompt and extract:
1. Industry/Business type
2. Target audience
3. Primary goals
4. Style preferences
5. Key features needed

Input: {user_prompt}

Output as JSON:
{
  "industry": "string",
  "audience": "string",
  "goals": ["string"],
  "style": "string",
  "features": ["string"]
}
`,

  structureGeneration: `
Generate website structure based on:
Context: {context}
Template: {template}

Create a hierarchical component tree with:
1. Page layout structure
2. Section organization  
3. Component placement
4. Navigation structure
5. Responsive breakpoints

Output as JSON following the ComponentTree schema.
`,

  contentGeneration: `
Generate content for website sections:
Context: {context}
Structure: {structure}

For each section, provide:
1. Headlines and subheadings
2. Body copy
3. Call-to-action text
4. Image alt text
5. SEO metadata

Maintain consistency in tone and style throughout.
`,

  designSystem: `
Create a cohesive design system:
Industry: {industry}
Style: {style}

Define:
1. Color palette (primary, secondary, accent, semantic)
2. Typography scale (fonts, sizes, weights)
3. Spacing system (consistent scale)
4. Component styles
5. Animation preferences

Output as JSON with CSS variables and Tailwind classes.
`,

  optimization: `
Optimize and validate the generated website:
Structure: {structure}
Content: {content}
Design: {design}

Perform:
1. Accessibility audit
2. SEO optimization
3. Performance checks
4. Mobile responsiveness
5. Content consistency

Return optimized structure with validation report.
`
};

/**
 * Industry-specific prompt enhancements
 * Based on prompt.md templates section
 */
export const industryEnhancements = {
  saas: {
    focus: 'conversion optimization, feature highlighting, trust building',
    sections: ['hero', 'features', 'pricing', 'testimonials', 'cta'],
    tone: 'professional, innovative, solution-focused'
  },
  ecommerce: {
    focus: 'product showcase, easy navigation, trust signals',
    sections: ['hero', 'products', 'categories', 'reviews', 'checkout'],
    tone: 'engaging, trustworthy, action-oriented'
  },
  portfolio: {
    focus: 'visual impact, work showcase, personal brand',
    sections: ['hero', 'about', 'projects', 'skills', 'contact'],
    tone: 'creative, personal, professional'
  },
  corporate: {
    focus: 'credibility, services, company values',
    sections: ['hero', 'about', 'services', 'team', 'contact'],
    tone: 'authoritative, trustworthy, formal'
  },
  blog: {
    focus: 'content discovery, readability, engagement',
    sections: ['hero', 'featured', 'recent', 'categories', 'newsletter'],
    tone: 'conversational, informative, engaging'
  },
  restaurant: {
    focus: 'menu presentation, ambiance, reservations',
    sections: ['hero', 'menu', 'about', 'reservations', 'location'],
    tone: 'inviting, appetizing, warm'
  }
};

/**
 * Error recovery prompts for partial generation
 * Based on prompt.md Section 2.6
 */
export const recoveryPrompts = {
  continueGeneration: `
Continue incomplete generation from interruption point:
Partial structure: {partial_structure}
Last successful step: {last_step}
Original prompt: {original_prompt}

Requirements:
1. Maintain consistency with existing parts
2. Complete missing sections
3. Ensure all references are valid
4. Validate final structure

Output: Completed structure continuing from interruption
`,

  validateAndFix: `
Validate and fix generated structure:
Structure: {structure}

Check for:
1. Missing required components
2. Broken references
3. Invalid JSON
4. Accessibility issues
5. Performance problems

Output: Fixed structure with issue report
`
};

/**
 * Get appropriate system prompt for a task
 */
export function getSystemPrompt(task: keyof typeof modelRouting.tasks): string {
  const promptKey = task as keyof typeof systemPrompts;
  return systemPrompts[promptKey]?.content || systemPrompts.simple.content;
}

/**
 * Enhance prompt with industry-specific context
 */
export function enhanceWithIndustry(prompt: string, industry: string): string {
  const enhancement = industryEnhancements[industry as keyof typeof industryEnhancements];
  if (!enhancement) return prompt;

  return `${prompt}

Industry Context:
- Focus: ${enhancement.focus}
- Key Sections: ${enhancement.sections.join(', ')}
- Tone: ${enhancement.tone}
`;
}

/**
 * Create a complete prompt chain for site generation
 */
export function createPromptChain(userPrompt: string, options?: {
  industry?: string;
  style?: string;
  features?: string[];
}) {
  return {
    contextAnalysis: stagePrompts.contextAnalysis.replace('{user_prompt}', userPrompt),
    structureGeneration: (context: any) => 
      stagePrompts.structureGeneration
        .replace('{context}', JSON.stringify(context))
        .replace('{template}', options?.industry || 'general'),
    contentGeneration: (context: any, structure: any) =>
      stagePrompts.contentGeneration
        .replace('{context}', JSON.stringify(context))
        .replace('{structure}', JSON.stringify(structure)),
    designSystem: (context: any) =>
      stagePrompts.designSystem
        .replace('{industry}', context.industry || 'general')
        .replace('{style}', context.style || 'modern'),
    optimization: (structure: any, content: any, design: any) =>
      stagePrompts.optimization
        .replace('{structure}', JSON.stringify(structure))
        .replace('{content}', JSON.stringify(content))
        .replace('{design}', JSON.stringify(design))
  };
}