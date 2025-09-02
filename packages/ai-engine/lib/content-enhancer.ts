/**
 * Content Enhancement Engine
 * 
 * Ensures tone consistency, generates compelling CTAs, and improves content quality
 */

import { generateCompletion } from './litellm-client';
import { config } from '../config';

export interface ToneProfile {
  voice: 'professional' | 'casual' | 'technical' | 'friendly' | 'authoritative' | 'conversational';
  personality: string[];
  vocabulary: 'simple' | 'moderate' | 'advanced';
  sentenceLength: 'short' | 'medium' | 'long' | 'varied';
  formality: 'formal' | 'semi-formal' | 'informal';
}

export interface CTAContext {
  action: string;
  urgency: 'low' | 'medium' | 'high';
  placement: 'hero' | 'features' | 'pricing' | 'footer';
  targetAudience: string;
  businessGoal: 'signup' | 'purchase' | 'contact' | 'download' | 'subscribe';
}

export interface ContentQuality {
  clarityScore: number;
  engagementScore: number;
  persuasionScore: number;
  readabilityScore: number;
  overallScore: number;
  suggestions: string[];
}

export class ContentEnhancer {
  
  /**
   * Ensure consistent tone and voice across all content
   */
  async ensureToneConsistency(
    content: string[], 
    targetTone: ToneProfile,
    businessContext: { industry: string; businessType: string }
  ): Promise<string[]> {
    
    const prompt = `Analyze and adjust these content pieces to maintain consistent tone:

Target Tone Profile:
- Voice: ${targetTone.voice}
- Personality: ${targetTone.personality.join(', ')}
- Vocabulary Level: ${targetTone.vocabulary}
- Sentence Style: ${targetTone.sentenceLength}
- Formality: ${targetTone.formality}

Business Context: ${businessContext.businessType} in ${businessContext.industry}

Content to Analyze:
${content.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Requirements:
1. Ensure all content matches the target tone profile
2. Maintain consistency across all pieces
3. Preserve key messages and information
4. Improve flow and readability
5. Keep industry-appropriate language

Return as JSON array of improved content strings.`;

    try {
      const response = await generateCompletion({
        model: config.AI_PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a content strategist expert at maintaining brand voice consistency across all marketing materials.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      // Return original content if enhancement fails
      return content;
    }
  }

  /**
   * Generate compelling, conversion-optimized CTAs
   */
  async generateCompellingCTAs(context: CTAContext): Promise<string[]> {
    const urgencyMap = {
      low: 'gentle, informative approach',
      medium: 'encouraging but not pushy',
      high: 'urgent, action-oriented with time sensitivity'
    };

    const placementMap = {
      hero: 'primary action, above the fold',
      features: 'learn more, secondary action',
      pricing: 'purchase or signup action',
      footer: 'contact or subscribe action'
    };

    const prompt = `Generate 5 compelling CTAs for ${context.placement} section.

Context:
- Action: ${context.action}
- Urgency: ${urgencyMap[context.urgency]}
- Placement: ${placementMap[context.placement]}
- Target Audience: ${context.targetAudience}
- Business Goal: ${context.businessGoal}

Requirements:
1. Clear action verbs
2. Value proposition hint
3. Appropriate urgency level
4. 2-4 words maximum
5. Conversion-optimized

Generate psychological persuasion techniques:
- Urgency (limited time)
- Scarcity (limited availability)
- Social proof (join others)
- Benefit focus (what they get)
- Risk reduction (free, trial, guarantee)

Return as JSON array of CTA strings.`;

    try {
      const response = await generateCompletion({
        model: config.AI_FALLBACK_MODEL, // Use fast model for CTA generation
        messages: [
          {
            role: 'system',
            content: 'You are a conversion optimization expert specializing in high-converting call-to-action buttons.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      return this.getFallbackCTAs(context);
    }
  }

  /**
   * Analyze content quality across multiple dimensions
   */
  analyzeContentQuality(content: string, targetAudience: string): ContentQuality {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Clarity Score (based on sentence length and complexity)
    const clarityScore = this.calculateClarityScore(content, avgWordsPerSentence);
    
    // Engagement Score (based on active voice, questions, emotional words)
    const engagementScore = this.calculateEngagementScore(content);
    
    // Persuasion Score (based on benefits, social proof, urgency)
    const persuasionScore = this.calculatePersuasionScore(content);
    
    // Readability Score (Flesch Reading Ease)
    const readabilityScore = this.calculateReadabilityScore(content);
    
    const overallScore = (clarityScore + engagementScore + persuasionScore + readabilityScore) / 4;
    
    const suggestions = this.generateImprovementSuggestions({
      clarityScore,
      engagementScore,
      persuasionScore,
      readabilityScore
    });

    return {
      clarityScore,
      engagementScore,
      persuasionScore,
      readabilityScore,
      overallScore,
      suggestions
    };
  }

  /**
   * Enhance content for better conversion rates
   */
  async enhanceForConversion(
    content: string,
    context: { businessType: string; industry: string; targetAudience: string }
  ): Promise<string> {
    const quality = this.analyzeContentQuality(content, context.targetAudience);
    
    // Only enhance if quality score is below 70
    if (quality.overallScore >= 70) {
      return content;
    }

    const prompt = `Enhance this content for better conversion rates:

Original Content: ${content}

Business Context:
- Type: ${context.businessType}
- Industry: ${context.industry}
- Target Audience: ${context.targetAudience}

Current Quality Issues:
${quality.suggestions.join('\n')}

Enhancement Goals:
1. Increase clarity and readability
2. Add emotional engagement
3. Strengthen persuasion elements
4. Maintain authentic voice
5. Optimize for target audience

Return the enhanced content only.`;

    try {
      const response = await generateCompletion({
        model: config.AI_PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a conversion copywriting expert who specializes in creating persuasive, high-converting content that resonates with target audiences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1200
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      return content; // Return original if enhancement fails
    }
  }

  private calculateClarityScore(content: string, avgWordsPerSentence: number): number {
    let score = 100;
    
    // Penalize overly long sentences
    if (avgWordsPerSentence > 20) score -= 30;
    else if (avgWordsPerSentence > 15) score -= 15;
    
    // Check for jargon and complex words
    const complexWords = content.match(/\b\w{10,}\b/g) || [];
    const jargonPenalty = Math.min(30, complexWords.length * 2);
    score -= jargonPenalty;
    
    // Check for passive voice (simple heuristic)
    const passiveIndicators = content.match(/\b(was|were|been|being)\s+\w+ed\b/g) || [];
    score -= Math.min(20, passiveIndicators.length * 5);
    
    return Math.max(0, score);
  }

  private calculateEngagementScore(content: string): number {
    let score = 50;
    
    // Positive indicators
    const questions = (content.match(/\?/g) || []).length;
    score += Math.min(20, questions * 5);
    
    const emotionalWords = content.match(/\b(amazing|incredible|powerful|transform|discover|revolutionary|breakthrough)\b/gi) || [];
    score += Math.min(15, emotionalWords.length * 3);
    
    const directAddress = content.match(/\b(you|your)\b/gi) || [];
    score += Math.min(15, directAddress.length * 0.5);
    
    return Math.min(100, score);
  }

  private calculatePersuasionScore(content: string): number {
    let score = 40;
    
    // Look for persuasion elements
    const benefits = content.match(/\b(save|gain|improve|increase|reduce|eliminate|achieve)\b/gi) || [];
    score += Math.min(20, benefits.length * 2);
    
    const socialProof = content.match(/\b(customers|clients|users|companies|trusted|proven)\b/gi) || [];
    score += Math.min(15, socialProof.length * 3);
    
    const urgency = content.match(/\b(now|today|limited|hurry|soon|deadline)\b/gi) || [];
    score += Math.min(15, urgency.length * 5);
    
    const guarantees = content.match(/\b(guarantee|promise|ensure|risk-free|money-back)\b/gi) || [];
    score += Math.min(10, guarantees.length * 5);
    
    return Math.min(100, score);
  }

  private calculateReadabilityScore(content: string): number {
    // Simplified Flesch Reading Ease calculation
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (words.length === 0 || sentences.length === 0) return 60; // Default medium score
    
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = this.avgSyllablesPerWord(content);
    
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    return Math.max(30, Math.min(100, score)); // Ensure minimum score of 30
  }

  private avgSyllablesPerWord(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const totalSyllables = words.reduce((sum, word) => {
      return sum + this.countSyllables(word);
    }, 0);
    return totalSyllables / words.length;
  }

  private countSyllables(word: string): number {
    // Simple syllable counting algorithm
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllableCount = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllableCount++;
      }
      previousWasVowel = isVowel;
    }
    
    // Handle silent 'e'
    if (word.endsWith('e')) {
      syllableCount--;
    }
    
    return Math.max(1, syllableCount);
  }

  private generateImprovementSuggestions(scores: {
    clarityScore: number;
    engagementScore: number;
    persuasionScore: number;
    readabilityScore: number;
  }): string[] {
    const suggestions: string[] = [];
    
    if (scores.clarityScore < 70) {
      suggestions.push('Simplify sentence structure and reduce complex terminology');
    }
    
    if (scores.engagementScore < 60) {
      suggestions.push('Add more direct audience engagement and emotional language');
    }
    
    if (scores.persuasionScore < 60) {
      suggestions.push('Include more benefits, social proof, or urgency elements');
    }
    
    if (scores.readabilityScore < 60) {
      suggestions.push('Reduce sentence length and use simpler vocabulary');
    }
    
    return suggestions;
  }

  private getFallbackCTAs(context: CTAContext): string[] {
    const ctaLibrary = {
      signup: {
        low: ['Sign Up', 'Join Us', 'Get Started'],
        medium: ['Start Free Trial', 'Try It Now', 'Join Today'],
        high: ['Start Now', 'Claim Your Spot', 'Get Instant Access']
      },
      purchase: {
        low: ['View Pricing', 'Learn More', 'Explore Options'],
        medium: ['Buy Now', 'Order Today', 'Purchase'],
        high: ['Buy Now', 'Order Today', 'Get Yours']
      },
      contact: {
        low: ['Contact Us', 'Get in Touch', 'Reach Out'],
        medium: ['Schedule Call', 'Book Meeting', 'Contact Today'],
        high: ['Call Now', 'Contact Today', 'Book Now']
      },
      download: {
        low: ['Download', 'Get Resource', 'Access Now'],
        medium: ['Download Now', 'Get Free Guide', 'Access Today'],
        high: ['Download Now', 'Get Instant Access', 'Claim Free']
      },
      subscribe: {
        low: ['Subscribe', 'Join Newsletter', 'Stay Updated'],
        medium: ['Subscribe Now', 'Get Updates', 'Join List'],
        high: ['Subscribe Today', 'Get Exclusive Updates', 'Join Now']
      }
    };

    return ctaLibrary[context.businessGoal]?.[context.urgency] || ctaLibrary.signup.medium;
  }

  /**
   * Get industry-specific tone profiles
   */
  getIndustryToneProfile(industry: string): ToneProfile {
    const profiles: Record<string, ToneProfile> = {
      saas: {
        voice: 'professional',
        personality: ['innovative', 'reliable', 'efficient'],
        vocabulary: 'moderate',
        sentenceLength: 'medium',
        formality: 'semi-formal'
      },
      healthcare: {
        voice: 'professional',
        personality: ['caring', 'trustworthy', 'expert'],
        vocabulary: 'moderate',
        sentenceLength: 'medium',
        formality: 'formal'
      },
      fintech: {
        voice: 'authoritative',
        personality: ['secure', 'transparent', 'innovative'],
        vocabulary: 'moderate',
        sentenceLength: 'short',
        formality: 'formal'
      },
      ecommerce: {
        voice: 'friendly',
        personality: ['helpful', 'enthusiastic', 'trustworthy'],
        vocabulary: 'simple',
        sentenceLength: 'varied',
        formality: 'informal'
      },
      consulting: {
        voice: 'authoritative',
        personality: ['expert', 'results-driven', 'strategic'],
        vocabulary: 'advanced',
        sentenceLength: 'medium',
        formality: 'formal'
      },
      creative: {
        voice: 'conversational',
        personality: ['creative', 'passionate', 'unique'],
        vocabulary: 'moderate',
        sentenceLength: 'varied',
        formality: 'informal'
      }
    };

    return profiles[industry.toLowerCase()] || profiles.saas;
  }

  /**
   * Generate A/B test variations for CTAs
   */
  async generateCTAVariations(baseCTA: string, context: CTAContext): Promise<{
    conservative: string;
    aggressive: string;
    emotional: string;
    logical: string;
  }> {
    const prompt = `Generate 4 CTA variations for A/B testing based on: "${baseCTA}"

Context:
- Action: ${context.action}
- Placement: ${context.placement}
- Target: ${context.targetAudience}
- Goal: ${context.businessGoal}

Generate these variations:
1. Conservative: Safe, traditional approach
2. Aggressive: Bold, urgent, direct
3. Emotional: Appeals to feelings and desires
4. Logical: Rational benefits and features

Return as JSON object with conservative, aggressive, emotional, logical keys.`;

    try {
      const response = await generateCompletion({
        model: config.AI_FALLBACK_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a conversion rate optimization expert who creates A/B test variations for maximum conversion impact.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 400
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      return {
        conservative: baseCTA,
        aggressive: baseCTA.replace(/\b(get|try)\b/i, 'Start'),
        emotional: baseCTA.replace(/\b(get|try)\b/i, 'Discover'),
        logical: baseCTA.replace(/\b(get|try)\b/i, 'Access')
      };
    }
  }

  /**
   * Localize content for different markets
   */
  async localizeContent(
    content: string,
    targetLanguage: string,
    culturalContext?: {
      country: string;
      region: string;
      businessCulture: 'direct' | 'indirect' | 'hierarchical' | 'egalitarian';
    }
  ): Promise<string> {
    const languagePrompts = {
      ko: 'Korean - formal, respectful tone with appropriate honorifics',
      ja: 'Japanese - polite, customer-focused with keigo when appropriate',
      zh: 'Chinese - direct but respectful, business-oriented',
      es: 'Spanish - warm, personal, community-focused',
      fr: 'French - elegant, sophisticated, quality-focused',
      de: 'German - precise, detailed, engineering-focused'
    };

    const cultureMap = {
      direct: 'straightforward communication style',
      indirect: 'subtle, context-rich communication',
      hierarchical: 'respectful of authority and status',
      egalitarian: 'casual, peer-to-peer tone'
    };

    const prompt = `Adapt this content for ${targetLanguage} market:

Original Content: ${content}

Localization Requirements:
- Language Style: ${languagePrompts[targetLanguage] || 'Natural, native-level fluency'}
- Cultural Context: ${culturalContext ? cultureMap[culturalContext.businessCulture] : 'Universal appeal'}
- Region: ${culturalContext?.country || 'Global'}

Adaptation Guidelines:
1. Maintain core message and value proposition
2. Adapt tone for cultural preferences  
3. Use culturally appropriate examples
4. Adjust urgency/directness level
5. Preserve business goals and CTAs

Return localized content in ${targetLanguage}.`;

    try {
      const response = await generateCompletion({
        model: config.AI_PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a native ${targetLanguage} copywriter expert in cultural adaptation and localization for business content.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      return content; // Return original if localization fails
    }
  }

  /**
   * Industry-specific content enhancement
   */
  async enhanceForIndustry(
    content: string,
    industry: string,
    businessType: string
  ): Promise<string> {
    const industryGuidelines = {
      healthcare: 'Emphasize trust, safety, compliance, and patient outcomes',
      fintech: 'Focus on security, transparency, regulatory compliance',
      education: 'Highlight learning outcomes, accessibility, personalization',
      real_estate: 'Emphasize location, investment value, lifestyle benefits',
      legal: 'Professional tone, expertise, results, confidentiality',
      technology: 'Innovation, efficiency, scalability, cutting-edge solutions'
    };

    const guideline = industryGuidelines[industry] || 'Professional, benefit-focused approach';

    const prompt = `Enhance content for ${industry} industry:

Original: ${content}
Business Type: ${businessType}
Industry Guidelines: ${guideline}

Enhance for:
1. Industry-specific language and terminology
2. Relevant pain points and solutions
3. Appropriate regulatory considerations
4. Industry best practices and standards
5. Target audience expectations

Return enhanced content.`;

    try {
      const response = await generateCompletion({
        model: config.AI_PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an industry expert in ${industry} with deep knowledge of market dynamics, regulations, and customer needs.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      return content;
    }
  }
}

export default ContentEnhancer;