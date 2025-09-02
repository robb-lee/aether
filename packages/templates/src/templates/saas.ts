import { Template } from '../types/template';

export const saasTemplate: Template = {
  id: 'saas-modern',
  name: 'Modern SaaS',
  description: 'Clean, professional template for SaaS products with conversion-focused design',
  industry: 'saas',
  sections: [
    {
      componentId: 'hero-split',
      defaultProps: {
        layout: 'imageRight',
        size: 'large',
        theme: 'professional'
      },
      aiHints: {
        contentTone: 'Professional yet approachable',
        targetAudience: 'Business professionals and decision makers',
        keyMessages: ['Productivity boost', 'Time savings', 'ROI improvement'],
        preferredSections: ['value proposition', 'key benefits', 'call to action']
      },
      required: true,
      order: 1
    },
    {
      componentId: 'features-grid',
      defaultProps: {
        columns: 3,
        layout: 'cards',
        showIcons: true
      },
      aiHints: {
        contentTone: 'Informative and benefit-focused',
        keyMessages: ['Feature benefits', 'Problem solving', 'Competitive advantages']
      },
      required: true,
      order: 2
    },
    {
      componentId: 'testimonials-carousel',
      defaultProps: {
        layout: 'cards',
        showCompany: true,
        autoPlay: true
      },
      aiHints: {
        contentTone: 'Authentic and credible',
        keyMessages: ['Social proof', 'Success stories', 'Trust building']
      },
      required: false,
      order: 3
    },
    {
      componentId: 'pricing-table',
      defaultProps: {
        columns: 3,
        highlight: 'middle',
        showComparison: true
      },
      aiHints: {
        contentTone: 'Clear and transparent',
        keyMessages: ['Value proposition', 'Feature comparison', 'Call to action']
      },
      required: true,
      order: 4
    },
    {
      componentId: 'cta-simple',
      defaultProps: {
        style: 'primary',
        size: 'large',
        centered: true
      },
      aiHints: {
        contentTone: 'Urgent but not pushy',
        keyMessages: ['Final conversion push', 'Limited time offer', 'Easy signup']
      },
      required: true,
      order: 5
    }
  ],
  defaultCustomization: {
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: {
      padding: '1.5rem',
      margin: '1rem'
    },
    borderRadius: '0.5rem'
  },
  aiHints: {
    contentTone: 'Professional, trustworthy, and benefit-focused',
    targetAudience: 'B2B decision makers, entrepreneurs, business owners',
    keyMessages: [
      'Increase productivity and efficiency',
      'Save time and reduce costs',
      'Proven results and ROI',
      'Easy integration and setup'
    ],
    preferredSections: [
      'value proposition',
      'key features',
      'social proof',
      'pricing',
      'call to action'
    ],
    seoKeywords: [
      'saas platform',
      'business software',
      'productivity tool',
      'automation solution',
      'enterprise software'
    ],
    callToActionStyle: 'professional'
  },
  tags: ['saas', 'business', 'professional', 'conversion-focused', 'modern']
};