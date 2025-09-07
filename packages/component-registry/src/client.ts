/**
 * Client-safe exports for browser environments
 * Excludes server-side dependencies like fs/promises and MetadataLoader
 */

// Client-safe registry
export { 
  ClientComponentRegistry,
  getClientRegistry,
  initializeClientRegistry,
  selectComponentsForPrompt
} from './client-registry';

// Individual component exports (client-safe)
export { 
  HeaderSimple,
  HeroCentered,
  HeroSplit,
  HeroVideoBg,
  HeroEnterprise,
  FeaturesGrid,
  FeaturesCards,
  TestimonialsSlider,
  PricingTable,
  TeamGrid,
  PortfolioGallery,
  ContactForm,
  FAQSection,
  StatsSection,
  BlogGrid,
  Timeline,
  NavMegaMenu,
  FooterEnterprise,
  LogoCarousel,
  LogoGrid,
  CTASimple
} from './unified-components';

// Schemas (client-safe)
export {
  HeaderSimplePropsSchema,
  HeroCenteredPropsSchema,
  HeroSplitPropsSchema,
  HeroVideoBgPropsSchema,
  FeaturesGridPropsSchema,
  FeaturesCardsPropsSchema,
  TestimonialsSliderPropsSchema,
  PricingTablePropsSchema,
  TeamGridPropsSchema,
  PortfolioGalleryPropsSchema,
  ContactFormPropsSchema,
  FAQSectionPropsSchema,
  StatsSectionPropsSchema,
  BlogGridPropsSchema,
  TimelinePropsSchema,
  FooterEnterprisePropsSchema,
  CTASimplePropsSchema
} from './unified-components';

// Types (client-safe)
export type {
  ComponentDefinition,
  ComponentMetadata,
  ComponentCategory,
  SearchCriteria,
  ValidationResult,
  PerformanceMetrics,
  AccessibilityMetrics,
  CompatibilityInfo,
  UsageStatistics,
  ComponentVariants
} from './types/component';

export type {
  DesignTokens,
  DesignSystem,
  Theme,
  ColorTokens,
  TypographyTokens,
  SpacingTokens
} from './types/design-tokens';

export type {
  IndustryMapping,
  AIHints
} from './types/metadata';

// Client-safe component data
export { 
  UNIFIED_COMPONENTS,
  UNIFIED_COMPONENT_MAP,
  loadUnifiedComponents,
  getUnifiedComponent,
  getUnifiedComponentsByCategory,
  getAllUnifiedComponentIds
} from './unified-components';