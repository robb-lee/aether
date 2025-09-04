/**
 * Responsive utility functions for consistent breakpoint management
 * across all component registry components
 */

export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

/**
 * Standard responsive spacing patterns
 */
export const responsiveSpacing = {
  section: {
    py: 'py-12 sm:py-16 md:py-20 lg:py-24',
    px: 'px-4 sm:px-6 lg:px-8 xl:px-12'
  },
  container: {
    py: 'py-8 sm:py-12 md:py-16',
    px: 'px-4 sm:px-6 lg:px-8'
  },
  component: {
    py: 'py-6 sm:py-8 md:py-10',
    px: 'px-4 sm:px-6 md:px-8'
  },
  card: {
    p: 'p-4 sm:p-6 md:p-8'
  },
  button: {
    px: 'px-6 sm:px-8',
    py: 'py-3 sm:py-4'
  }
} as const;

/**
 * Standard responsive text sizes
 */
export const responsiveText = {
  display: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  h3: 'text-lg sm:text-xl md:text-2xl',
  h4: 'text-base sm:text-lg md:text-xl',
  lead: 'text-lg sm:text-xl md:text-2xl',
  body: 'text-sm sm:text-base md:text-lg',
  caption: 'text-xs sm:text-sm md:text-base'
} as const;

/**
 * Standard responsive grid layouts
 */
export const responsiveGrids = {
  '2-col': 'grid-cols-1 sm:grid-cols-2',
  '3-col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4-col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  '6-col': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  'auto-fit': 'grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]'
} as const;

/**
 * Standard responsive container widths
 */
export const responsiveContainers = {
  narrow: 'max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl',
  content: 'max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl',
  wide: 'max-w-2xl sm:max-w-4xl md:max-w-6xl lg:max-w-7xl',
  full: 'max-w-full'
} as const;

/**
 * Standard responsive flex layouts
 */
export const responsiveFlex = {
  'stack-mobile': 'flex-col sm:flex-row',
  'stack-tablet': 'flex-col md:flex-row',
  'reverse-mobile': 'flex-col-reverse sm:flex-row',
  center: 'justify-center items-center',
  between: 'justify-between items-center',
  start: 'justify-start items-center'
} as const;

/**
 * Helper function to combine responsive classes
 */
export function getResponsiveClasses(config: {
  spacing?: keyof typeof responsiveSpacing;
  text?: keyof typeof responsiveText;
  container?: keyof typeof responsiveContainers;
  grid?: keyof typeof responsiveGrids;
  flex?: keyof typeof responsiveFlex;
}) {
  const classes = [];
  
  if (config.spacing) {
    const spacing = responsiveSpacing[config.spacing];
    if ('py' in spacing && 'px' in spacing) {
      classes.push(spacing.py, spacing.px);
    } else if ('p' in spacing) {
      classes.push(spacing.p);
    }
  }
  
  if (config.text) {
    classes.push(responsiveText[config.text]);
  }
  
  if (config.container) {
    classes.push(responsiveContainers[config.container]);
  }
  
  if (config.grid) {
    classes.push(`grid ${responsiveGrids[config.grid]}`);
  }
  
  if (config.flex) {
    classes.push(`flex ${responsiveFlex[config.flex]}`);
  }
  
  return classes.filter(Boolean).join(' ');
}

/**
 * Mobile-first gap spacing
 */
export const responsiveGaps = {
  tight: 'gap-2 sm:gap-4 md:gap-6',
  normal: 'gap-4 sm:gap-6 md:gap-8',
  loose: 'gap-6 sm:gap-8 md:gap-12',
  'x-loose': 'gap-8 sm:gap-12 md:gap-16'
} as const;

/**
 * Helper for responsive button groups
 */
export function getButtonGroupClasses(variant: 'stack' | 'inline' | 'center' = 'stack') {
  const base = 'flex gap-3 sm:gap-4';
  
  switch (variant) {
    case 'stack':
      return `${base} flex-col sm:flex-row`;
    case 'inline':
      return `${base} flex-row flex-wrap`;
    case 'center':
      return `${base} flex-col sm:flex-row justify-center items-center`;
    default:
      return base;
  }
}

/**
 * Helper for responsive image/content layouts
 */
export function getContentImageClasses(layout: 'split' | 'stacked' = 'split') {
  switch (layout) {
    case 'split':
      return 'flex flex-col lg:flex-row items-center gap-8 lg:gap-12';
    case 'stacked':
      return 'flex flex-col gap-6 sm:gap-8 md:gap-12';
    default:
      return 'flex flex-col gap-6';
  }
}