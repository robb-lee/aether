import { AIHints, Template, TemplateCustomization } from '../types/template';

export interface ContentGenerationHints {
  tone: string;
  audience: string;
  keyWords: string[];
  avoidWords: string[];
  lengthGuidelines: {
    headline: string;
    description: string;
    body: string;
  };
  callToActionExamples: string[];
}

export function generateAIHints(
  template: Template,
  businessDescription: string,
  customRequirements?: Partial<AIHints>
): ContentGenerationHints {
  const baseHints = template.aiHints;
  
  return {
    tone: customRequirements?.contentTone || baseHints.contentTone,
    audience: customRequirements?.targetAudience || baseHints.targetAudience,
    keyWords: [
      ...baseHints.seoKeywords,
      ...(customRequirements?.seoKeywords || []),
      ...extractKeywordsFromDescription(businessDescription)
    ],
    avoidWords: getAvoidWords(template.industry),
    lengthGuidelines: getLengthGuidelines(template.industry),
    callToActionExamples: getCallToActionExamples(
      customRequirements?.callToActionStyle || baseHints.callToActionStyle,
      template.industry
    )
  };
}

function extractKeywordsFromDescription(description: string): string[] {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must'];
  
  return description
    .toLowerCase()
    .split(/[^a-zA-Z0-9]+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 10); // Limit to top 10 keywords
}

function getAvoidWords(industry: string): string[] {
  const commonAvoidWords = ['spam', 'cheap', 'guaranteed', 'amazing', 'incredible'];
  
  const industrySpecific: Record<string, string[]> = {
    saas: ['revolutionary', 'game-changing', 'disrupting'],
    portfolio: ['genius', 'perfect', 'flawless'],
    ecommerce: ['lowest price', 'going out of business', 'act now'],
    blog: ['clickbait', 'you won\'t believe', 'this one trick'],
    restaurant: ['world\'s best', 'secret recipe', 'famous']
  };

  return [...commonAvoidWords, ...(industrySpecific[industry] || [])];
}

function getLengthGuidelines(industry: string): ContentGenerationHints['lengthGuidelines'] {
  const baseLengths = {
    saas: { headline: '5-8 words', description: '15-25 words', body: '50-100 words' },
    portfolio: { headline: '3-6 words', description: '10-20 words', body: '30-80 words' },
    ecommerce: { headline: '4-7 words', description: '12-22 words', body: '40-90 words' },
    blog: { headline: '6-12 words', description: '20-35 words', body: '100-200 words' },
    restaurant: { headline: '3-6 words', description: '8-18 words', body: '25-60 words' }
  };

  return baseLengths[industry as keyof typeof baseLengths] || baseLengths.saas;
}

function getCallToActionExamples(style: AIHints['callToActionStyle'], industry: string): string[] {
  const ctaMap: Record<string, Record<string, string[]>> = {
    urgent: {
      saas: ['Start Free Trial', 'Get Started Now', 'Book Demo Today'],
      portfolio: ['Hire Me Now', 'Let\'s Work Together', 'Start Project'],
      ecommerce: ['Shop Now', 'Buy Today', 'Limited Time Offer'],
      blog: ['Read More', 'Subscribe Now', 'Join Newsletter'],
      restaurant: ['Reserve Table', 'Order Online', 'Book Now']
    },
    friendly: {
      saas: ['Try It Free', 'Explore Features', 'See How It Works'],
      portfolio: ['Let\'s Chat', 'View My Work', 'Get In Touch'],
      ecommerce: ['Browse Collection', 'Discover Products', 'Find Your Style'],
      blog: ['Keep Reading', 'Join Community', 'Stay Updated'],
      restaurant: ['Check Menu', 'Visit Us', 'Make Reservation']
    },
    professional: {
      saas: ['Request Demo', 'Learn More', 'Contact Sales'],
      portfolio: ['View Portfolio', 'Discuss Project', 'Schedule Call'],
      ecommerce: ['View Products', 'Contact Us', 'Request Quote'],
      blog: ['Subscribe', 'Read Articles', 'Follow Updates'],
      restaurant: ['Make Reservation', 'View Menu', 'Contact Restaurant']
    },
    creative: {
      saas: ['Unlock Potential', 'Transform Workflow', 'Revolutionize Process'],
      portfolio: ['Bring Ideas to Life', 'Create Together', 'Make Magic'],
      ecommerce: ['Discover Treasures', 'Find Perfect Match', 'Treat Yourself'],
      blog: ['Dive Deeper', 'Explore Ideas', 'Join Journey'],
      restaurant: ['Taste Adventure', 'Experience Flavors', 'Savor Moments']
    }
  };

  return ctaMap[style]?.[industry] || ctaMap.professional[industry] || ['Learn More'];
}

export function mergeCustomizations(
  base: TemplateCustomization,
  override: Partial<TemplateCustomization>
): TemplateCustomization {
  return {
    colors: {
      ...base.colors,
      ...override.colors
    },
    fonts: {
      ...base.fonts,
      ...override.fonts
    },
    spacing: {
      ...base.spacing,
      ...override.spacing
    },
    borderRadius: override.borderRadius || base.borderRadius
  };
}

export function applyBrandColors(
  customization: TemplateCustomization,
  brandColor: string
): TemplateCustomization {
  const variations = generateColorVariations(brandColor);
  
  return {
    ...customization,
    colors: {
      ...customization.colors,
      primary: brandColor,
      secondary: variations.dark,
      accent: variations.light
    }
  };
}

function generateColorVariations(baseColor: string): {
  light: string;
  dark: string;
  muted: string;
} {
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return {
    light: `#${Math.min(255, r + 40).toString(16).padStart(2, '0')}${Math.min(255, g + 40).toString(16).padStart(2, '0')}${Math.min(255, b + 40).toString(16).padStart(2, '0')}`,
    dark: `#${Math.max(0, r - 40).toString(16).padStart(2, '0')}${Math.max(0, g - 40).toString(16).padStart(2, '0')}${Math.max(0, b - 40).toString(16).padStart(2, '0')}`,
    muted: `#${Math.floor(r * 0.7).toString(16).padStart(2, '0')}${Math.floor(g * 0.7).toString(16).padStart(2, '0')}${Math.floor(b * 0.7).toString(16).padStart(2, '0')}`
  };
}