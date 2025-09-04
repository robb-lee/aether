import { createComponent } from '../registry';
import { ComponentDefinition } from '../types/component';

// Hero Components
import HeroCentered, { HeroCenteredPropsSchema } from './hero/HeroCentered';
import HeroSplit, { HeroSplitPropsSchema } from './hero/HeroSplit';
import HeroVideoBg, { HeroVideoBgPropsSchema } from './hero/HeroVideoBg';

// Features Components  
import FeaturesGrid, { FeaturesGridPropsSchema } from './features/FeaturesGrid';

// New Components
import TestimonialsSlider from './testimonials/TestimonialsSlider';
import PricingTable from './pricing/PricingTable';
import TeamGrid from './team/TeamGrid';
import PortfolioGallery from './gallery/PortfolioGallery';
import ContactForm from './contact/ContactForm';
import FAQSection from './faq/FAQSection';
import StatsSection from './stats/StatsSection';
import BlogGrid from './blog/BlogGrid';
import Timeline from './timeline/Timeline';

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
  FeaturesGridPropsSchema
};