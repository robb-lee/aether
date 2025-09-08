/**
 * Component Schemas for AI Content Generation
 * 
 * Isolated Zod schemas without importing client components
 * This prevents "useState in server component" errors
 */

import { z } from 'zod';

// Navigation item schema for headers
const NavigationItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  active: z.boolean().optional()
});

// Header Simple Schema
export const HeaderSimplePropsSchema = z.object({
  logo: z.string().optional(),
  logoText: z.string(),
  navigation: z.array(NavigationItemSchema),
  style: z.enum(['minimal', 'professional', 'modern']).default('minimal'),
  transparent: z.boolean().default(false),
  className: z.string().optional()
});

// Pricing Table Schema
export const PricingTablePropsSchema = z.object({
  title: z.string().default("Choose Your Plan"),
  subtitle: z.string().default("Flexible pricing for teams of all sizes"),
  currency: z.string().default("$"),
  plans: z.array(z.object({
    name: z.string(),
    price: z.string(),
    period: z.string().optional(),
    description: z.string(),
    features: z.array(z.string()),
    highlighted: z.boolean().optional(),
    ctaText: z.string().optional()
  })).optional(),
  className: z.string().optional()
});

// Testimonials Slider Schema
export const TestimonialsSliderPropsSchema = z.object({
  title: z.string().default("What Our Customers Say"),
  subtitle: z.string().optional(),
  testimonials: z.array(z.object({
    name: z.string(),
    company: z.string().optional(),
    role: z.string().optional(),
    content: z.string(),
    rating: z.number().min(1).max(5).optional(),
    avatar: z.string().optional()
  })),
  autoplay: z.boolean().default(true),
  showRating: z.boolean().default(true),
  className: z.string().optional()
});

// Stats Section Schema
export const StatsSectionPropsSchema = z.object({
  title: z.string().default("Our Impact"),
  subtitle: z.string().optional(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
    description: z.string().optional()
  })),
  layout: z.enum(['grid', 'inline']).default('grid'),
  className: z.string().optional()
});

// Team Grid Schema
export const TeamGridPropsSchema = z.object({
  title: z.string().default("Meet Our Team"),
  subtitle: z.string().optional(),
  members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    social: z.object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      github: z.string().optional()
    }).optional()
  })),
  columns: z.enum(['2', '3', '4']).default('3'),
  className: z.string().optional()
});

// Portfolio Gallery Schema
export const PortfolioGalleryPropsSchema = z.object({
  title: z.string().default("Our Work"),
  subtitle: z.string().optional(),
  projects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    category: z.string(),
    url: z.string().optional(),
    tags: z.array(z.string()).optional()
  })),
  categories: z.array(z.string()).optional(),
  columns: z.enum(['2', '3', '4']).default('3'),
  className: z.string().optional()
});

// Blog Grid Schema
export const BlogGridPropsSchema = z.object({
  title: z.string().default("Latest Articles"),
  subtitle: z.string().optional(),
  posts: z.array(z.object({
    title: z.string(),
    excerpt: z.string(),
    image: z.string().optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    date: z.string(),
    readTime: z.string().optional(),
    url: z.string()
  })),
  columns: z.enum(['1', '2', '3']).default('2'),
  showAuthor: z.boolean().default(true),
  showCategory: z.boolean().default(true),
  className: z.string().optional()
});

// FAQ Section Schema
export const FAQSectionPropsSchema = z.object({
  title: z.string().default("Frequently Asked Questions"),
  subtitle: z.string().optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })),
  searchable: z.boolean().default(false),
  defaultOpen: z.number().optional(),
  className: z.string().optional()
});

// Timeline Schema
export const TimelinePropsSchema = z.object({
  title: z.string().default("Our Journey"),
  subtitle: z.string().optional(),
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    milestone: z.boolean().optional()
  })),
  orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
  className: z.string().optional()
});

// Contact Form Schema
export const ContactFormPropsSchema = z.object({
  title: z.string().default("Get In Touch"),
  subtitle: z.string().optional(),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'email', 'textarea', 'select']),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional()
  })).optional(),
  submitText: z.string().default("Send Message"),
  successMessage: z.string().default("Thank you! We'll get back to you soon."),
  className: z.string().optional()
});

// Export all schemas in a mapping
export const COMPONENT_SCHEMAS = {
  'header-simple': HeaderSimplePropsSchema,
  'pricing-table': PricingTablePropsSchema,
  'testimonials-slider': TestimonialsSliderPropsSchema,
  'stats-section': StatsSectionPropsSchema,
  'team-grid': TeamGridPropsSchema,
  'portfolio-gallery': PortfolioGalleryPropsSchema,
  'blog-grid': BlogGridPropsSchema,
  'faq-section': FAQSectionPropsSchema,
  'timeline': TimelinePropsSchema,
  'contact-form': ContactFormPropsSchema,
} as const;