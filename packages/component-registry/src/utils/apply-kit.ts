/**
 * Design Kit Application Utilities
 * 
 * Functions for applying design kits to components and generating
 * the appropriate CSS classes and styling.
 */

// Utility function for className merging (simple implementation)
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
import { ComponentDefinition } from '../types/component';
import { DesignKitConfig, designKits, getDesignKit } from '../design-kits';
import { designTokens, getSpacing, getBorderRadius, getShadow } from '../design-tokens';

export interface AppliedComponent extends ComponentDefinition {
  appliedKit: string;
  computedClassName: string;
  cssVariables: Record<string, string>;
  animationClasses: string[];
}

/**
 * Apply a design kit to a component
 */
export function applyDesignKit(
  component: ComponentDefinition,
  kitId: string
): AppliedComponent {
  const kit = getDesignKit(kitId);
  let kitStyle = component.metadata.designKit?.kitStyles?.[kitId];
  
  if (!kitStyle) {
    // Generate default style based on kit tokens
    kitStyle = generateDefaultKitStyle(component, kit);
  }
  
  // Compute final className
  const computedClassName = cn(
    component.defaultProps.className || '',
    kitStyle.containerClass,
    kitStyle.spacing,
    generateSpacingClass(kit),
    generateTypographyClass(kit),
    generateEffectsClass(kit)
  );
  
  // Generate CSS variables
  const cssVariables = {
    ...kit.cssVariables,
    ...kitStyle.colors,
    '--kit-id': kitId,
  };
  
  // Generate animation classes
  const animationClasses = generateAnimationClasses(kit, kitStyle.animations);
  
  return {
    ...component,
    appliedKit: kitId,
    computedClassName,
    cssVariables,
    animationClasses,
    defaultProps: {
      ...component.defaultProps,
      className: computedClassName,
      style: {
        ...component.defaultProps.style,
        ...cssVariables,
      },
    },
  };
}

/**
 * Apply design kit to multiple components
 */
export function applyDesignKitBatch(
  components: ComponentDefinition[],
  kitId: string
): AppliedComponent[] {
  return components.map(component => applyDesignKit(component, kitId));
}

/**
 * Get available design kits for a component
 */
export function getAvailableKitsForComponent(component: ComponentDefinition): string[] {
  return component.metadata.designKit?.compatibleKits || [];
}

/**
 * Check if a component is compatible with a design kit
 */
export function isComponentCompatibleWithKit(
  component: ComponentDefinition,
  kitId: string
): boolean {
  const compatibleKits = component.metadata.designKit?.compatibleKits || [];
  return compatibleKits.includes(kitId);
}

/**
 * Get the best design kit for a business type/industry
 */
export function getBestKitForIndustry(industry: string): string {
  const industryMappings: Record<string, string> = {
    'saas': 'modern-saas',
    'startup': 'modern-saas',
    'tech': 'modern-saas',
    'enterprise': 'corporate',
    'financial': 'corporate',
    'consulting': 'corporate',
    'legal': 'corporate',
    'design': 'creative-agency',
    'marketing': 'creative-agency',
    'media': 'creative-agency',
    'entertainment': 'creative-agency',
    'retail': 'e-commerce',
    'fashion': 'e-commerce',
    'marketplace': 'e-commerce',
    'commerce': 'e-commerce',
    'app': 'startup',
    'mobile': 'startup',
    'community': 'startup',
  };
  
  return industryMappings[industry.toLowerCase()] || 'modern-saas';
}

/**
 * Generate performance optimized kit selection
 */
export function selectOptimalKit(
  components: ComponentDefinition[],
  requirements: {
    industry?: string;
    performance?: 'high' | 'balanced' | 'basic';
    accessibility?: 'basic' | 'enhanced' | 'full';
  }
): string {
  const possibleKits = Object.keys(designKits);
  let bestKit = 'modern-saas';
  let bestScore = 0;
  
  for (const kitId of possibleKits) {
    let score = 0;
    let compatibleCount = 0;
    
    // Check component compatibility
    for (const component of components) {
      if (isComponentCompatibleWithKit(component, kitId)) {
        compatibleCount++;
        score += component.metadata.designKit?.performanceScore || 0;
      }
    }
    
    // Industry alignment bonus
    if (requirements.industry) {
      const kit = getDesignKit(kitId);
      if (kit.targetIndustry.includes(requirements.industry.toLowerCase())) {
        score += 20;
      }
    }
    
    // Performance requirements
    if (requirements.performance === 'high') {
      const kit = getDesignKit(kitId);
      if (kit.tokens.animations === 'smooth' || kit.tokens.animations === 'minimal') {
        score += 15;
      }
      if (kit.tokens.shadows === 'soft' || kit.tokens.shadows === 'minimal') {
        score += 10;
      }
    }
    
    // Normalize by compatible components count
    if (compatibleCount > 0) {
      score = score / compatibleCount;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestKit = kitId;
    }
  }
  
  return bestKit;
}

// Private utility functions

function generateDefaultKitStyle(
  component: ComponentDefinition,
  kit: DesignKitConfig
): {
  containerClass: string;
  headingClass?: string;
  textClass?: string;
  spacing?: string;
  colors?: Record<string, string>;
  animations?: string[];
} {
  const baseClasses = [];
  
  // Background based on kit
  if (kit.tokens.hasGradients && kit.colorScheme.background.includes('gradient')) {
    baseClasses.push('bg-gradient-to-r');
  }
  
  // Border radius
  const radiusMap = {
    'none': 'rounded-none',
    'small': 'rounded-sm',
    'medium': 'rounded-md',
    'large': 'rounded-lg',
    'extra-large': 'rounded-xl'
  };
  baseClasses.push(radiusMap[kit.tokens.borderRadius] || 'rounded-md');
  
  // Shadows
  const shadowMap = {
    'none': 'shadow-none',
    'minimal': 'shadow-sm',
    'soft': 'shadow-md',
    'dramatic': 'shadow-2xl'
  };
  baseClasses.push(shadowMap[kit.tokens.shadows] || 'shadow-md');
  
  return {
    containerClass: baseClasses.join(' '),
    headingClass: `font-${kit.tokens.headingFont === 'Inter' ? 'sans' : 'serif'}`,
    textClass: `font-${kit.tokens.primaryFont === 'Inter' ? 'sans' : 'serif'}`,
    spacing: generateSpacingForKit(kit),
    colors: {
      '--kit-primary': kit.colorScheme.primary,
      '--kit-secondary': kit.colorScheme.secondary,
      '--kit-accent': kit.colorScheme.accent,
    },
    animations: kit.tokens.animations === 'dynamic' ? ['animate-pulse'] : [],
  };
}

function generateSpacingClass(kit: DesignKitConfig): string {
  const spacingMap = {
    'compact': 'p-4 space-y-4',
    'normal': 'p-6 space-y-6',
    'wide': 'p-8 space-y-8',
    'extra-wide': 'p-12 space-y-12'
  };
  return spacingMap[kit.tokens.spacing] || spacingMap.normal;
}

function generateTypographyClass(kit: DesignKitConfig): string {
  const classes = [];
  
  // Font family
  if (kit.tokens.headingFont === 'Inter') {
    classes.push('font-sans');
  } else if (kit.tokens.headingFont.includes('serif')) {
    classes.push('font-serif');
  }
  
  // Text size adjustments based on kit personality
  if (kit.id === 'creative-agency') {
    classes.push('text-lg');
  } else if (kit.id === 'corporate') {
    classes.push('text-base');
  }
  
  return classes.join(' ');
}

function generateEffectsClass(kit: DesignKitConfig): string {
  const classes = [];
  
  // Transitions based on animation preference
  if (kit.tokens.animations === 'smooth') {
    classes.push('transition-all', 'duration-300', 'ease-out');
  } else if (kit.tokens.animations === 'dynamic') {
    classes.push('transition-all', 'duration-500', 'ease-spring');
  }
  
  // Hover effects
  if (kit.tokens.shadows === 'soft' || kit.tokens.shadows === 'dramatic') {
    classes.push('hover:shadow-lg');
  }
  
  return classes.join(' ');
}

function generateSpacingForKit(kit: DesignKitConfig): string {
  return generateSpacingClass(kit);
}

function generateAnimationClasses(
  kit: DesignKitConfig,
  customAnimations?: string[]
): string[] {
  const classes = [];
  
  // Kit-based animations
  if (kit.tokens.animations === 'smooth') {
    classes.push('animate-fadeIn');
  } else if (kit.tokens.animations === 'dynamic') {
    classes.push('animate-slideUp', 'animate-bounce');
  }
  
  // Custom animations from component
  if (customAnimations) {
    classes.push(...customAnimations);
  }
  
  return classes;
}

/**
 * Utility to merge kit styles with component styles
 */
export function mergeKitStyles(
  baseStyle: Record<string, any>,
  kitStyle: Record<string, any>
): Record<string, any> {
  return {
    ...baseStyle,
    ...kitStyle,
    // Special handling for className merging
    className: cn(baseStyle.className, kitStyle.className),
  };
}

/**
 * Generate CSS custom properties for a kit
 */
export function generateKitCSSProperties(kitId: string): string {
  const kit = getDesignKit(kitId);
  const properties = Object.entries(kit.cssVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  
  return `:root[data-kit="${kitId}"] {\n${properties}\n}`;
}

/**
 * Validate that all components in a selection are compatible with a kit
 */
export function validateKitCompatibility(
  components: ComponentDefinition[],
  kitId: string
): {
  compatible: boolean;
  incompatibleComponents: string[];
  suggestions: string[];
} {
  const incompatible = components.filter(
    component => !isComponentCompatibleWithKit(component, kitId)
  );
  
  const suggestions = incompatible.map(component => {
    const availableKits = getAvailableKitsForComponent(component);
    return `${component.id}: try kits ${availableKits.join(', ')}`;
  });
  
  return {
    compatible: incompatible.length === 0,
    incompatibleComponents: incompatible.map(c => c.id),
    suggestions,
  };
}