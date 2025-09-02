/**
 * SEO Optimization Engine
 * 
 * Generates SEO-optimized metadata and structured data
 */

import { generateCompletion } from './litellm-client';
import { config } from '../config';

export interface SEOContext {
  businessType: string;
  industry: string;
  location?: string;
  primaryKeywords: string[];
  secondaryKeywords?: string[];
  companyName?: string;
  productName?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    type: string;
    image?: string;
  };
  twitterCard: {
    card: string;
    title: string;
    description: string;
    image?: string;
  };
  structuredData: any;
}

export interface ContentSEOAnalysis {
  keywordDensity: Record<string, number>;
  readabilityScore: number;
  titleOptimization: {
    score: number;
    suggestions: string[];
  };
  metaOptimization: {
    score: number;
    suggestions: string[];
  };
}

export class SEOOptimizer {
  
  /**
   * Generate complete SEO metadata for a page
   */
  async generateMetadata(context: SEOContext, content: string): Promise<SEOMetadata> {
    const prompt = `Generate SEO metadata for a ${context.businessType} in ${context.industry}.

Business Context:
- Company: ${context.companyName || 'Business'}
- Product: ${context.productName || 'Service'}
- Location: ${context.location || 'Global'}
- Primary Keywords: ${context.primaryKeywords.join(', ')}
- Secondary Keywords: ${context.secondaryKeywords?.join(', ') || 'None'}

Page Content: ${content.substring(0, 500)}...

Generate optimized metadata following SEO best practices:
- Title: 50-60 characters, include primary keyword
- Description: 150-160 characters, compelling and keyword-rich
- Keywords: 5-10 relevant terms
- Open Graph: Social media optimized
- Twitter Card: Twitter-specific optimization

Return as JSON with this structure:
{
  "title": "SEO title",
  "description": "Meta description", 
  "keywords": ["keyword1", "keyword2"],
  "openGraph": {
    "title": "OG title",
    "description": "OG description",
    "type": "website"
  },
  "twitterCard": {
    "card": "summary_large_image",
    "title": "Twitter title",
    "description": "Twitter description"
  },
  "structuredData": {}
}`;

    try {
      const response = await generateCompletion({
        model: config.AI_PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate metadata that maximizes search visibility and click-through rates.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for consistent SEO output
        max_tokens: 800
      });

      const metadata = JSON.parse(response.choices[0].message.content);
      return this.enhanceMetadata(metadata, context);
    } catch (error) {
      return this.generateFallbackMetadata(context);
    }
  }

  /**
   * Generate structured data (Schema.org) for better search results
   */
  generateStructuredData(context: SEOContext): any {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': this.getSchemaType(context.businessType),
      name: context.companyName || `${context.businessType} Business`,
      description: `Professional ${context.industry} services`,
    };

    // Add business-specific schema
    switch (context.businessType.toLowerCase()) {
      case 'saas':
      case 'software':
        return {
          ...baseSchema,
          '@type': 'SoftwareApplication',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          }
        };

      case 'restaurant':
        return {
          ...baseSchema,
          '@type': 'Restaurant',
          servesCuisine: context.industry,
          address: {
            '@type': 'PostalAddress',
            addressLocality: context.location
          }
        };

      case 'consulting':
        return {
          ...baseSchema,
          '@type': 'ProfessionalService',
          serviceType: context.industry,
          areaServed: context.location || 'Global'
        };

      default:
        return {
          ...baseSchema,
          '@type': 'Organization',
          industry: context.industry
        };
    }
  }

  /**
   * Analyze content for SEO optimization opportunities
   */
  analyzeContent(content: string, keywords: string[]): ContentSEOAnalysis {
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    // Calculate keyword density
    const keywordDensity: Record<string, number> = {};
    keywords.forEach(keyword => {
      const matches = words.filter(word => 
        word.includes(keyword.toLowerCase())).length;
      keywordDensity[keyword] = (matches / totalWords) * 100;
    });

    // Simple readability score (Flesch Reading Ease approximation)
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = totalWords / sentences;
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * this.avgSyllablesPerWord(content))
    ));

    return {
      keywordDensity,
      readabilityScore,
      titleOptimization: this.analyzeTitleSEO(content, keywords),
      metaOptimization: this.analyzeMetaSEO(content, keywords)
    };
  }

  /**
   * Optimize content for better SEO performance
   */
  async optimizeContent(content: string, context: SEOContext): Promise<string> {
    const analysis = this.analyzeContent(content, context.primaryKeywords);
    
    // If content is already well-optimized, return as-is
    if (analysis.readabilityScore > 60 && 
        Object.values(analysis.keywordDensity).every(density => density >= 1 && density <= 3)) {
      return content;
    }

    const prompt = `Optimize this content for SEO while maintaining readability:

Original Content: ${content}

Keywords to optimize for: ${context.primaryKeywords.join(', ')}
Target keyword density: 1-3%
Target readability: 60+ Flesch score

Requirements:
1. Naturally integrate keywords
2. Improve sentence structure for readability
3. Maintain original meaning and tone
4. Keep content length similar
5. Ensure keywords appear in first paragraph

Return only the optimized content.`;

    try {
      const response = await generateCompletion({
        model: config.AI_PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an SEO content optimizer. Improve content for search engines while maintaining quality and readability.'
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
      return content; // Return original if optimization fails
    }
  }

  private getSchemaType(businessType: string): string {
    const typeMap: Record<string, string> = {
      'saas': 'SoftwareApplication',
      'software': 'SoftwareApplication', 
      'restaurant': 'Restaurant',
      'consulting': 'ProfessionalService',
      'agency': 'Organization',
      'ecommerce': 'Store',
      'portfolio': 'Person',
      'blog': 'Blog'
    };

    return typeMap[businessType.toLowerCase()] || 'Organization';
  }

  private enhanceMetadata(metadata: SEOMetadata, context: SEOContext): SEOMetadata {
    // Add structured data
    metadata.structuredData = this.generateStructuredData(context);
    
    // Ensure keywords are included
    if (!metadata.keywords.some(k => context.primaryKeywords.includes(k))) {
      metadata.keywords = [...metadata.keywords, ...context.primaryKeywords.slice(0, 3)];
    }

    // Validate lengths
    if (metadata.title.length > 60) {
      metadata.title = metadata.title.substring(0, 57) + '...';
    }
    
    if (metadata.description.length > 160) {
      metadata.description = metadata.description.substring(0, 157) + '...';
    }

    return metadata;
  }

  private generateFallbackMetadata(context: SEOContext): SEOMetadata {
    const title = `${context.companyName || context.businessType} | ${context.industry}`;
    const description = `Professional ${context.industry} services. Contact us today for ${context.businessType} solutions.`;

    return {
      title,
      description,
      keywords: context.primaryKeywords,
      openGraph: {
        title,
        description,
        type: 'website'
      },
      twitterCard: {
        card: 'summary_large_image',
        title,
        description
      },
      structuredData: this.generateStructuredData(context)
    };
  }

  private analyzeTitleSEO(content: string, keywords: string[]): { score: number; suggestions: string[] } {
    const title = content.split('\n')[0] || '';
    const suggestions: string[] = [];
    let score = 50;

    // Check length
    if (title.length < 30) {
      suggestions.push('Title is too short, aim for 50-60 characters');
      score -= 20;
    } else if (title.length > 60) {
      suggestions.push('Title is too long, keep under 60 characters');
      score -= 15;
    } else {
      score += 20;
    }

    // Check keyword presence
    const hasKeyword = keywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase()));
    if (!hasKeyword) {
      suggestions.push('Include primary keyword in title');
      score -= 25;
    } else {
      score += 25;
    }

    return { score: Math.max(0, score), suggestions };
  }

  private analyzeMetaSEO(content: string, keywords: string[]): { score: number; suggestions: string[] } {
    // This would analyze meta description if provided
    // For now, return basic scoring
    return {
      score: 75,
      suggestions: ['Ensure meta description includes primary keywords']
    };
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
}

export default SEOOptimizer;