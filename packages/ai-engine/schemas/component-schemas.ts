/**
 * Component Schemas for AI Content Generation
 * 
 * Isolated Zod schemas without importing client components
 * This prevents "useState in server component" errors
 */

import { z } from 'zod';

/**
 * Example JSON structures for AI prompts
 * These help ensure AI generates properly formatted content
 */
export const EXAMPLE_COMPONENT_JSONS = {
  'pricing-table': {
    "title": "Choose Your Plan",
    "subtitle": "Flexible pricing for teams of all sizes",
    "currency": "$",
    "plans": [
      {
        "name": "Starter",
        "price": "29",
        "period": "month",
        "description": "Perfect for small teams",
        "features": ["Basic features", "Email support", "5 projects"],
        "ctaText": "Get Started"
      },
      {
        "name": "Professional",
        "price": "99",
        "period": "month",
        "description": "Best for growing businesses",
        "features": ["Advanced features", "Priority support", "Unlimited projects", "Analytics"],
        "highlighted": true,
        "ctaText": "Start Free Trial"
      },
      {
        "name": "Enterprise",
        "price": "299",
        "period": "month",
        "description": "For large organizations",
        "features": ["All features", "24/7 support", "Custom integrations", "Dedicated manager"],
        "ctaText": "Contact Sales"
      }
    ]
  },
  'testimonials-slider': {
    "title": "What Our Customers Say",
    "subtitle": "Trusted by thousands of businesses",
    "testimonials": [
      {
        "name": "Sarah Johnson",
        "company": "Tech Innovators Inc",
        "role": "CEO",
        "content": "This solution transformed our business operations completely.",
        "rating": 5
      },
      {
        "name": "Michael Chen",
        "company": "Growth Partners",
        "role": "Marketing Director",
        "content": "Outstanding results and exceptional customer support.",
        "rating": 5
      }
    ]
  },
  'stats-section': {
    "title": "Our Impact",
    "subtitle": "Proven results that speak for themselves",
    "stats": [
      {
        "value": "10,000+",
        "label": "Happy Customers",
        "description": "Businesses worldwide trust our platform"
      },
      {
        "value": "99.9%",
        "label": "Uptime Guarantee",
        "description": "Rock-solid reliability you can count on"
      },
      {
        "value": "24/7",
        "label": "Support Available",
        "description": "Get help whenever you need it"
      },
      {
        "value": "5 Years",
        "label": "Industry Experience",
        "description": "Deep expertise in our field"
      }
    ]
  },
  'team-grid': {
    "title": "Meet Our Team",
    "subtitle": "The experts behind our success",
    "members": [
      {
        "name": "Alex Rodriguez",
        "role": "Chief Technology Officer",
        "bio": "Leading our technical vision with over 15 years of experience in software development.",
        "avatar": "team-alex"
      },
      {
        "name": "Emma Thompson",
        "role": "Head of Design",
        "bio": "Creating beautiful, user-centered experiences that drive results for our clients.",
        "avatar": "team-emma"
      }
    ]
  },
  'faq-section': {
    "title": "Frequently Asked Questions",
    "subtitle": "Everything you need to know",
    "faqs": [
      {
        "question": "How do I get started with your platform?",
        "answer": "Simply sign up for a free account and follow our onboarding guide to start using our platform immediately."
      },
      {
        "question": "What kind of support do you offer?",
        "answer": "We provide 24/7 customer support via email, chat, and phone for all our customers."
      },
      {
        "question": "Can I upgrade or downgrade my plan anytime?",
        "answer": "Yes, you can change your plan at any time. Changes take effect immediately and billing is prorated."
      }
    ]
  }
} as const;

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

// Pricing Table Schema - STRICT validation to prevent undefined values
export const PricingTablePropsSchema = z.object({
  title: z.string().default("Choose Your Plan"),
  subtitle: z.string().default("Flexible pricing for teams of all sizes"),
  currency: z.string().default("$"),
  plans: z.array(z.object({
    name: z.string().min(1, "Plan name is required"),
    price: z.string().min(1, "Price is required"), // MUST NOT be undefined
    period: z.string().default("month"),
    description: z.string().min(1, "Description is required"), // MUST NOT be undefined
    features: z.array(z.string().min(1)).min(1, "At least one feature required"),
    highlighted: z.boolean().optional(),
    ctaText: z.string().default("Get Started")
  })).min(1, "At least one plan required"),
  className: z.string().optional()
});

// Testimonials Slider Schema - STRICT validation to prevent undefined values
export const TestimonialsSliderPropsSchema = z.object({
  title: z.string().default("What Our Customers Say"),
  subtitle: z.string().optional(),
  testimonials: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    company: z.string().optional(),
    role: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    rating: z.number().min(1).max(5).optional(),
    avatar: z.string().optional()
  })).min(1, "At least one testimonial required"),
  autoplay: z.boolean().default(true),
  showRating: z.boolean().default(true),
  className: z.string().optional()
});

// Stats Section Schema - STRICT validation to prevent undefined values
export const StatsSectionPropsSchema = z.object({
  title: z.string().default("Our Impact"),
  subtitle: z.string().optional(),
  stats: z.array(z.object({
    value: z.string().min(1, "Value is required"), // MUST NOT be undefined
    label: z.string().min(1, "Label is required"), // MUST NOT be undefined
    description: z.string().optional()
  })).min(1, "At least one stat required"),
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

/**
 * Get example JSON for a component to include in AI prompts
 */
export function getExampleJSON(componentId: string): string {
  const example = EXAMPLE_COMPONENT_JSONS[componentId as keyof typeof EXAMPLE_COMPONENT_JSONS];
  return example ? JSON.stringify(example, null, 2) : 'No example available';
}