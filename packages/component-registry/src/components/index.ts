/**
 * Individual Component Exports
 * 
 * Note: CORE_COMPONENTS array has been moved to unified-components.ts
 * This file now only exports individual components and their schemas
 */

// Hero Components
import HeroCentered, { HeroCenteredPropsSchema } from './hero/HeroCentered';
import HeroSplit, { HeroSplitPropsSchema } from './hero/HeroSplit';
import HeroVideoBg, { HeroVideoBgPropsSchema } from './hero/HeroVideoBg';

// Header Components
import HeaderSimple, { HeaderSimplePropsSchema } from './header/HeaderSimple';

// Footer Components  
import { FooterEnterprise, FooterEnterprisePropsSchema } from './footer/FooterEnterprise';

// CTA Components
import { CTASimple, CTASimplePropsSchema } from './cta/CTASimple';

// Features Components  
import FeaturesGrid, { FeaturesGridPropsSchema } from './features/FeaturesGrid';

// Additional Components
import TestimonialsSlider, { TestimonialsSliderPropsSchema } from './testimonials/TestimonialsSlider';
import PricingTable, { PricingTablePropsSchema } from './pricing/PricingTable';
import TeamGrid, { TeamGridPropsSchema } from './team/TeamGrid';
import PortfolioGallery, { PortfolioGalleryPropsSchema } from './gallery/PortfolioGallery';
import ContactForm, { ContactFormPropsSchema } from './contact/ContactForm';
import FAQSection, { FAQSectionPropsSchema } from './faq/FAQSection';
import StatsSection, { StatsSectionPropsSchema } from './stats/StatsSection';
import BlogGrid, { BlogGridPropsSchema } from './blog/BlogGrid';
import Timeline, { TimelinePropsSchema } from './timeline/Timeline';

// Export individual components for direct usage
export {
  // Hero Components
  HeroCentered,
  HeroSplit,
  HeroVideoBg,
  
  // Header Components
  HeaderSimple,
  
  // Footer Components
  FooterEnterprise,
  
  // CTA Components
  CTASimple,
  
  // Features Components
  FeaturesGrid,
  
  // Additional Components
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
  // Hero Schemas
  HeroCenteredPropsSchema,
  HeroSplitPropsSchema,
  HeroVideoBgPropsSchema,
  
  // Header Schemas
  HeaderSimplePropsSchema,
  
  // Footer Schemas
  FooterEnterprisePropsSchema,
  
  // CTA Schemas
  CTASimplePropsSchema,
  
  // Features Schemas
  FeaturesGridPropsSchema,
  
  // Additional Component Schemas
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