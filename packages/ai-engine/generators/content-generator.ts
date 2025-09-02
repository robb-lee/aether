/**
 * Content Generation Pipeline
 * 
 * Generates business-specific content using AI models
 * Supports multiple languages and industry optimization
 */

import { generateCompletion } from '../lib/litellm-client';
import { config } from '../config';

export interface ContentRequest {
  businessType: string;
  industry: string;
  targetAudience: string;
  tone?: 'professional' | 'casual' | 'technical' | 'friendly';
  language?: string;
  sectionType: 'hero' | 'features' | 'pricing' | 'testimonials' | 'faq' | 'contact';
  context?: {
    companyName?: string;
    productName?: string;
    keyFeatures?: string[];
    valueProposition?: string;
  };
}

export interface GeneratedContent {
  headline: string;
  subheadline?: string;
  body: string;
  cta: string;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
}

export class ContentGenerator {
  
  /**
   * Generate business-specific content for a section
   */
  async generateSectionContent(request: ContentRequest): Promise<GeneratedContent> {
    const prompt = this.buildContentPrompt(request);
    
    try {
      const response = await generateCompletion({
        model: config.AI_PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(request)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = this.parseContentResponse(response.choices[0].message.content);
      return this.enhanceContent(content, request);
    } catch (error) {
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  /**
   * Generate headlines optimized for the specific business
   */
  async generateHeadlines(businessType: string, context: ContentRequest['context']): Promise<string[]> {
    const prompt = `Generate 5 compelling headlines for a ${businessType} business.
    
Context:
- Company: ${context?.companyName || 'Business'}
- Product: ${context?.productName || 'Service'}
- Value Proposition: ${context?.valueProposition || 'Solve customer problems'}

Return as JSON array of strings.`;

    try {
      const response = await generateCompletion({
        model: config.AI_FALLBACK_MODEL, // Use fast model for quick generation
        messages: [
          {
            role: 'system',
            content: 'You are an expert copywriter. Generate compelling, conversion-focused headlines.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Fallback headlines
      return [
        `Transform Your Business with ${context?.productName || 'Our Solution'}`,
        `${context?.companyName || 'We'} Help You Succeed`,
        'Get Results Fast with Our Platform',
        'Join Thousands of Satisfied Customers',
        'Start Your Journey Today'
      ];
    }
  }

  /**
   * Generate compelling CTAs for different contexts
   */
  async generateCTAs(context: { 
    action: string; 
    urgency?: 'low' | 'medium' | 'high';
    industry: string;
  }): Promise<string[]> {
    const urgencyPrompts = {
      low: 'casual, informative CTAs',
      medium: 'encouraging but not pushy CTAs', 
      high: 'urgent, action-oriented CTAs'
    };

    const prompt = `Generate 3 ${urgencyPrompts[context.urgency || 'medium']} for ${context.industry}.
    Action: ${context.action}
    
    Return as JSON array of strings.`;

    try {
      const response = await generateCompletion({
        model: config.AI_FALLBACK_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a conversion optimization expert. Create compelling call-to-action buttons.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 200
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Industry-specific fallback CTAs
      const industryDefaults = {
        saas: ['Start Free Trial', 'Get Started', 'Try It Now'],
        ecommerce: ['Shop Now', 'Add to Cart', 'Buy Today'],
        consulting: ['Schedule Consultation', 'Contact Us', 'Learn More'],
        portfolio: ['View Portfolio', 'Get in Touch', 'Hire Me'],
        restaurant: ['Order Now', 'Make Reservation', 'View Menu'],
        default: ['Get Started', 'Learn More', 'Contact Us']
      };

      return industryDefaults[context.industry] || industryDefaults.default;
    }
  }

  private buildContentPrompt(request: ContentRequest): string {
    const { businessType, industry, targetAudience, sectionType, context } = request;
    
    return `Generate ${sectionType} content for a ${businessType} in the ${industry} industry.

Target Audience: ${targetAudience}
Tone: ${request.tone || 'professional'}
Language: ${request.language || 'English'}

Business Context:
${context?.companyName ? `- Company: ${context.companyName}` : ''}
${context?.productName ? `- Product: ${context.productName}` : ''}
${context?.valueProposition ? `- Value Proposition: ${context.valueProposition}` : ''}
${context?.keyFeatures ? `- Key Features: ${context.keyFeatures.join(', ')}` : ''}

Section Type: ${sectionType}

Generate content in this JSON format:
{
  "headline": "Main headline",
  "subheadline": "Supporting headline (optional)",
  "body": "Main content text",
  "cta": "Call to action text",
  "keywords": ["keyword1", "keyword2"],
  "seoTitle": "SEO optimized title",
  "seoDescription": "Meta description"
}`;
  }

  private getSystemPrompt(request: ContentRequest): string {
    return `You are an expert copywriter and content strategist specialized in ${request.industry} businesses.

Your mission:
1. Create compelling, conversion-focused content
2. Ensure content matches the business type and target audience
3. Use industry-specific terminology appropriately
4. Maintain consistent tone throughout
5. Optimize for SEO without sacrificing readability
6. Generate strong calls-to-action that drive conversions

Content Guidelines:
- Headlines: Clear value proposition, benefit-focused
- Body: Address pain points, highlight solutions
- CTAs: Action-oriented, urgency when appropriate
- SEO: Natural keyword integration, optimal length
- Tone: Match brand personality and audience expectations

Always return valid JSON with all required fields.`;
  }

  private parseContentResponse(response: string): GeneratedContent {
    try {
      const parsed = JSON.parse(response);
      return {
        headline: parsed.headline || 'Welcome to Our Business',
        subheadline: parsed.subheadline,
        body: parsed.body || 'We provide excellent service to our customers.',
        cta: parsed.cta || 'Get Started',
        keywords: parsed.keywords || [],
        seoTitle: parsed.seoTitle || parsed.headline,
        seoDescription: parsed.seoDescription || parsed.body?.substring(0, 160)
      };
    } catch (error) {
      // Fallback parsing for malformed JSON
      return {
        headline: 'Welcome to Our Business',
        body: 'We provide excellent service to our customers.',
        cta: 'Get Started',
        keywords: [],
        seoTitle: 'Welcome to Our Business',
        seoDescription: 'We provide excellent service to our customers.'
      };
    }
  }

  private async enhanceContent(content: GeneratedContent, request: ContentRequest): Promise<GeneratedContent> {
    // Add industry-specific enhancements
    if (request.industry === 'saas') {
      content.keywords.push('software', 'cloud', 'productivity');
    } else if (request.industry === 'ecommerce') {
      content.keywords.push('shop', 'buy', 'products');
    }

    // Ensure CTA matches section type
    if (request.sectionType === 'pricing') {
      const pricingCTAs = await this.generateCTAs({
        action: 'purchase',
        urgency: 'high',
        industry: request.industry
      });
      content.cta = pricingCTAs[0];
    }

    return content;
  }
}

// Industry-specific content templates
export const industryTemplates = {
  saas: {
    hero: {
      headlines: [
        'Transform Your {business_area} with AI',
        'Scale Your {business_area} Operations',
        'Automate {pain_point} in Minutes'
      ],
      features: ['Automation', 'Analytics', 'Integration', 'Security'],
      tone: 'professional'
    },
    features: {
      focus: ['efficiency', 'automation', 'analytics', 'integration'],
      keywords: ['productivity', 'workflow', 'optimization', 'insights']
    }
  },
  ecommerce: {
    hero: {
      headlines: [
        'Discover {product_category} You Love',
        'Shop Premium {product_category}',
        'Find Your Perfect {product_category}'
      ],
      features: ['Quality', 'Fast Shipping', 'Easy Returns', 'Customer Support'],
      tone: 'friendly'
    },
    features: {
      focus: ['quality', 'convenience', 'variety', 'service'],
      keywords: ['shop', 'buy', 'quality', 'delivery']
    }
  },
  consulting: {
    hero: {
      headlines: [
        'Expert {service_area} Consulting',
        'Grow Your Business with {expertise}',
        'Strategic {service_area} Solutions'
      ],
      features: ['Expertise', 'Results', 'Partnership', 'Growth'],
      tone: 'professional'
    },
    features: {
      focus: ['expertise', 'results', 'strategy', 'growth'],
      keywords: ['consulting', 'expert', 'strategy', 'growth']
    }
  }
};

export default ContentGenerator;