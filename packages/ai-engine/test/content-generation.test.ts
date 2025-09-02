/**
 * Content Generation Pipeline Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import ContentGenerator, { ContentRequest, GeneratedContent } from '../generators/content-generator';
import SEOOptimizer, { SEOContext, SEOMetadata } from '../lib/seo-optimizer';
import ContentEnhancer, { ToneProfile, CTAContext } from '../lib/content-enhancer';
import { getLanguageConfig, detectLanguage } from '../lib/multilingual-support';

// Mock environment variables
vi.mock('../config', () => ({
  config: {
    AI_PRIMARY_MODEL: process.env.AI_PRIMARY_MODEL || 'claude-4-sonnet',
    AI_FALLBACK_MODEL: process.env.AI_FALLBACK_MODEL || 'gpt-5-mini',
    AI_IMAGE_MODEL: process.env.AI_IMAGE_MODEL || 'gpt-5',
    LITELLM_API_BASE: process.env.LITELLM_API_BASE || 'https://api.example.com',
    LITELLM_API_KEY: process.env.LITELLM_API_KEY || 'test-key'
  }
}));

// Mock the LiteLLM client
vi.mock('../lib/litellm-client', () => ({
  generateCompletion: vi.fn()
}));

describe('ContentGenerator', () => {
  let contentGenerator: ContentGenerator;
  
  beforeEach(() => {
    contentGenerator = new ContentGenerator();
  });

  describe('generateSectionContent', () => {
    it('should generate content for SaaS hero section', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              headline: 'Transform Your Business with AI',
              subheadline: 'Get more done in less time',
              body: 'Our AI-powered platform helps you automate workflows and boost productivity.',
              cta: 'Start Free Trial',
              keywords: ['AI', 'automation', 'productivity'],
              seoTitle: 'AI Business Automation Platform',
              seoDescription: 'Transform your business with AI-powered automation tools.'
            })
          }
        }]
      };

      const { generateCompletion } = await import('../lib/litellm-client');
      vi.mocked(generateCompletion).mockResolvedValue(mockResponse);

      const request: ContentRequest = {
        businessType: 'SaaS',
        industry: 'productivity',
        targetAudience: 'small business owners',
        sectionType: 'hero',
        context: {
          companyName: 'ProductivityAI',
          productName: 'AutoFlow'
        }
      };

      const result = await contentGenerator.generateSectionContent(request);

      expect(result).toMatchObject({
        headline: expect.stringContaining('Transform'),
        body: expect.stringContaining('AI'),
        cta: expect.any(String),
        keywords: expect.arrayContaining(['AI']),
        seoTitle: expect.any(String),
        seoDescription: expect.any(String)
      });
    });

    it('should handle API failures gracefully', async () => {
      const { generateCompletion } = await import('../lib/litellm-client');
      vi.mocked(generateCompletion).mockRejectedValue(new Error('API Error'));

      const request: ContentRequest = {
        businessType: 'ecommerce',
        industry: 'fashion',
        targetAudience: 'young adults',
        sectionType: 'hero'
      };

      await expect(contentGenerator.generateSectionContent(request)).rejects.toThrow('Content generation failed');
    });
  });

  describe('generateHeadlines', () => {
    it('should generate business-specific headlines', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([
              'Revolutionize Your Workflow',
              'Boost Team Productivity',
              'Automate Your Success'
            ])
          }
        }]
      };

      const { generateCompletion } = await import('../lib/litellm-client');
      vi.mocked(generateCompletion).mockResolvedValue(mockResponse);

      const headlines = await contentGenerator.generateHeadlines('SaaS', {
        companyName: 'WorkFlow Pro',
        productName: 'AutoTask'
      });

      expect(headlines).toHaveLength(3);
      expect(headlines[0]).toContain('Revolutionize');
    });

    it('should provide fallback headlines on API failure', async () => {
      const { generateCompletion } = await import('../lib/litellm-client');
      vi.mocked(generateCompletion).mockRejectedValue(new Error('API Error'));

      const headlines = await contentGenerator.generateHeadlines('consulting', {});

      expect(headlines).toHaveLength(5);
      expect(headlines).toContain('Get Results Fast with Our Platform');
    });
  });
});

describe('SEOOptimizer', () => {
  let seoOptimizer: SEOOptimizer;
  
  beforeEach(() => {
    seoOptimizer = new SEOOptimizer();
  });

  describe('generateMetadata', () => {
    it('should generate complete SEO metadata', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'AI Business Automation | ProductivityAI',
              description: 'Transform your business with AI-powered automation tools. Boost productivity and streamline workflows.',
              keywords: ['AI automation', 'business productivity', 'workflow tools'],
              openGraph: {
                title: 'AI Business Automation Platform',
                description: 'Boost productivity with AI automation',
                type: 'website'
              },
              twitterCard: {
                card: 'summary_large_image',
                title: 'AI Business Automation',
                description: 'Transform your business workflows'
              }
            })
          }
        }]
      };

      const { generateCompletion } = await import('../lib/litellm-client');
      vi.mocked(generateCompletion).mockResolvedValue(mockResponse);

      const context: SEOContext = {
        businessType: 'SaaS',
        industry: 'productivity',
        primaryKeywords: ['AI automation', 'productivity'],
        companyName: 'ProductivityAI'
      };

      const content = 'Our AI platform helps businesses automate workflows and boost productivity.';
      const metadata = await seoOptimizer.generateMetadata(context, content);

      expect(metadata.title).toContain('ProductivityAI');
      expect(metadata.description.length).toBeLessThanOrEqual(160);
      expect(metadata.keywords).toContain('AI automation');
      expect(metadata.structuredData).toHaveProperty('@context');
    });
  });

  describe('generateStructuredData', () => {
    it('should generate SaaS-specific structured data', () => {
      const context: SEOContext = {
        businessType: 'SaaS',
        industry: 'productivity',
        primaryKeywords: ['automation'],
        companyName: 'TestApp'
      };

      const structuredData = seoOptimizer.generateStructuredData(context);

      expect(structuredData['@type']).toBe('SoftwareApplication');
      expect(structuredData.applicationCategory).toBe('BusinessApplication');
      expect(structuredData.name).toBe('TestApp');
    });

    it('should generate restaurant-specific structured data', () => {
      const context: SEOContext = {
        businessType: 'restaurant',
        industry: 'Italian',
        primaryKeywords: ['pizza', 'pasta'],
        companyName: 'Mario\'s Kitchen',
        location: 'New York'
      };

      const structuredData = seoOptimizer.generateStructuredData(context);

      expect(structuredData['@type']).toBe('Restaurant');
      expect(structuredData.servesCuisine).toBe('Italian');
      expect(structuredData.address.addressLocality).toBe('New York');
    });
  });

  describe('analyzeContent', () => {
    it('should calculate keyword density correctly', () => {
      const content = 'AI automation tools help businesses. Our AI platform provides automation solutions for productivity.';
      const keywords = ['AI', 'automation', 'productivity'];
      
      const analysis = seoOptimizer.analyzeContent(content, keywords);
      
      expect(analysis.keywordDensity['AI']).toBeGreaterThan(0);
      expect(analysis.keywordDensity['automation']).toBeGreaterThan(0);
      expect(analysis.readabilityScore).toBeGreaterThan(0);
    });
  });
});

describe('ContentEnhancer', () => {
  let contentEnhancer: ContentEnhancer;
  
  beforeEach(() => {
    contentEnhancer = new ContentEnhancer();
  });

  describe('generateCompellingCTAs', () => {
    it('should generate CTAs with appropriate urgency', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([
              'Start Free Trial',
              'Try It Now',
              'Get Started Today',
              'Join Thousands',
              'Claim Your Spot'
            ])
          }
        }]
      };

      const { generateCompletion } = await import('../lib/litellm-client');
      vi.mocked(generateCompletion).mockResolvedValue(mockResponse);

      const context: CTAContext = {
        action: 'sign up',
        urgency: 'high',
        placement: 'hero',
        targetAudience: 'business owners',
        businessGoal: 'signup'
      };

      const ctas = await contentEnhancer.generateCompellingCTAs(context);

      expect(ctas).toHaveLength(5);
      expect(ctas[0]).toContain('Start');
    });

    it('should provide fallback CTAs on API failure', async () => {
      const { generateCompletion } = await import('../lib/litellm-client');
      vi.mocked(generateCompletion).mockRejectedValue(new Error('API Error'));

      const context: CTAContext = {
        action: 'purchase',
        urgency: 'medium',
        placement: 'pricing',
        targetAudience: 'consumers',
        businessGoal: 'purchase'
      };

      const ctas = await contentEnhancer.generateCompellingCTAs(context);

      expect(ctas).toHaveLength(3);
      expect(ctas).toEqual(['Buy Now', 'Order Today', 'Purchase']);
    });
  });

  describe('getIndustryToneProfile', () => {
    it('should return SaaS tone profile', () => {
      const profile = contentEnhancer.getIndustryToneProfile('saas');
      
      expect(profile.voice).toBe('professional');
      expect(profile.personality).toContain('innovative');
      expect(profile.formality).toBe('semi-formal');
    });

    it('should return healthcare tone profile', () => {
      const profile = contentEnhancer.getIndustryToneProfile('healthcare');
      
      expect(profile.voice).toBe('professional');
      expect(profile.personality).toContain('trustworthy');
      expect(profile.formality).toBe('formal');
    });

    it('should default to SaaS for unknown industries', () => {
      const profile = contentEnhancer.getIndustryToneProfile('unknown-industry');
      
      expect(profile.voice).toBe('professional');
    });
  });

  describe('analyzeContentQuality', () => {
    it('should analyze content quality metrics', () => {
      const content = 'Transform your business with our innovative platform. We help you achieve success through automation and AI technology.';
      const analysis = contentEnhancer.analyzeContentQuality(content, 'business owners');
      
      expect(analysis.clarityScore).toBeGreaterThan(0);
      expect(analysis.engagementScore).toBeGreaterThan(0);
      expect(analysis.persuasionScore).toBeGreaterThan(0);
      expect(analysis.readabilityScore).toBeGreaterThan(0);
      expect(analysis.overallScore).toBeGreaterThan(0);
      expect(Array.isArray(analysis.suggestions)).toBe(true);
    });
  });
});

describe('Multilingual Support', () => {
  describe('getLanguageConfig', () => {
    it('should return Korean language config', () => {
      const config = getLanguageConfig('ko');
      
      expect(config.name).toBe('한국어');
      expect(config.rtl).toBe(false);
      expect(config.culturalContext.businessStyle).toBe('formal');
    });

    it('should return Japanese language config', () => {
      const config = getLanguageConfig('ja');
      
      expect(config.name).toBe('日本語');
      expect(config.culturalContext.persuasionStyle).toBe('relationship');
    });

    it('should default to English for unknown language', () => {
      const config = getLanguageConfig('unknown');
      
      expect(config.code).toBe('en');
      expect(config.name).toBe('English');
    });
  });

  describe('detectLanguage', () => {
    it('should detect language from accept-language header', () => {
      const context = {
        acceptLanguage: 'ko-KR,ko;q=0.9,en;q=0.8'
      };
      
      const language = detectLanguage(context);
      expect(language).toBe('ko');
    });

    it('should detect language from country code', () => {
      const context = {
        country: 'JP'
      };
      
      const language = detectLanguage(context);
      expect(language).toBe('ja');
    });

    it('should default to English', () => {
      const context = {};
      
      const language = detectLanguage(context);
      expect(language).toBe('en');
    });
  });
});

describe('Content Pipeline Integration', () => {
  it('should integrate all components for complete content generation', async () => {
    const contentGenerator = new ContentGenerator();
    const seoOptimizer = new SEOOptimizer();
    const contentEnhancer = new ContentEnhancer();

    // Mock successful responses
    const mockContentResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            headline: 'AI-Powered Business Solutions',
            body: 'Transform your operations with cutting-edge AI technology.',
            cta: 'Get Started',
            keywords: ['AI', 'business', 'automation'],
            seoTitle: 'AI Business Solutions Platform',
            seoDescription: 'Automate your business with AI technology'
          })
        }
      }]
    };

    const mockSEOResponse = {
      choices: [{
        message: {
          content: JSON.stringify({
            title: 'AI Business Solutions | Transform Operations',
            description: 'Transform your business operations with AI-powered automation tools. Boost productivity and efficiency.',
            keywords: ['AI automation', 'business solutions', 'productivity'],
            openGraph: {
              title: 'AI Business Solutions Platform',
              description: 'AI-powered business automation',
              type: 'website'
            },
            twitterCard: {
              card: 'summary_large_image',
              title: 'AI Business Solutions',
              description: 'Transform operations with AI'
            }
          })
        }
      }]
    };

    const { generateCompletion } = await import('../lib/litellm-client');
    vi.mocked(generateCompletion)
      .mockResolvedValueOnce(mockContentResponse)
      .mockResolvedValueOnce(mockSEOResponse);

    // Generate content
    const contentRequest: ContentRequest = {
      businessType: 'SaaS',
      industry: 'productivity',
      targetAudience: 'business owners',
      sectionType: 'hero'
    };

    const content = await contentGenerator.generateSectionContent(contentRequest);
    expect(content.headline).toBeTruthy();

    // Generate SEO metadata
    const seoContext: SEOContext = {
      businessType: 'SaaS',
      industry: 'productivity',
      primaryKeywords: ['AI', 'automation']
    };

    const seoData = await seoOptimizer.generateMetadata(seoContext, content.body);
    expect(seoData.title).toBeTruthy();
    expect(seoData.structuredData).toHaveProperty('@context');

    // Analyze content quality
    const quality = contentEnhancer.analyzeContentQuality(content.body, 'business owners');
    expect(quality.overallScore).toBeGreaterThan(0);
  });
});

describe('Industry-Specific Content Generation', () => {
  let contentGenerator: ContentGenerator;
  
  beforeEach(() => {
    contentGenerator = new ContentGenerator();
  });

  const testCases = [
    {
      industry: 'saas',
      businessType: 'software',
      expectedKeywords: ['software', 'cloud', 'productivity']
    },
    {
      industry: 'ecommerce', 
      businessType: 'retail',
      expectedKeywords: ['shop', 'buy', 'products']
    },
    {
      industry: 'consulting',
      businessType: 'advisory',
      expectedKeywords: ['consulting', 'expert', 'strategy']
    }
  ];

  testCases.forEach(({ industry, businessType, expectedKeywords }) => {
    it(`should generate appropriate content for ${industry}`, async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              headline: `Professional ${industry} Solutions`,
              body: `We provide excellent ${industry} services.`,
              cta: 'Learn More',
              keywords: expectedKeywords,
              seoTitle: `${industry} Services`,
              seoDescription: `Professional ${industry} solutions`
            })
          }
        }]
      };

      const { generateCompletion } = await import('../lib/litellm-client');
      vi.mocked(generateCompletion).mockResolvedValue(mockResponse);

      const request: ContentRequest = {
        businessType,
        industry,
        targetAudience: 'business professionals',
        sectionType: 'hero'
      };

      const result = await contentGenerator.generateSectionContent(request);
      
      expect(result.keywords).toEqual(expect.arrayContaining(expectedKeywords));
    });
  });
});

describe('Performance and Error Handling', () => {
  it('should handle malformed JSON responses', async () => {
    const contentGenerator = new ContentGenerator();
    
    const mockResponse = {
      choices: [{
        message: {
          content: 'Invalid JSON response'
        }
      }]
    };

    const { generateCompletion } = await import('../lib/litellm-client');
    vi.mocked(generateCompletion).mockResolvedValue(mockResponse);

    const request: ContentRequest = {
      businessType: 'SaaS',
      industry: 'tech',
      targetAudience: 'developers',
      sectionType: 'hero'
    };

    const result = await contentGenerator.generateSectionContent(request);
    
    // Should return fallback content
    expect(result.headline).toBe('Welcome to Our Business');
    expect(result.cta).toBe('Get Started');
  });

  it('should handle network timeouts gracefully', async () => {
    const contentGenerator = new ContentGenerator();
    
    const { generateCompletion } = await import('../lib/litellm-client');
    vi.mocked(generateCompletion).mockRejectedValue(new Error('Network timeout'));

    const request: ContentRequest = {
      businessType: 'ecommerce',
      industry: 'fashion',
      targetAudience: 'consumers',
      sectionType: 'features'
    };

    await expect(contentGenerator.generateSectionContent(request)).rejects.toThrow('Content generation failed');
  });
});

describe('Content Quality Validation', () => {
  it('should validate content meets minimum quality standards', () => {
    const contentEnhancer = new ContentEnhancer();
    
    const highQualityContent = 'Transform your business with our innovative AI platform. We help you achieve measurable results through automation and intelligent workflows. Join thousands of satisfied customers who have boosted their productivity by 40%.';
    
    const analysis = contentEnhancer.analyzeContentQuality(highQualityContent, 'business owners');
    
    expect(analysis.clarityScore).toBeGreaterThan(50);
    expect(analysis.persuasionScore).toBeGreaterThan(40);
    expect(analysis.engagementScore).toBeGreaterThan(50);
  });

  it('should identify content that needs improvement', () => {
    const contentEnhancer = new ContentEnhancer();
    
    const lowQualityContent = 'We are a company that does things for people who need stuff done.';
    
    const analysis = contentEnhancer.analyzeContentQuality(lowQualityContent, 'professionals');
    
    expect(analysis.overallScore).toBeLessThan(70);
    expect(analysis.suggestions.length).toBeGreaterThan(0);
  });
});