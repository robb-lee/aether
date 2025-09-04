/**
 * Design Kits
 * 
 * Theme variations that apply different styling approaches to the same component structure.
 * Each kit represents a different design personality and target industry.
 */

import { designTokens } from './design-tokens';

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

// Kit utility functions
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