/**
 * Unified Design System
 * 
 * Contains both foundation design tokens and themed design kits for the Aether platform.
 * This unified approach simplifies management and reduces complexity while maintaining
 * the ability to create industry-specific themes.
 */

// ===================================================================
// FOUNDATION DESIGN TOKENS
// ===================================================================

export interface DesignTokens {
  colors: {
    semantic: {
      primary: string;
      secondary: string;
      accent: string;
      destructive: string;
      warning: string;
      success: string;
    };
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
    state: {
      hover: string;
      active: string;
      disabled: string;
      focus: string;
    };
    surface: {
      background: string;
      foreground: string;
      card: string;
      popover: string;
      muted: string;
    };
  };
  typography: {
    fontFamily: {
      heading: string[];
      body: string[];
      mono: string[];
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
    letterSpacing: {
      tighter: string;
      normal: string;
      wider: string;
    };
  };
  spacing: {
    base: number;
    scale: number[];
    containerWidths: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      full: string;
    };
  };
  effects: {
    borderRadius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      inner: string;
    };
    blur: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      duration: {
        fast: string;
        normal: string;
        slow: string;
      };
      easing: {
        'ease-in': string;
        'ease-out': string;
        'ease-in-out': string;
        spring: string;
      };
    };
    zIndex: {
      dropdown: number;
      modal: number;
      toast: number;
      overlay: number;
    };
  };
  icons: {
    size: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      '2xl': number;
    };
    stroke: {
      thin: number;
      normal: number;
      thick: number;
    };
  };
  animation: {
    presets: {
      'fade-in': string;
      'slide-up': string;
      'slide-down': string;
      scale: string;
      rotate: string;
    };
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
  };
  grid: {
    columns: {
      12: string;
      16: string;
      24: string;
    };
    gutter: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export const designTokens: DesignTokens = {
  colors: {
    semantic: {
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      accent: 'var(--accent)',
      destructive: 'var(--destructive)',
      warning: 'var(--warning)',
      success: 'var(--success)',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    state: {
      hover: 'var(--hover)',
      active: 'var(--active)',
      disabled: 'var(--disabled)',
      focus: 'var(--focus)',
    },
    surface: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      card: 'var(--card)',
      popover: 'var(--popover)',
      muted: 'var(--muted)',
    },
  },
  typography: {
    fontFamily: {
      heading: ['Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'Menlo', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tighter: '-0.05em',
      normal: '0em',
      wider: '0.05em',
    },
  },
  spacing: {
    base: 8, // 8px base system
    scale: [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128],
    containerWidths: {
      xs: '20rem',     // 320px
      sm: '40rem',     // 640px
      md: '48rem',     // 768px
      lg: '64rem',     // 1024px
      xl: '80rem',     // 1280px
      '2xl': '96rem',  // 1536px
      full: '100%',
    },
  },
  effects: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',   // 2px
      md: '0.375rem',   // 6px
      lg: '0.5rem',     // 8px
      xl: '0.75rem',    // 12px
      '2xl': '1rem',    // 16px
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },
    blur: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
    },
    transitions: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
    zIndex: {
      dropdown: 50,
      modal: 100,
      toast: 150,
      overlay: 200,
    },
  },
  icons: {
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      '2xl': 32,
    },
    stroke: {
      thin: 1.25,
      normal: 1.5,
      thick: 1.75,
    },
  },
  animation: {
    presets: {
      'fade-in': 'fadeIn 0.3s ease-out',
      'slide-up': 'slideUp 0.3s ease-out',
      'slide-down': 'slideDown 0.3s ease-out',
      scale: 'scale 0.2s ease-out',
      rotate: 'rotate 0.3s ease-in-out',
    },
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
  },
  grid: {
    columns: {
      12: 'repeat(12, minmax(0, 1fr))',
      16: 'repeat(16, minmax(0, 1fr))',
      24: 'repeat(24, minmax(0, 1fr))',
    },
    gutter: {
      sm: '1rem',   // 16px
      md: '1.5rem', // 24px
      lg: '2rem',   // 32px
    },
  },
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// ===================================================================
// DESIGN KITS (THEMED APPLICATIONS)
// ===================================================================

export interface DesignKitConfig {
  id: string;
  name: string;
  description: string;
  targetIndustry: string[];
  tokens: {
    primaryFont: string;
    headingFont: string;
    spacing: 'compact' | 'normal' | 'wide' | 'extra-wide';
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'extra-large';
    shadows: 'none' | 'minimal' | 'soft' | 'dramatic';
    hasGradients: boolean;
    animations: 'none' | 'minimal' | 'smooth' | 'dynamic';
    contrast: 'low' | 'normal' | 'high';
  };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  componentPreferences: {
    hero: string[];
    features: string[];
    pricing: string[];
    testimonials: string[];
    cta: string[];
  };
  cssVariables: Record<string, string>;
}

export const designKits: Record<string, DesignKitConfig> = {
  'modern-saas': {
    id: 'modern-saas',
    name: 'Modern SaaS',
    description: '부드러운 그라디언트와 넓은 여백으로 현대적이고 깔끔한 느낌',
    targetIndustry: ['saas', 'startup', 'tech'],
    tokens: {
      primaryFont: 'Inter',
      headingFont: 'Inter',
      spacing: 'wide',
      borderRadius: 'large',
      shadows: 'soft',
      hasGradients: true,
      animations: 'smooth',
      contrast: 'normal',
    },
    colorScheme: {
      primary: '#6366f1',     // Indigo 500
      secondary: '#8b5cf6',   // Violet 500
      accent: '#06b6d4',      // Cyan 500
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: '#ffffff',
    },
    componentPreferences: {
      hero: ['hero-split', 'hero-centered-gradient'],
      features: ['features-grid', 'features-cards-elevated'],
      pricing: ['pricing-cards-gradient', 'pricing-feature-comparison'],
      testimonials: ['testimonials-carousel-modern', 'testimonials-grid-cards'],
      cta: ['cta-gradient-banner', 'cta-split-image'],
    },
    cssVariables: {
      '--primary': '#6366f1',
      '--secondary': '#8b5cf6',
      '--accent': '#06b6d4',
      '--background': '#ffffff',
      '--foreground': '#0f172a',
      '--muted': '#f8fafc',
      '--border': '#e2e8f0',
      '--radius': '0.75rem',
      '--font-sans': 'Inter, system-ui, sans-serif',
      '--spacing-unit': '1.5rem',
      '--shadow-base': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },

  'corporate': {
    id: 'corporate',
    name: 'Corporate',
    description: '전문적이고 신뢰감 있는 기업 스타일',
    targetIndustry: ['enterprise', 'financial', 'consulting', 'legal'],
    tokens: {
      primaryFont: 'system-ui',
      headingFont: 'Merriweather',
      spacing: 'normal',
      borderRadius: 'none',
      shadows: 'minimal',
      hasGradients: false,
      animations: 'minimal',
      contrast: 'high',
    },
    colorScheme: {
      primary: '#1e3a8a',     // Blue 800
      secondary: '#64748b',   // Slate 500
      accent: '#059669',      // Emerald 600
      background: '#ffffff',
      surface: '#f8fafc',
    },
    componentPreferences: {
      hero: ['hero-centered', 'hero-banner-corporate'],
      features: ['features-list', 'features-table'],
      pricing: ['pricing-table', 'pricing-enterprise'],
      testimonials: ['testimonials-quote-blocks', 'testimonials-logos'],
      cta: ['cta-banner-simple', 'cta-contact-form'],
    },
    cssVariables: {
      '--primary': '#1e3a8a',
      '--secondary': '#64748b',
      '--accent': '#059669',
      '--background': '#ffffff',
      '--foreground': '#0f172a',
      '--muted': '#f1f5f9',
      '--border': '#cbd5e1',
      '--radius': '0',
      '--font-sans': 'system-ui, sans-serif',
      '--font-serif': 'Merriweather, serif',
      '--spacing-unit': '1rem',
      '--shadow-base': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
  },

  'creative-agency': {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: '대담하고 창의적인 비비드 컬러와 동적인 효과',
    targetIndustry: ['design', 'marketing', 'media', 'entertainment'],
    tokens: {
      primaryFont: 'system-ui',
      headingFont: 'Bebas Neue',
      spacing: 'extra-wide',
      borderRadius: 'medium',
      shadows: 'dramatic',
      hasGradients: true,
      animations: 'dynamic',
      contrast: 'high',
    },
    colorScheme: {
      primary: '#ff006e',     // Hot Pink
      secondary: '#8338ec',   // Purple
      accent: '#ffbe0b',      // Amber
      background: 'linear-gradient(45deg, #ff006e 0%, #8338ec 50%, #ffbe0b 100%)',
      surface: '#ffffff',
    },
    componentPreferences: {
      hero: ['hero-asymmetric', 'hero-video-bg'],
      features: ['features-showcase', 'features-interactive'],
      pricing: ['pricing-creative', 'pricing-tiered-dramatic'],
      testimonials: ['testimonials-video', 'testimonials-masonry'],
      cta: ['cta-diagonal', 'cta-animated'],
    },
    cssVariables: {
      '--primary': '#ff006e',
      '--secondary': '#8338ec',
      '--accent': '#ffbe0b',
      '--background': '#ffffff',
      '--foreground': '#0c0c0c',
      '--muted': '#f7f7f7',
      '--border': '#e0e0e0',
      '--radius': '0.375rem',
      '--font-sans': 'system-ui, sans-serif',
      '--font-display': 'Bebas Neue, cursive',
      '--spacing-unit': '2rem',
      '--shadow-base': '0 20px 40px -12px rgb(0 0 0 / 0.25)',
    },
  },

  'e-commerce': {
    id: 'e-commerce',
    name: 'E-commerce',
    description: '높은 대비와 명확한 CTA로 전환율 최적화',
    targetIndustry: ['retail', 'fashion', 'marketplace', 'commerce'],
    tokens: {
      primaryFont: 'system-ui',
      headingFont: 'system-ui',
      spacing: 'normal',
      borderRadius: 'small',
      shadows: 'soft',
      hasGradients: false,
      animations: 'smooth',
      contrast: 'high',
    },
    colorScheme: {
      primary: '#dc2626',     // Red 600
      secondary: '#0d9488',   // Teal 600
      accent: '#f59e0b',      // Amber 500
      background: '#ffffff',
      surface: '#f9fafb',
    },
    componentPreferences: {
      hero: ['hero-product-showcase', 'hero-banner-sale'],
      features: ['features-product-grid', 'features-benefits'],
      pricing: ['pricing-plans', 'pricing-comparison'],
      testimonials: ['testimonials-reviews', 'testimonials-social-proof'],
      cta: ['cta-urgent', 'cta-discount'],
    },
    cssVariables: {
      '--primary': '#dc2626',
      '--secondary': '#0d9488',
      '--accent': '#f59e0b',
      '--background': '#ffffff',
      '--foreground': '#0f172a',
      '--muted': '#f3f4f6',
      '--border': '#d1d5db',
      '--radius': '0.25rem',
      '--font-sans': 'system-ui, sans-serif',
      '--spacing-unit': '1rem',
      '--shadow-base': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
  },

  'startup': {
    id: 'startup',
    name: 'Startup',
    description: '밝고 친근한 색상과 부드러운 모서리로 접근하기 쉬운 느낌',
    targetIndustry: ['startup', 'app', 'mobile', 'community'],
    tokens: {
      primaryFont: 'Inter',
      headingFont: 'Inter',
      spacing: 'normal',
      borderRadius: 'medium',
      shadows: 'soft',
      hasGradients: true,
      animations: 'smooth',
      contrast: 'normal',
    },
    colorScheme: {
      primary: '#3b82f6',     // Blue 500
      secondary: '#10b981',   // Emerald 500
      accent: '#f97316',      // Orange 500
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: '#ffffff',
    },
    componentPreferences: {
      hero: ['hero-app-preview', 'hero-split'],
      features: ['features-app-showcase', 'features-grid'],
      pricing: ['pricing-simple', 'pricing-feature-list'],
      testimonials: ['testimonials-founder', 'testimonials-users'],
      cta: ['cta-app-download', 'cta-waitlist'],
    },
    cssVariables: {
      '--primary': '#3b82f6',
      '--secondary': '#10b981',
      '--accent': '#f97316',
      '--background': '#ffffff',
      '--foreground': '#111827',
      '--muted': '#f9fafb',
      '--border': '#e5e7eb',
      '--radius': '0.5rem',
      '--font-sans': 'Inter, system-ui, sans-serif',
      '--spacing-unit': '1.25rem',
      '--shadow-base': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },
};

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

// Design Token Utilities
export function getToken(path: string): string | number | string[] | number[] {
  const keys = path.split('.');
  let current: any = designTokens;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      throw new Error(`Token not found: ${path}`);
    }
  }
  
  return current;
}

export function getSpacing(scale: number): string {
  const value = designTokens.spacing.scale[scale];
  if (value === undefined) {
    throw new Error(`Spacing scale ${scale} not found`);
  }
  return `${value * designTokens.spacing.base}px`;
}

export function getFontSize(size: keyof DesignTokens['typography']['fontSize']): string {
  return designTokens.typography.fontSize[size];
}

export function getShadow(size: keyof DesignTokens['effects']['shadows']): string {
  return designTokens.effects.shadows[size];
}

export function getBorderRadius(size: keyof DesignTokens['effects']['borderRadius']): string {
  return designTokens.effects.borderRadius[size];
}

// Design Kit Utilities
export function getDesignKit(kitId: string): DesignKitConfig {
  const kit = designKits[kitId];
  if (!kit) {
    throw new Error(`Design kit not found: ${kitId}`);
  }
  return kit;
}

export function selectKitByIndustry(industry: string): string {
  for (const [kitId, kit] of Object.entries(designKits)) {
    if (kit.targetIndustry.includes(industry.toLowerCase())) {
      return kitId;
    }
  }
  return 'modern-saas'; // default fallback
}

export function getKitCSSVariables(kitId: string): Record<string, string> {
  const kit = getDesignKit(kitId);
  return kit.cssVariables;
}

export function getKitComponentPreference(
  kitId: string,
  componentCategory: keyof DesignKitConfig['componentPreferences']
): string[] {
  const kit = getDesignKit(kitId);
  return kit.componentPreferences[componentCategory] || [];
}

// Kit comparison utilities
export function getAvailableKits(): string[] {
  return Object.keys(designKits);
}

export function getKitsByIndustry(industry: string): string[] {
  return Object.entries(designKits)
    .filter(([_, kit]) => kit.targetIndustry.includes(industry.toLowerCase()))
    .map(([kitId]) => kitId);
}