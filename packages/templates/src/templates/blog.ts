import { Template } from '../types/template';

export const blogTemplate: Template = {
  id: 'blog-editorial',
  name: 'Editorial Blog',
  description: 'Clean, readable template for blogs and content creators',
  industry: 'blog',
  sections: [
    {
      componentId: 'hero-minimal',
      defaultProps: {
        layout: 'minimal',
        showDate: true,
        showAuthor: true
      },
      aiHints: {
        contentTone: 'Engaging and informative',
        targetAudience: 'Readers and content consumers',
        keyMessages: ['Welcome message', 'Blog purpose', 'Content value'],
        preferredSections: ['blog introduction', 'author introduction', 'subscribe invitation']
      },
      required: true,
      order: 1
    },
    {
      componentId: 'article-featured',
      defaultProps: {
        layout: 'large',
        showExcerpt: true,
        showMeta: true
      },
      aiHints: {
        contentTone: 'Compelling and informative',
        keyMessages: ['Latest content', 'Featured topics', 'Must-read articles']
      },
      required: true,
      order: 2
    },
    {
      componentId: 'article-grid',
      defaultProps: {
        columns: 2,
        showCategories: true,
        showReadTime: true
      },
      aiHints: {
        contentTone: 'Descriptive and enticing',
        keyMessages: ['Content variety', 'Easy browsing', 'Regular updates']
      },
      required: true,
      order: 3
    },
    {
      componentId: 'categories-sidebar',
      defaultProps: {
        layout: 'vertical',
        showCounts: true,
        showPopular: true
      },
      aiHints: {
        contentTone: 'Organized and helpful',
        keyMessages: ['Content organization', 'Topic exploration', 'Archive access']
      },
      required: false,
      order: 4
    },
    {
      componentId: 'newsletter-signup',
      defaultProps: {
        style: 'inline',
        showFrequency: true,
        showBenefits: true
      },
      aiHints: {
        contentTone: 'Valuable and non-intrusive',
        keyMessages: ['Stay updated', 'Exclusive content', 'No spam promise']
      },
      required: true,
      order: 5
    }
  ],
  defaultCustomization: {
    colors: {
      primary: '#1F2937',
      secondary: '#4B5563',
      accent: '#3B82F6',
      background: '#FFFFFF',
      text: '#111827'
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Source Serif Pro'
    },
    spacing: {
      padding: '2rem',
      margin: '1.5rem'
    },
    borderRadius: '0.25rem'
  },
  aiHints: {
    contentTone: 'Informative, engaging, and authoritative',
    targetAudience: 'Blog readers, industry professionals, knowledge seekers',
    keyMessages: [
      'High-quality, well-researched content',
      'Regular publishing schedule',
      'Expert insights and opinions',
      'Valuable takeaways for readers'
    ],
    preferredSections: [
      'latest articles',
      'popular content',
      'author bio',
      'content categories',
      'newsletter signup'
    ],
    seoKeywords: [
      'blog',
      'articles',
      'insights',
      'expert opinion',
      'industry news',
      'tutorials',
      'guides'
    ],
    callToActionStyle: 'friendly'
  },
  tags: ['blog', 'editorial', 'content', 'reading', 'minimal']
};