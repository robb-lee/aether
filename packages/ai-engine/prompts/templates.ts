/**
 * Template Library for Website Generation
 * 
 * Industry-specific templates and component structures
 * Based on prompt.md template specifications
 */

/**
 * Base template interface
 */
export interface SiteTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  sections: SectionTemplate[];
  defaultStyle: StylePreset;
  seoKeywords: string[];
  targetAudience: string;
}

export interface SectionTemplate {
  id: string;
  type: string;
  name: string;
  components: ComponentTemplate[];
  order: number;
  required: boolean;
}

export interface ComponentTemplate {
  type: string;
  props: Record<string, any>;
  content?: ContentTemplate;
  children?: ComponentTemplate[];
}

export interface ContentTemplate {
  headline?: string;
  subheadline?: string;
  body?: string;
  cta?: string;
  placeholders?: Record<string, string>;
}

export interface StylePreset {
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: string;
  };
  spacing: string;
  borderRadius: string;
  shadows: string;
}

/**
 * SaaS Landing Page Template
 */
export const saasTemplate: SiteTemplate = {
  id: 'saas-landing',
  name: 'SaaS Landing Page',
  description: 'Conversion-optimized landing page for SaaS products',
  industry: 'saas',
  seoKeywords: ['software', 'solution', 'platform', 'productivity', 'cloud'],
  targetAudience: 'B2B decision makers, tech-savvy professionals',
  defaultStyle: {
    colorScheme: {
      primary: '#3b82f6', // Blue
      secondary: '#1e293b', // Dark
      accent: '#8b5cf6', // Purple
      background: '#ffffff',
      text: '#334155'
    },
    typography: {
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      scale: '1.250' // Major third
    },
    spacing: '8px',
    borderRadius: '8px',
    shadows: 'subtle'
  },
  sections: [
    {
      id: 'hero',
      type: 'hero',
      name: 'Hero Section',
      order: 1,
      required: true,
      components: [
        {
          type: 'container',
          props: { maxWidth: '7xl', padding: 'lg' },
          children: [
            {
              type: 'heading',
              props: { level: 1, size: '5xl', weight: 'bold' },
              content: {
                headline: '{product_name}: {value_proposition}',
                placeholders: {
                  product_name: 'Your Product Name',
                  value_proposition: 'Transform Your Workflow'
                }
              }
            },
            {
              type: 'text',
              props: { size: 'xl', color: 'muted' },
              content: {
                body: '{product_description}',
                placeholders: {
                  product_description: 'Streamline your business processes with our powerful, intuitive platform.'
                }
              }
            },
            {
              type: 'button-group',
              props: { spacing: 'md' },
              children: [
                {
                  type: 'button',
                  props: { variant: 'primary', size: 'lg' },
                  content: { cta: 'Start Free Trial' }
                },
                {
                  type: 'button',
                  props: { variant: 'outline', size: 'lg' },
                  content: { cta: 'Watch Demo' }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'features',
      type: 'features',
      name: 'Features Section',
      order: 2,
      required: true,
      components: [
        {
          type: 'container',
          props: { maxWidth: '7xl' },
          children: [
            {
              type: 'section-header',
              props: { align: 'center' },
              content: {
                headline: 'Everything you need to {achieve_goal}',
                subheadline: 'Powerful features designed for modern teams',
                placeholders: {
                  achieve_goal: 'scale your business'
                }
              }
            },
            {
              type: 'feature-grid',
              props: { columns: 3, gap: 'lg' },
              children: [
                {
                  type: 'feature-card',
                  props: { icon: 'lightning' },
                  content: {
                    headline: 'Lightning Fast',
                    body: 'Built for speed with optimized performance at every level.'
                  }
                },
                {
                  type: 'feature-card',
                  props: { icon: 'shield' },
                  content: {
                    headline: 'Enterprise Security',
                    body: 'Bank-level encryption and compliance with industry standards.'
                  }
                },
                {
                  type: 'feature-card',
                  props: { icon: 'chart' },
                  content: {
                    headline: 'Advanced Analytics',
                    body: 'Real-time insights to make data-driven decisions.'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'pricing',
      type: 'pricing',
      name: 'Pricing Section',
      order: 3,
      required: true,
      components: [
        {
          type: 'pricing-table',
          props: { columns: 3, highlight: 'middle' },
          children: [
            {
              type: 'pricing-card',
              props: { tier: 'starter' },
              content: {
                headline: 'Starter',
                subheadline: '$29/month',
                body: 'Perfect for small teams'
              }
            },
            {
              type: 'pricing-card',
              props: { tier: 'professional', featured: true },
              content: {
                headline: 'Professional',
                subheadline: '$79/month',
                body: 'For growing businesses'
              }
            },
            {
              type: 'pricing-card',
              props: { tier: 'enterprise' },
              content: {
                headline: 'Enterprise',
                subheadline: 'Custom',
                body: 'Tailored solutions'
              }
            }
          ]
        }
      ]
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      name: 'Testimonials Section',
      order: 4,
      required: false,
      components: [
        {
          type: 'testimonial-carousel',
          props: { autoplay: true, interval: 5000 },
          children: []
        }
      ]
    },
    {
      id: 'cta',
      type: 'cta',
      name: 'Call to Action',
      order: 5,
      required: true,
      components: [
        {
          type: 'cta-section',
          props: { variant: 'gradient', align: 'center' },
          content: {
            headline: 'Ready to get started?',
            subheadline: 'Join thousands of satisfied customers',
            cta: 'Start Your Free Trial'
          }
        }
      ]
    }
  ]
};

/**
 * E-commerce Template
 */
export const ecommerceTemplate: SiteTemplate = {
  id: 'ecommerce',
  name: 'E-commerce Store',
  description: 'Online store optimized for conversions',
  industry: 'ecommerce',
  seoKeywords: ['shop', 'store', 'buy', 'products', 'online'],
  targetAudience: 'Online shoppers, retail customers',
  defaultStyle: {
    colorScheme: {
      primary: '#f97316', // Orange
      secondary: '#1e293b',
      accent: '#10b981', // Green
      background: '#ffffff',
      text: '#334155'
    },
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Inter, sans-serif',
      scale: '1.333'
    },
    spacing: '8px',
    borderRadius: '4px',
    shadows: 'medium'
  },
  sections: [
    {
      id: 'hero',
      type: 'hero-slider',
      name: 'Hero Slider',
      order: 1,
      required: true,
      components: [
        {
          type: 'image-slider',
          props: { height: 'lg', autoplay: true },
          children: []
        }
      ]
    },
    {
      id: 'categories',
      type: 'categories',
      name: 'Product Categories',
      order: 2,
      required: true,
      components: [
        {
          type: 'category-grid',
          props: { columns: 4, style: 'cards' },
          children: []
        }
      ]
    },
    {
      id: 'featured',
      type: 'products',
      name: 'Featured Products',
      order: 3,
      required: true,
      components: [
        {
          type: 'product-grid',
          props: { columns: 4, showPrice: true, showRating: true },
          children: []
        }
      ]
    },
    {
      id: 'deals',
      type: 'deals',
      name: 'Special Deals',
      order: 4,
      required: false,
      components: [
        {
          type: 'deal-banner',
          props: { variant: 'countdown' },
          content: {
            headline: 'Limited Time Offer',
            subheadline: 'Up to 50% off selected items'
          }
        }
      ]
    }
  ]
};

/**
 * Portfolio Template
 */
export const portfolioTemplate: SiteTemplate = {
  id: 'portfolio',
  name: 'Portfolio Website',
  description: 'Showcase your work and skills',
  industry: 'portfolio',
  seoKeywords: ['portfolio', 'work', 'projects', 'creative', 'designer'],
  targetAudience: 'Potential clients, employers, collaborators',
  defaultStyle: {
    colorScheme: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#ef4444', // Red accent
      background: '#fafafa',
      text: '#171717'
    },
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Inter, sans-serif',
      scale: '1.414' // Augmented fourth
    },
    spacing: '16px',
    borderRadius: '0px',
    shadows: 'none'
  },
  sections: [
    {
      id: 'hero',
      type: 'hero-minimal',
      name: 'Hero Introduction',
      order: 1,
      required: true,
      components: [
        {
          type: 'hero-text',
          props: { variant: 'minimal', align: 'left' },
          content: {
            headline: '{your_name}',
            subheadline: '{your_title}',
            body: '{brief_intro}',
            placeholders: {
              your_name: 'John Doe',
              your_title: 'Creative Developer',
              brief_intro: 'Crafting digital experiences with passion and precision.'
            }
          }
        }
      ]
    },
    {
      id: 'work',
      type: 'portfolio-grid',
      name: 'Work Gallery',
      order: 2,
      required: true,
      components: [
        {
          type: 'masonry-grid',
          props: { columns: 'auto', gap: 'md' },
          children: []
        }
      ]
    },
    {
      id: 'about',
      type: 'about',
      name: 'About Section',
      order: 3,
      required: true,
      components: [
        {
          type: 'about-content',
          props: { layout: 'split' },
          children: []
        }
      ]
    },
    {
      id: 'contact',
      type: 'contact',
      name: 'Contact Form',
      order: 4,
      required: true,
      components: [
        {
          type: 'contact-form',
          props: { fields: ['name', 'email', 'message'] },
          content: {
            headline: "Let's work together",
            subheadline: 'Get in touch for collaborations'
          }
        }
      ]
    }
  ]
};

/**
 * Template collection
 */
export const templates = {
  saas: saasTemplate,
  ecommerce: ecommerceTemplate,
  portfolio: portfolioTemplate,
  // Additional templates can be added here
  corporate: {
    id: 'corporate',
    name: 'Corporate Website',
    description: 'Professional corporate presence',
    industry: 'corporate',
    // ... simplified for brevity
  } as SiteTemplate,
  blog: {
    id: 'blog',
    name: 'Blog Platform',
    description: 'Content-focused blog layout',
    industry: 'blog',
    // ... simplified for brevity
  } as SiteTemplate,
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant Website',
    description: 'Appetizing restaurant presentation',
    industry: 'restaurant',
    // ... simplified for brevity
  } as SiteTemplate
};

/**
 * Get template by industry or ID
 */
export function getTemplate(identifier: string): SiteTemplate | undefined {
  return templates[identifier as keyof typeof templates] || 
         Object.values(templates).find(t => t.id === identifier);
}

/**
 * Get template sections
 */
export function getTemplateSections(templateId: string): SectionTemplate[] {
  const template = getTemplate(templateId);
  return template ? template.sections : [];
}

/**
 * Generate template-based prompt enhancement
 */
export function getTemplatePrompt(templateId: string): string {
  const template = getTemplate(templateId);
  if (!template) return '';

  return `
Using ${template.name} template:
- Industry: ${template.industry}
- Target Audience: ${template.targetAudience}
- Key Sections: ${template.sections.map(s => s.name).join(', ')}
- SEO Focus: ${template.seoKeywords.join(', ')}
- Style: ${JSON.stringify(template.defaultStyle.colorScheme)}
`;
}

/**
 * Merge user requirements with template
 */
export function mergeWithTemplate(
  templateId: string,
  userRequirements: Partial<SiteTemplate>
): SiteTemplate | null {
  const baseTemplate = getTemplate(templateId);
  if (!baseTemplate) return null;

  return {
    ...baseTemplate,
    ...userRequirements,
    sections: userRequirements.sections || baseTemplate.sections,
    defaultStyle: {
      ...baseTemplate.defaultStyle,
      ...(userRequirements.defaultStyle || {})
    }
  };
}