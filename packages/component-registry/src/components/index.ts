import { createComponent } from '../registry';
import { ComponentDefinition } from '../types/component';

// Hero Components
import HeroCentered, { HeroCenteredPropsSchema } from './hero/HeroCentered';
import HeroSplit, { HeroSplitPropsSchema } from './hero/HeroSplit';
import HeroVideoBg, { HeroVideoBgPropsSchema } from './hero/HeroVideoBg';

// Features Components  
import FeaturesGrid, { FeaturesGridPropsSchema } from './features/FeaturesGrid';

// New Components
import TestimonialsSlider, { TestimonialsSliderPropsSchema } from './testimonials/TestimonialsSlider';
import PricingTable, { PricingTablePropsSchema } from './pricing/PricingTable';
import TeamGrid, { TeamGridPropsSchema } from './team/TeamGrid';
import PortfolioGallery, { PortfolioGalleryPropsSchema } from './gallery/PortfolioGallery';
import ContactForm, { ContactFormPropsSchema } from './contact/ContactForm';
import FAQSection, { FAQSectionPropsSchema } from './faq/FAQSection';
import StatsSection, { StatsSectionPropsSchema } from './stats/StatsSection';
import BlogGrid, { BlogGridPropsSchema } from './blog/BlogGrid';
import Timeline, { TimelinePropsSchema } from './timeline/Timeline';

/**
 * Core component definitions with metadata
 */
export const CORE_COMPONENTS: ComponentDefinition[] = [
  // Hero Components
  createComponent({
    id: 'hero-centered',
    name: 'Hero Centered',
    category: 'hero',
    component: HeroCentered,
    propsSchema: HeroCenteredPropsSchema,
    defaultProps: {
      title: 'Transform Your Business',
      description: 'Powerful solutions for modern challenges',
      ctaText: 'Get Started',
      variant: 'center',
      style: 'minimal',
      animation: 'fade-in'
    },
    metadata: {
      description: 'Centered hero section perfect for product showcases and focused messaging',
      tags: ['hero', 'centered', 'showcase', 'focus'],
      performance: {
        lighthouse: 95,
        bundleSize: 8.5,
        renderTime: 45,
        cls: 0.05,
        fcp: 1.2,
        lcp: 1.8
      },
      accessibility: {
        wcagLevel: 'AAA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 7.2,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 1250,
        successRate: 0.89,
        conversionRate: 0.14,
        industries: ['ecommerce', 'portfolio', 'agency'],
        popularCombinations: ['features-cards', 'testimonials-carousel', 'footer-simple'],
        averageProps: {
          variant: 'center',
          style: 'minimal'
        }
      },
      aiHints: {
        industries: ['ecommerce', 'portfolio', 'agency', 'creative'],
        useCases: ['product showcase', 'personal branding', 'creative services'],
        keywords: ['centered', 'focus', 'attention', 'showcase', 'product'],
        avoidWhen: ['complex information', 'multiple CTAs', 'feature-heavy']
      }
    }
  }),

  createComponent({
    id: 'hero-split',
    name: 'Hero Split',
    category: 'hero',
    component: HeroSplit,
    propsSchema: HeroSplitPropsSchema,
    defaultProps: {
      title: 'Revolutionize Your Workflow',
      description: 'Advanced features designed for modern teams',
      ctaText: 'Start Free Trial',
      layout: 'left-content',
      style: 'modern',
      animation: 'slide-in',
      showDemo: false
    },
    metadata: {
      description: 'Split layout hero perfect for SaaS and tech products needing feature explanation',
      tags: ['hero', 'split', 'saas', 'tech', 'explanation'],
      performance: {
        lighthouse: 92,
        bundleSize: 12.3,
        renderTime: 65,
        cls: 0.08,
        fcp: 1.4,
        lcp: 2.1
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.8,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 2890,
        successRate: 0.94,
        conversionRate: 0.18,
        industries: ['saas', 'tech', 'startup', 'b2b'],
        popularCombinations: ['features-grid', 'pricing-comparison', 'header-with-cta'],
        averageProps: {
          layout: 'left-content',
          style: 'modern',
          showDemo: true
        }
      },
      aiHints: {
        industries: ['saas', 'tech', 'startup', 'b2b', 'software'],
        useCases: ['software products', 'tech services', 'platform launches', 'feature explanation'],
        keywords: ['split', 'feature', 'explanation', 'demo', 'saas', 'platform'],
        avoidWhen: ['simple branding', 'pure content sites', 'minimal design preference']
      }
    }
  }),

  createComponent({
    id: 'hero-video-bg',
    name: 'Hero Video Background',
    category: 'hero',
    component: HeroVideoBg,
    propsSchema: HeroVideoBgPropsSchema,
    defaultProps: {
      title: 'Experience the Future',
      description: 'Immersive storytelling for your brand',
      ctaText: 'Watch Demo',
      layout: 'overlay-center',
      style: 'cinematic',
      animation: 'video-fade',
      autoplay: true,
      muted: true,
      loop: true
    },
    metadata: {
      description: 'Video background hero perfect for entertainment and lifestyle brands',
      tags: ['hero', 'video', 'background', 'cinematic', 'storytelling'],
      performance: {
        lighthouse: 75,
        bundleSize: 25.8,
        renderTime: 180,
        cls: 0.15,
        fcp: 2.2,
        lcp: 3.5
      },
      accessibility: {
        wcagLevel: 'A',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: false,
        colorContrast: 4.1,
        focusManagement: true
      },
      compatibility: {
        mobile: false, // Video backgrounds not ideal for mobile
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 450,
        successRate: 0.72,
        conversionRate: 0.09,
        industries: ['entertainment', 'events', 'lifestyle', 'travel'],
        popularCombinations: ['features-cards', 'testimonials-carousel', 'footer-newsletter'],
        averageProps: {
          layout: 'overlay-center',
          style: 'cinematic',
          autoplay: false // Most users prefer manual play
        }
      },
      aiHints: {
        industries: ['entertainment', 'events', 'lifestyle', 'travel', 'media'],
        useCases: ['event promotion', 'brand storytelling', 'lifestyle products', 'immersive experience'],
        keywords: ['video', 'dynamic', 'engaging', 'storytelling', 'cinematic', 'immersive'],
        avoidWhen: ['performance critical', 'accessibility focus', 'mobile-first', 'fast loading needed']
      }
    }
  }),

  createComponent({
    id: 'features-grid',
    name: 'Features Grid',
    category: 'features',
    component: FeaturesGrid,
    propsSchema: FeaturesGridPropsSchema,
    defaultProps: {
      title: 'Powerful Features',
      features: [
        { title: 'Fast & Reliable', description: 'Built for performance and stability' },
        { title: 'Easy to Use', description: 'Intuitive interface designed for everyone' },
        { title: 'Secure by Default', description: 'Enterprise-grade security out of the box' }
      ],
      layout: '3-col',
      style: 'cards',
      animation: 'stagger-up'
    },
    metadata: {
      description: 'Grid layout for showcasing multiple features with equal importance',
      tags: ['features', 'grid', 'showcase', 'organized'],
      performance: {
        lighthouse: 93,
        bundleSize: 15.2,
        renderTime: 85,
        cls: 0.06,
        fcp: 1.3,
        lcp: 2.0
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.5,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 3450,
        successRate: 0.91,
        conversionRate: 0.16,
        industries: ['saas', 'tech', 'software', 'platform'],
        popularCombinations: ['hero-split', 'pricing-comparison', 'testimonials-cards'],
        averageProps: {
          layout: '3-col',
          style: 'cards',
          featureCount: 6
        }
      },
      aiHints: {
        industries: ['saas', 'tech', 'software', 'platform', 'startup'],
        useCases: ['feature overview', 'service listing', 'capability showcase', 'product benefits'],
        keywords: ['features', 'grid', 'organized', 'comprehensive', 'overview'],
        avoidWhen: ['single key feature', 'narrative flow needed', 'minimal design']
      }
    }
  }),

  // Testimonials Components
  createComponent({
    id: 'testimonials-slider',
    name: 'Testimonials Slider',
    category: 'testimonials',
    component: TestimonialsSlider,
    propsSchema: TestimonialsSliderPropsSchema,
    defaultProps: {
      title: 'What Our Customers Say',
      testimonials: []
    },
    metadata: {
      description: 'Customer testimonials in a sliding carousel format',
      tags: ['testimonials', 'slider', 'reviews', 'carousel'],
      performance: {
        lighthouse: 90,
        bundleSize: 12.3,
        renderTime: 150,
        cls: 0.05,
        fcp: 1.1,
        lcp: 2.0
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.5,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 750,
        successRate: 0.92,
        conversionRate: 0.15,
        industries: ['saas', 'ecommerce', 'service'],
        popularCombinations: ['hero-split', 'pricing-table'],
        averageProps: {
          autoSlide: true,
          slideInterval: 5000
        }
      },
      aiHints: {
        industries: ['saas', 'ecommerce', 'service', 'agency'],
        useCases: ['social proof', 'customer reviews', 'trust building'],
        keywords: ['testimonials', 'reviews', 'customers', 'feedback'],
        avoidWhen: ['portfolio', 'blog']
      }
    }
  }),

  createComponent({
    id: 'pricing-table',
    name: 'Pricing Table',
    category: 'pricing',
    component: PricingTable,
    propsSchema: PricingTablePropsSchema,
    defaultProps: {
      title: 'Choose Your Plan',
      plans: []
    },
    metadata: {
      description: 'Professional pricing table with highlighted plans and features',
      tags: ['pricing', 'plans', 'subscription', 'tiers'],
      performance: {
        lighthouse: 94,
        bundleSize: 9.8,
        renderTime: 100,
        cls: 0.02,
        fcp: 0.8,
        lcp: 1.5
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 5.1,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 890,
        successRate: 0.91,
        conversionRate: 0.28,
        industries: ['saas', 'software', 'service'],
        popularCombinations: ['hero-split', 'testimonials-slider', 'faq-section'],
        averageProps: {
          highlightIndex: 1,
          showAnnualDiscount: true
        }
      },
      aiHints: {
        industries: ['saas', 'software', 'service', 'app'],
        useCases: ['subscription pricing', 'service tiers', 'plan comparison'],
        keywords: ['pricing', 'plans', 'subscription', 'cost', 'packages'],
        avoidWhen: ['portfolio', 'blog', 'nonprofit']
      }
    }
  }),

  createComponent({
    id: 'team-grid',
    name: 'Team Grid',
    category: 'team',
    component: TeamGrid,
    propsSchema: TeamGridPropsSchema,
    defaultProps: {
      title: 'Meet Our Team',
      members: []
    },
    metadata: {
      description: 'Team member showcase with photos and social links',
      tags: ['team', 'about', 'people', 'staff'],
      performance: {
        lighthouse: 88,
        bundleSize: 7.4,
        renderTime: 110,
        cls: 0.08,
        fcp: 1.0,
        lcp: 1.7
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.8,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 420,
        successRate: 0.89,
        conversionRate: 0.05,
        industries: ['agency', 'consulting', 'startup'],
        popularCombinations: ['hero-centered', 'contact-form'],
        averageProps: {
          layout: 'grid',
          showSocial: true
        }
      },
      aiHints: {
        industries: ['agency', 'consulting', 'startup', 'service'],
        useCases: ['about page', 'team showcase', 'company intro'],
        keywords: ['team', 'people', 'staff', 'about', 'leadership'],
        avoidWhen: ['ecommerce', 'product-focused']
      }
    }
  }),

  createComponent({
    id: 'portfolio-gallery',
    name: 'Portfolio Gallery',
    category: 'gallery',
    component: PortfolioGallery,
    propsSchema: PortfolioGalleryPropsSchema,
    defaultProps: {
      title: 'Our Work',
      items: []
    },
    metadata: {
      description: 'Masonry-style portfolio gallery with filtering',
      tags: ['portfolio', 'gallery', 'projects', 'work'],
      performance: {
        lighthouse: 86,
        bundleSize: 15.2,
        renderTime: 180,
        cls: 0.12,
        fcp: 1.3,
        lcp: 2.2
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.7,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 340,
        successRate: 0.87,
        conversionRate: 0.06,
        industries: ['agency', 'portfolio', 'creative'],
        popularCombinations: ['hero-centered', 'team-grid'],
        averageProps: {
          showFilters: true,
          categories: ['All']
        }
      },
      aiHints: {
        industries: ['agency', 'portfolio', 'creative', 'design'],
        useCases: ['portfolio showcase', 'project gallery', 'work display'],
        keywords: ['portfolio', 'gallery', 'projects', 'work', 'showcase'],
        avoidWhen: ['saas', 'software', 'ecommerce']
      }
    }
  }),

  createComponent({
    id: 'contact-form',
    name: 'Contact Form',
    category: 'contact',
    component: ContactForm,
    propsSchema: ContactFormPropsSchema,
    defaultProps: {
      title: 'Get In Touch',
      includeMessage: true
    },
    metadata: {
      description: 'Professional contact form with validation and accessibility',
      tags: ['contact', 'form', 'communication'],
      performance: {
        lighthouse: 93,
        bundleSize: 11.5,
        renderTime: 130,
        cls: 0.04,
        fcp: 1.0,
        lcp: 1.6
      },
      accessibility: {
        wcagLevel: 'AAA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 6.2,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 1120,
        successRate: 0.95,
        conversionRate: 0.22,
        industries: ['service', 'agency', 'business'],
        popularCombinations: ['hero-split', 'team-grid'],
        averageProps: {
          includePhone: true,
          includeCompany: true
        }
      },
      aiHints: {
        industries: ['service', 'agency', 'business', 'consulting'],
        useCases: ['contact page', 'lead generation', 'inquiry form'],
        keywords: ['contact', 'form', 'message', 'inquiry', 'reach'],
        avoidWhen: ['ecommerce', 'blog']
      }
    }
  }),

  createComponent({
    id: 'faq-section',
    name: 'FAQ Section',
    category: 'faq',
    component: FAQSection,
    propsSchema: FAQSectionPropsSchema,
    defaultProps: {
      title: 'Frequently Asked Questions',
      faqs: []
    },
    metadata: {
      description: 'Expandable FAQ section with search and categories',
      tags: ['faq', 'questions', 'help', 'support'],
      performance: {
        lighthouse: 91,
        bundleSize: 8.9,
        renderTime: 95,
        cls: 0.03,
        fcp: 0.9,
        lcp: 1.4
      },
      accessibility: {
        wcagLevel: 'AAA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 5.8,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 560,
        successRate: 0.93,
        conversionRate: 0.11,
        industries: ['saas', 'service', 'support'],
        popularCombinations: ['contact-form', 'pricing-table'],
        averageProps: {
          showSearch: true,
          showCategories: false
        }
      },
      aiHints: {
        industries: ['saas', 'service', 'support', 'software'],
        useCases: ['help section', 'support page', 'common questions'],
        keywords: ['faq', 'questions', 'help', 'answers', 'support'],
        avoidWhen: ['portfolio', 'gallery']
      }
    }
  }),

  createComponent({
    id: 'stats-section',
    name: 'Stats Section',
    category: 'stats',
    component: StatsSection,
    propsSchema: StatsSectionPropsSchema,
    defaultProps: {
      title: 'Trusted by Thousands',
      stats: []
    },
    metadata: {
      description: 'Statistics display with animated counters',
      tags: ['stats', 'numbers', 'metrics', 'achievements'],
      performance: {
        lighthouse: 89,
        bundleSize: 6.7,
        renderTime: 85,
        cls: 0.02,
        fcp: 0.8,
        lcp: 1.3
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.9,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 670,
        successRate: 0.90,
        conversionRate: 0.09,
        industries: ['saas', 'business', 'startup'],
        popularCombinations: ['hero-split', 'testimonials-slider'],
        averageProps: {
          layout: 'grid',
          animated: true
        }
      },
      aiHints: {
        industries: ['saas', 'business', 'startup', 'enterprise'],
        useCases: ['credibility building', 'metrics display', 'achievements'],
        keywords: ['stats', 'numbers', 'metrics', 'growth', 'trusted'],
        avoidWhen: ['portfolio', 'personal']
      }
    }
  }),

  createComponent({
    id: 'blog-grid',
    name: 'Blog Grid',
    category: 'blog',
    component: BlogGrid,
    propsSchema: BlogGridPropsSchema,
    defaultProps: {
      title: 'Latest Articles',
      posts: []
    },
    metadata: {
      description: 'Blog posts grid with categories and filters',
      tags: ['blog', 'articles', 'content', 'news'],
      performance: {
        lighthouse: 87,
        bundleSize: 13.1,
        renderTime: 160,
        cls: 0.09,
        fcp: 1.2,
        lcp: 2.1
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.6,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 290,
        successRate: 0.85,
        conversionRate: 0.03,
        industries: ['blog', 'news', 'content'],
        popularCombinations: ['hero-centered', 'faq-section'],
        averageProps: {
          showCategories: true,
          postsPerPage: 6
        }
      },
      aiHints: {
        industries: ['blog', 'news', 'content', 'media'],
        useCases: ['blog section', 'content showcase', 'article display'],
        keywords: ['blog', 'articles', 'content', 'news', 'posts'],
        avoidWhen: ['ecommerce', 'pricing-focused']
      }
    }
  }),

  createComponent({
    id: 'timeline',
    name: 'Timeline',
    category: 'timeline',
    component: Timeline,
    propsSchema: TimelinePropsSchema,
    defaultProps: {
      title: 'Our Journey',
      items: []
    },
    metadata: {
      description: 'Vertical/horizontal timeline for milestones and processes',
      tags: ['timeline', 'history', 'milestones', 'process'],
      performance: {
        lighthouse: 90,
        bundleSize: 8.3,
        renderTime: 105,
        cls: 0.06,
        fcp: 1.0,
        lcp: 1.6
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 5.2,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 180,
        successRate: 0.88,
        conversionRate: 0.04,
        industries: ['business', 'startup', 'company'],
        popularCombinations: ['hero-split', 'team-grid'],
        averageProps: {
          orientation: 'vertical',
          animated: true
        }
      },
      aiHints: {
        industries: ['business', 'startup', 'company', 'nonprofit'],
        useCases: ['company history', 'process explanation', 'milestone display'],
        keywords: ['timeline', 'history', 'milestones', 'process', 'journey'],
        avoidWhen: ['ecommerce', 'portfolio']
      }
    }
  }),

  // Testimonials Components
  createComponent({
    id: 'testimonials-slider',
    name: 'Testimonials Slider',
    category: 'testimonials',
    component: TestimonialsSlider,
    propsSchema: TestimonialsSliderPropsSchema,
    defaultProps: {
      title: "What Our Customers Say",
      testimonials: [
        {
          name: "Sarah Chen",
          company: "TechFlow Inc",
          content: "This solution transformed our workflow. Highly recommended!",
          rating: 5
        }
      ],
      autoSlide: true,
      slideInterval: 5000
    },
    metadata: {
      description: 'Sliding testimonials carousel with customer reviews',
      tags: ['testimonials', 'slider', 'reviews', 'customers'],
      performance: {
        lighthouse: 90,
        bundleSize: 12.3,
        renderTime: 150,
        cls: 0.05,
        fcp: 1.1,
        lcp: 2.0
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.5,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 750,
        successRate: 0.92,
        conversionRate: 0.15,
        industries: ['saas', 'ecommerce', 'service'],
        popularCombinations: ['hero-split', 'pricing-table'],
        averageProps: {
          title: 'Customer Reviews',
          testimonials: []
        }
      },
      aiHints: {
        industries: ['saas', 'ecommerce', 'service', 'agency'],
        useCases: ['social proof', 'customer reviews', 'trust building'],
        keywords: ['testimonials', 'reviews', 'customers', 'feedback'],
        avoidWhen: ['portfolio', 'blog']
      }
    }
  }),

  // Pricing Components
  createComponent({
    id: 'pricing-table',
    name: 'Pricing Table',
    category: 'pricing',
    component: PricingTable,
    propsSchema: PricingTablePropsSchema,
    defaultProps: {
      title: "Choose Your Plan",
      subtitle: "Flexible pricing for teams of all sizes",
      currency: "$",
      plans: [
        {
          name: "Starter",
          price: "29",
          period: "month",
          description: "Perfect for small teams",
          features: ["Up to 5 users", "10GB storage", "Basic support"]
        }
      ]
    },
    metadata: {
      description: 'Professional 3-tier pricing table with highlighted plans',
      tags: ['pricing', 'plans', 'subscription', 'tiers'],
      performance: {
        lighthouse: 94,
        bundleSize: 9.8,
        renderTime: 100,
        cls: 0.02,
        fcp: 0.8,
        lcp: 1.5
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 5.1,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 890,
        successRate: 0.91,
        conversionRate: 0.28,
        industries: ['saas', 'software', 'service'],
        popularCombinations: ['hero-split', 'testimonials-slider', 'faq-section'],
        averageProps: {
          title: 'Pricing Plans',
          plans: []
        }
      },
      aiHints: {
        industries: ['saas', 'software', 'service', 'app'],
        useCases: ['subscription pricing', 'service tiers', 'plan comparison'],
        keywords: ['pricing', 'plans', 'subscription', 'cost', 'packages'],
        avoidWhen: ['portfolio', 'blog', 'nonprofit']
      }
    }
  }),

  // Team Components
  createComponent({
    id: 'team-grid',
    name: 'Team Grid',
    category: 'team',
    component: TeamGrid,
    propsSchema: TeamGridPropsSchema,
    defaultProps: {
      title: "Meet Our Team",
      subtitle: "The experts behind our success",
      members: [
        {
          name: "Alex Thompson",
          role: "CEO & Founder",
          bio: "10+ years building innovative products"
        }
      ]
    },
    metadata: {
      description: 'Team member showcase with photos and social links',
      tags: ['team', 'about', 'people', 'staff'],
      performance: {
        lighthouse: 88,
        bundleSize: 7.4,
        renderTime: 110,
        cls: 0.08,
        fcp: 1.0,
        lcp: 1.7
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.8,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 420,
        successRate: 0.89,
        conversionRate: 0.05,
        industries: ['agency', 'consulting', 'startup'],
        popularCombinations: ['hero-centered', 'contact-form'],
        averageProps: {
          title: 'Our Team',
          members: []
        }
      },
      aiHints: {
        industries: ['agency', 'consulting', 'startup', 'service'],
        useCases: ['about page', 'team showcase', 'company intro'],
        keywords: ['team', 'people', 'staff', 'about', 'leadership'],
        avoidWhen: ['ecommerce', 'product-focused']
      }
    }
  }),

  // Contact Components
  createComponent({
    id: 'contact-form',
    name: 'Contact Form',
    category: 'contact',
    component: ContactForm,
    propsSchema: ContactFormPropsSchema,
    defaultProps: {
      title: "Get In Touch",
      subtitle: "We'd love to hear from you",
      includePhone: true,
      includeCompany: true,
      includeMessage: true,
      submitText: "Send Message"
    },
    metadata: {
      description: 'Professional contact form with validation and accessibility',
      tags: ['contact', 'form', 'communication', 'inquiry'],
      performance: {
        lighthouse: 91,
        bundleSize: 8.9,
        renderTime: 95,
        cls: 0.03,
        fcp: 0.9,
        lcp: 1.4
      },
      accessibility: {
        wcagLevel: 'AAA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 6.2,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 1200,
        successRate: 0.94,
        conversionRate: 0.22,
        industries: ['service', 'agency', 'consulting'],
        popularCombinations: ['hero-centered', 'team-grid', 'faq-section'],
        averageProps: {
          title: 'Contact Us',
          includePhone: true,
          includeMessage: true
        }
      },
      aiHints: {
        industries: ['service', 'agency', 'consulting', 'local'],
        useCases: ['lead generation', 'customer support', 'inquiries'],
        keywords: ['contact', 'form', 'inquiry', 'reach out', 'get in touch'],
        avoidWhen: ['ecommerce checkout', 'blog']
      }
    }
  }),

  // FAQ Components
  createComponent({
    id: 'faq-section',
    name: 'FAQ Section',
    category: 'faq',
    component: FAQSection,
    propsSchema: FAQSectionPropsSchema,
    defaultProps: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions",
      showSearch: true,
      showCategories: false
    },
    metadata: {
      description: 'Expandable FAQ section with search and categories',
      tags: ['faq', 'questions', 'help', 'support'],
      performance: {
        lighthouse: 92,
        bundleSize: 11.2,
        renderTime: 130,
        cls: 0.04,
        fcp: 1.0,
        lcp: 1.6
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.7,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 680,
        successRate: 0.93,
        conversionRate: 0.08,
        industries: ['saas', 'service', 'ecommerce'],
        popularCombinations: ['pricing-table', 'contact-form'],
        averageProps: {
          title: 'FAQ',
          showSearch: true
        }
      },
      aiHints: {
        industries: ['saas', 'service', 'ecommerce', 'support'],
        useCases: ['customer support', 'product questions', 'help center'],
        keywords: ['faq', 'questions', 'help', 'support', 'answers'],
        avoidWhen: ['portfolio', 'blog', 'creative']
      }
    }
  }),

  // Stats Components
  createComponent({
    id: 'stats-section',
    name: 'Stats Section',
    category: 'stats',
    component: StatsSection,
    propsSchema: StatsSectionPropsSchema,
    defaultProps: {
      title: "Our Impact",
      subtitle: "Numbers that showcase our success",
      stats: [
        { label: "Happy Customers", value: "10,000+", icon: "users" },
        { label: "Projects Completed", value: "500+", icon: "projects" },
        { label: "Years of Experience", value: "5+", icon: "time" },
        { label: "Success Rate", value: "99%", icon: "success" }
      ]
    },
    metadata: {
      description: 'Statistics display with animated counters and icons',
      tags: ['stats', 'metrics', 'numbers', 'achievements'],
      performance: {
        lighthouse: 93,
        bundleSize: 6.8,
        renderTime: 85,
        cls: 0.02,
        fcp: 0.8,
        lcp: 1.3
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.9,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 560,
        successRate: 0.88,
        conversionRate: 0.12,
        industries: ['saas', 'agency', 'startup'],
        popularCombinations: ['hero-split', 'features-grid'],
        averageProps: {
          title: 'Our Numbers',
          stats: []
        }
      },
      aiHints: {
        industries: ['saas', 'agency', 'startup', 'service'],
        useCases: ['credibility building', 'social proof', 'achievement showcase'],
        keywords: ['stats', 'numbers', 'metrics', 'achievements', 'results'],
        avoidWhen: ['startup without metrics', 'new companies']
      }
    }
  }),

  // Gallery Components
  createComponent({
    id: 'portfolio-gallery',
    name: 'Portfolio Gallery',
    category: 'gallery',
    component: PortfolioGallery,
    propsSchema: PortfolioGalleryPropsSchema,
    defaultProps: {
      title: "Our Work",
      subtitle: "Showcasing our best projects",
      showCategories: true,
      layout: "masonry",
      items: [
        {
          title: "Project Alpha",
          description: "Modern web application",
          image: "/api/placeholder/400/300",
          category: "web",
          tags: ["react", "typescript"]
        }
      ]
    },
    metadata: {
      description: 'Portfolio showcase with category filtering and masonry layout',
      tags: ['portfolio', 'gallery', 'showcase', 'projects'],
      performance: {
        lighthouse: 87,
        bundleSize: 15.6,
        renderTime: 180,
        cls: 0.12,
        fcp: 1.3,
        lcp: 2.2
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.5,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 340,
        successRate: 0.85,
        conversionRate: 0.18,
        industries: ['creative', 'agency', 'portfolio'],
        popularCombinations: ['hero-centered', 'team-grid', 'contact-form'],
        averageProps: {
          title: 'Portfolio',
          layout: 'masonry',
          showCategories: true
        }
      },
      aiHints: {
        industries: ['creative', 'agency', 'portfolio', 'design'],
        useCases: ['work showcase', 'project gallery', 'case studies'],
        keywords: ['portfolio', 'work', 'projects', 'gallery', 'showcase'],
        avoidWhen: ['saas products', 'service companies']
      }
    }
  }),

  // Blog Components
  createComponent({
    id: 'blog-grid',
    name: 'Blog Grid',
    category: 'blog',
    component: BlogGrid,
    propsSchema: BlogGridPropsSchema,
    defaultProps: {
      title: "Latest Articles",
      subtitle: "Insights, tips, and industry news",
      showCategories: true,
      postsPerPage: 6,
      posts: [
        {
          title: "Getting Started Guide",
          excerpt: "Everything you need to know to get started",
          author: "Team",
          date: "2024-01-15",
          category: "guides",
          tags: ["beginners", "tutorial"]
        }
      ]
    },
    metadata: {
      description: 'Blog post grid with categories, pagination, and search',
      tags: ['blog', 'articles', 'content', 'news'],
      performance: {
        lighthouse: 89,
        bundleSize: 13.4,
        renderTime: 160,
        cls: 0.06,
        fcp: 1.2,
        lcp: 2.0
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.6,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 290,
        successRate: 0.87,
        conversionRate: 0.09,
        industries: ['content', 'media', 'education'],
        popularCombinations: ['hero-centered', 'timeline'],
        averageProps: {
          title: 'Blog',
          showCategories: true,
          postsPerPage: 6
        }
      },
      aiHints: {
        industries: ['content', 'media', 'education', 'news'],
        useCases: ['content marketing', 'news publication', 'knowledge sharing'],
        keywords: ['blog', 'articles', 'content', 'news', 'posts'],
        avoidWhen: ['product landing', 'ecommerce']
      }
    }
  }),

  // Timeline Components
  createComponent({
    id: 'timeline',
    name: 'Timeline',
    category: 'timeline',
    component: Timeline,
    propsSchema: TimelinePropsSchema,
    defaultProps: {
      title: "Our Journey",
      subtitle: "Key milestones in our growth",
      orientation: "vertical",
      items: [
        {
          title: "Company Founded",
          description: "Started with a vision",
          date: "2020",
          status: "completed",
          icon: "rocket"
        }
      ]
    },
    metadata: {
      description: 'Vertical/horizontal timeline for milestones and processes',
      tags: ['timeline', 'milestones', 'history', 'process'],
      performance: {
        lighthouse: 91,
        bundleSize: 10.1,
        renderTime: 120,
        cls: 0.04,
        fcp: 1.0,
        lcp: 1.7
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.8,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 180,
        successRate: 0.86,
        conversionRate: 0.07,
        industries: ['startup', 'corporate', 'nonprofit'],
        popularCombinations: ['hero-centered', 'team-grid'],
        averageProps: {
          title: 'Timeline',
          orientation: 'vertical'
        }
      },
      aiHints: {
        industries: ['startup', 'corporate', 'nonprofit', 'agency'],
        useCases: ['company history', 'process explanation', 'milestone tracking'],
        keywords: ['timeline', 'history', 'milestones', 'process', 'journey'],
        avoidWhen: ['product landing', 'ecommerce']
      }
    }
  }),

  // Stats Components
  createComponent({
    id: 'stats-section',
    name: 'Stats Section',
    category: 'stats',
    component: StatsSection,
    propsSchema: StatsSectionPropsSchema,
    defaultProps: {
      title: "Our Impact",
      subtitle: "Numbers that showcase our success",
      stats: [
        { label: "Happy Customers", value: "10,000+", icon: "users" },
        { label: "Projects Completed", value: "500+", icon: "projects" }
      ]
    },
    metadata: {
      description: 'Statistics display with animated counters and icons',
      tags: ['stats', 'metrics', 'numbers', 'achievements'],
      performance: {
        lighthouse: 93,
        bundleSize: 6.8,
        renderTime: 85,
        cls: 0.02,
        fcp: 0.8,
        lcp: 1.3
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.9,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 560,
        successRate: 0.88,
        conversionRate: 0.12,
        industries: ['saas', 'agency', 'startup'],
        popularCombinations: ['hero-split', 'features-grid'],
        averageProps: {
          title: 'Our Numbers',
          stats: []
        }
      },
      aiHints: {
        industries: ['saas', 'agency', 'startup', 'service'],
        useCases: ['credibility building', 'social proof', 'achievement showcase'],
        keywords: ['stats', 'numbers', 'metrics', 'achievements', 'results'],
        avoidWhen: ['startup without metrics', 'new companies']
      }
    }
  }),

  // FAQ Components
  createComponent({
    id: 'faq-section',
    name: 'FAQ Section',
    category: 'faq',
    component: FAQSection,
    propsSchema: FAQSectionPropsSchema,
    defaultProps: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions",
      showSearch: true,
      showCategories: false
    },
    metadata: {
      description: 'Expandable FAQ section with search and categories',
      tags: ['faq', 'questions', 'help', 'support'],
      performance: {
        lighthouse: 92,
        bundleSize: 11.2,
        renderTime: 130,
        cls: 0.04,
        fcp: 1.0,
        lcp: 1.6
      },
      accessibility: {
        wcagLevel: 'AA',
        ariaCompliant: true,
        keyboardNavigable: true,
        screenReaderOptimized: true,
        colorContrast: 4.7,
        focusManagement: true
      },
      compatibility: {
        mobile: true,
        responsive: true,
        browsers: ['chrome', 'firefox', 'safari', 'edge'],
        frameworks: ['next', 'react'],
        serverComponents: true
      },
      usage: {
        totalUsage: 680,
        successRate: 0.93,
        conversionRate: 0.08,
        industries: ['saas', 'service', 'ecommerce'],
        popularCombinations: ['pricing-table', 'contact-form'],
        averageProps: {
          title: 'FAQ',
          showSearch: true
        }
      },
      aiHints: {
        industries: ['saas', 'service', 'ecommerce', 'support'],
        useCases: ['customer support', 'product questions', 'help center'],
        keywords: ['faq', 'questions', 'help', 'support', 'answers'],
        avoidWhen: ['portfolio', 'blog', 'creative']
      }
    }
  })
];

// Component lookup map
export const COMPONENT_MAP = new Map<string, ComponentDefinition>(
  CORE_COMPONENTS.map(comp => [comp.id, comp])
);

// Export individual components
export {
  HeroCentered,
  HeroSplit, 
  HeroVideoBg,
  FeaturesGrid,
  TestimonialsSlider,
  PricingTable,
  TeamGrid,
  PortfolioGallery,
  ContactForm,
  FAQSection,
  StatsSection,
  BlogGrid,
  Timeline
};

// Export schemas
export {
  HeroCenteredPropsSchema,
  HeroSplitPropsSchema,
  HeroVideoBgPropsSchema,
  FeaturesGridPropsSchema,
  TestimonialsSliderPropsSchema,
  PricingTablePropsSchema,
  TeamGridPropsSchema,
  PortfolioGalleryPropsSchema,
  ContactFormPropsSchema,
  FAQSectionPropsSchema,
  StatsSectionPropsSchema,
  BlogGridPropsSchema,
  TimelinePropsSchema
};