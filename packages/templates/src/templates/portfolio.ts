import { Template } from '../types/template';

export const portfolioTemplate: Template = {
  id: 'portfolio-creative',
  name: 'Creative Portfolio',
  description: 'Elegant portfolio template for designers, developers, and creatives',
  industry: 'portfolio',
  sections: [
    {
      componentId: 'hero-centered',
      defaultProps: {
        layout: 'centered',
        size: 'large',
        showAvatar: true
      },
      aiHints: {
        contentTone: 'Personal and inspiring',
        targetAudience: 'Potential clients and employers',
        keyMessages: ['Unique skills', 'Creative vision', 'Professional experience'],
        preferredSections: ['personal introduction', 'skills highlight', 'contact invitation']
      },
      required: true,
      order: 1
    },
    {
      componentId: 'about-split',
      defaultProps: {
        layout: 'imageLeft',
        showSkills: true,
        showExperience: true
      },
      aiHints: {
        contentTone: 'Professional yet personal',
        keyMessages: ['Background story', 'Professional journey', 'Core values']
      },
      required: true,
      order: 2
    },
    {
      componentId: 'portfolio-grid',
      defaultProps: {
        columns: 2,
        showCategories: true,
        hoverEffect: true
      },
      aiHints: {
        contentTone: 'Descriptive and engaging',
        keyMessages: ['Project showcase', 'Technical skills', 'Creative solutions']
      },
      required: true,
      order: 3
    },
    {
      componentId: 'skills-badges',
      defaultProps: {
        layout: 'grid',
        showLevels: true,
        animated: true
      },
      aiHints: {
        contentTone: 'Confident and specific',
        keyMessages: ['Technical expertise', 'Tool proficiency', 'Years of experience']
      },
      required: false,
      order: 4
    },
    {
      componentId: 'contact-form',
      defaultProps: {
        style: 'minimal',
        showSocial: true,
        includeBudget: false
      },
      aiHints: {
        contentTone: 'Welcoming and professional',
        keyMessages: ['Easy contact', 'Available for projects', 'Response time']
      },
      required: true,
      order: 5
    }
  ],
  defaultCustomization: {
    colors: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#EC4899',
      background: '#FAFAFA',
      text: '#111827'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Source Sans Pro'
    },
    spacing: {
      padding: '2rem',
      margin: '1.5rem'
    },
    borderRadius: '0.75rem'
  },
  aiHints: {
    contentTone: 'Creative, personal, and professionally confident',
    targetAudience: 'Potential clients, employers, collaborators, and industry peers',
    keyMessages: [
      'Unique creative vision and approach',
      'Proven track record of successful projects',
      'Strong technical skills and expertise',
      'Passionate about quality and innovation'
    ],
    preferredSections: [
      'personal introduction',
      'project showcase',
      'skills and expertise',
      'professional background',
      'contact and availability'
    ],
    seoKeywords: [
      'creative portfolio',
      'designer',
      'developer',
      'freelancer',
      'creative professional',
      'web design',
      'ui ux design'
    ],
    callToActionStyle: 'friendly'
  },
  tags: ['portfolio', 'creative', 'personal', 'showcase', 'minimal']
};