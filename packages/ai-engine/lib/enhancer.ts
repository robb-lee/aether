/**
 * Prompt Enhancer
 * 
 * Extracts business context and enriches prompts with industry-specific enhancements
 * Based on prompt.md context extraction guidelines
 */

import { ContextExtraction, ContextExtractionSchema } from '../schemas/site-structure';
import { industryEnhancements } from '../prompts/system';
import { getTemplate } from '../prompts/templates';

/**
 * Industry keywords for automatic detection
 */
const industryKeywords = {
  saas: ['software', 'platform', 'app', 'tool', 'service', 'subscription', 'cloud', 'api', 'dashboard'],
  ecommerce: ['shop', 'store', 'product', 'sell', 'buy', 'cart', 'checkout', 'inventory', 'retail'],
  portfolio: ['portfolio', 'showcase', 'work', 'projects', 'creative', 'designer', 'developer', 'artist'],
  corporate: ['company', 'business', 'enterprise', 'corporate', 'firm', 'agency', 'consulting', 'professional'],
  blog: ['blog', 'article', 'post', 'content', 'writing', 'journal', 'magazine', 'publication'],
  restaurant: ['restaurant', 'food', 'menu', 'dining', 'cafe', 'bistro', 'cuisine', 'reservation']
};

/**
 * Style keywords for design preference detection
 */
const styleKeywords = {
  modern: ['modern', 'clean', 'minimal', 'sleek', 'contemporary', 'fresh'],
  professional: ['professional', 'corporate', 'business', 'formal', 'serious'],
  playful: ['fun', 'playful', 'colorful', 'vibrant', 'energetic', 'bold'],
  elegant: ['elegant', 'luxury', 'premium', 'sophisticated', 'refined'],
  tech: ['tech', 'technical', 'digital', 'futuristic', 'innovative'],
  organic: ['natural', 'organic', 'earthy', 'warm', 'friendly', 'welcoming']
};

/**
 * Feature keywords for functionality detection
 */
const featureKeywords = {
  booking: ['booking', 'reservation', 'appointment', 'schedule', 'calendar'],
  payment: ['payment', 'checkout', 'purchase', 'subscription', 'pricing'],
  auth: ['login', 'signup', 'authentication', 'user', 'account', 'profile'],
  search: ['search', 'filter', 'find', 'discover', 'browse'],
  social: ['social', 'share', 'comment', 'like', 'follow', 'community'],
  analytics: ['analytics', 'dashboard', 'metrics', 'tracking', 'insights'],
  chat: ['chat', 'message', 'support', 'contact', 'communication'],
  media: ['gallery', 'video', 'image', 'media', 'photo', 'portfolio']
};

/**
 * Extract context from user prompt
 */
export async function extractContext(prompt: string): Promise<ContextExtraction> {
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect industry
  const industry = detectIndustry(lowerPrompt) || 'general';
  
  // Detect target audience
  const audience = detectAudience(lowerPrompt);
  
  // Extract goals
  const goals = extractGoals(lowerPrompt);
  
  // Detect style preference
  const style = detectStyle(lowerPrompt) || 'modern';
  
  // Extract features
  const features = extractFeatures(lowerPrompt);
  
  // Detect tone
  const tone = detectTone(lowerPrompt, industry);
  
  // Extract keywords for SEO
  const keywords = extractKeywords(prompt);
  
  const context: ContextExtraction = {
    industry,
    audience,
    goals,
    style,
    features,
    tone,
    keywords
  };
  
  // Validate with Zod schema
  return ContextExtractionSchema.parse(context);
}

/**
 * Detect industry from prompt
 */
function detectIndustry(prompt: string): string | null {
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword => prompt.includes(keyword))) {
      return industry;
    }
  }
  return null;
}

/**
 * Detect target audience
 */
function detectAudience(prompt: string): string {
  const audiencePatterns = [
    { pattern: /for\s+([\w\s]+?)(?:\.|,|$)/i, group: 1 },
    { pattern: /targeting\s+([\w\s]+?)(?:\.|,|$)/i, group: 1 },
    { pattern: /aimed at\s+([\w\s]+?)(?:\.|,|$)/i, group: 1 },
    { pattern: /(b2b|b2c|enterprise|consumer|professional)/i, group: 0 }
  ];
  
  for (const { pattern, group } of audiencePatterns) {
    const match = prompt.match(pattern);
    if (match) {
      return match[group] || match[0];
    }
  }
  
  return 'general audience';
}

/**
 * Extract business goals
 */
function extractGoals(prompt: string): string[] {
  const goals: string[] = [];
  const goalKeywords = {
    'increase sales': ['sell', 'sales', 'revenue', 'conversion'],
    'build brand': ['brand', 'awareness', 'recognition'],
    'generate leads': ['leads', 'contacts', 'inquiries'],
    'showcase work': ['showcase', 'portfolio', 'display'],
    'provide information': ['inform', 'educate', 'explain'],
    'build community': ['community', 'engage', 'connect']
  };
  
  for (const [goal, keywords] of Object.entries(goalKeywords)) {
    if (keywords.some(keyword => prompt.includes(keyword))) {
      goals.push(goal);
    }
  }
  
  return goals.length > 0 ? goals : ['establish online presence'];
}

/**
 * Detect design style preference
 */
function detectStyle(prompt: string): string | null {
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    if (keywords.some(keyword => prompt.includes(keyword))) {
      return style;
    }
  }
  return null;
}

/**
 * Extract required features
 */
function extractFeatures(prompt: string): string[] {
  const features: string[] = [];
  
  for (const [feature, keywords] of Object.entries(featureKeywords)) {
    if (keywords.some(keyword => prompt.includes(keyword))) {
      features.push(feature);
    }
  }
  
  // Add default features based on industry
  if (prompt.includes('ecommerce') || prompt.includes('shop')) {
    if (!features.includes('payment')) features.push('payment');
    if (!features.includes('search')) features.push('search');
  }
  
  if (prompt.includes('blog') || prompt.includes('content')) {
    if (!features.includes('search')) features.push('search');
  }
  
  return features;
}

/**
 * Detect appropriate tone
 */
function detectTone(prompt: string, industry: string): string {
  const toneMap = {
    professional: ['corporate', 'business', 'enterprise', 'formal'],
    friendly: ['friendly', 'casual', 'approachable', 'warm'],
    innovative: ['innovative', 'cutting-edge', 'modern', 'tech'],
    playful: ['fun', 'playful', 'creative', 'energetic'],
    authoritative: ['expert', 'authority', 'leading', 'trusted']
  };
  
  for (const [tone, keywords] of Object.entries(toneMap)) {
    if (keywords.some(keyword => prompt.includes(keyword))) {
      return tone;
    }
  }
  
  // Default tone based on industry
  const industryTones: Record<string, string> = {
    saas: 'professional',
    ecommerce: 'friendly',
    portfolio: 'creative',
    corporate: 'professional',
    blog: 'conversational',
    restaurant: 'inviting'
  };
  
  return industryTones[industry] || 'professional';
}

/**
 * Extract SEO keywords
 */
function extractKeywords(prompt: string): string[] {
  // Remove common words and extract meaningful terms
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were']);
  
  const words = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  // Count word frequency
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });
  
  // Sort by frequency and return top keywords
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Enhance prompt with context
 */
export function enhancePrompt(
  basePrompt: string,
  context: ContextExtraction
): string {
  const enhancement = industryEnhancements[context.industry as keyof typeof industryEnhancements];
  const template = getTemplate(context.industry);
  
  let enhancedPrompt = basePrompt;
  
  // Add context information
  enhancedPrompt += `\n\nContext Information:`;
  enhancedPrompt += `\n- Industry: ${context.industry}`;
  enhancedPrompt += `\n- Target Audience: ${context.audience}`;
  enhancedPrompt += `\n- Business Goals: ${context.goals.join(', ')}`;
  enhancedPrompt += `\n- Design Style: ${context.style}`;
  enhancedPrompt += `\n- Required Features: ${context.features.join(', ')}`;
  
  if (context.tone) {
    enhancedPrompt += `\n- Content Tone: ${context.tone}`;
  }
  
  if (context.keywords && context.keywords.length > 0) {
    enhancedPrompt += `\n- SEO Keywords: ${context.keywords.slice(0, 5).join(', ')}`;
  }
  
  // Add industry-specific enhancements
  if (enhancement) {
    enhancedPrompt += `\n\nIndustry-Specific Requirements:`;
    enhancedPrompt += `\n- Focus Areas: ${enhancement.focus}`;
    enhancedPrompt += `\n- Key Sections: ${enhancement.sections.join(', ')}`;
    enhancedPrompt += `\n- Tone Guidelines: ${enhancement.tone}`;
  }
  
  // Add template information if available
  if (template) {
    enhancedPrompt += `\n\nTemplate Information:`;
    enhancedPrompt += `\n- Template: ${template.name}`;
    enhancedPrompt += `\n- Sections: ${template.sections.map(s => s.name).join(', ')}`;
  }
  
  return enhancedPrompt;
}

/**
 * Create task-specific prompt enhancement
 */
export function enhanceForTask(
  prompt: string,
  task: 'structure' | 'content' | 'seo' | 'design'
): string {
  const taskEnhancements = {
    structure: `
Focus on creating a logical, hierarchical component structure.
Ensure proper HTML semantics and accessibility.
Include responsive design considerations.`,
    
    content: `
Generate engaging, conversion-focused copy.
Maintain consistency in tone and voice.
Include compelling headlines and clear CTAs.`,
    
    seo: `
Optimize for search engine visibility.
Include meta descriptions and title tags.
Use semantic HTML and structured data.`,
    
    design: `
Create a cohesive visual system.
Define color palette, typography, and spacing.
Ensure brand consistency throughout.`
  };
  
  return prompt + '\n' + taskEnhancements[task];
}

/**
 * Optimize prompt for token efficiency
 */
export function optimizePrompt(prompt: string, maxTokens: number = 2000): string {
  // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
  const estimatedTokens = prompt.length / 4;
  
  if (estimatedTokens <= maxTokens) {
    return prompt;
  }
  
  // Compress prompt by removing redundancy
  let optimized = prompt
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove duplicate instructions
    .replace(/(.{50,}?)(\1)+/g, '$1')
    // Abbreviate common terms
    .replace(/requirements?/gi, 'req')
    .replace(/components?/gi, 'comp')
    .replace(/configuration/gi, 'config')
    .replace(/professional/gi, 'pro');
  
  // If still too long, truncate less important sections
  if (optimized.length / 4 > maxTokens) {
    const sections = optimized.split('\n\n');
    const prioritySections = sections.slice(0, Math.floor(sections.length * 0.7));
    optimized = prioritySections.join('\n\n');
  }
  
  return optimized;
}

/**
 * Add examples to prompt for better results
 */
export function addExamples(prompt: string, examples: string[]): string {
  if (examples.length === 0) return prompt;
  
  let enhancedPrompt = prompt + '\n\nExamples:';
  examples.forEach((example, index) => {
    enhancedPrompt += `\n${index + 1}. ${example}`;
  });
  
  return enhancedPrompt;
}