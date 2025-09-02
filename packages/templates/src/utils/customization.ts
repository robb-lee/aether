import { TemplateCustomization } from '../types/template';

export interface ColorPalette {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export interface FontPair {
  name: string;
  heading: string;
  body: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Professional Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937'
    }
  },
  {
    name: 'Warm Orange',
    colors: {
      primary: '#EA580C',
      secondary: '#C2410C',
      accent: '#F59E0B',
      background: '#FFFBEB',
      text: '#1C1917'
    }
  },
  {
    name: 'Nature Green',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10B981',
      background: '#F0FDF4',
      text: '#14532D'
    }
  },
  {
    name: 'Creative Purple',
    colors: {
      primary: '#7C3AED',
      secondary: '#5B21B6',
      accent: '#EC4899',
      background: '#FAF5FF',
      text: '#581C87'
    }
  },
  {
    name: 'Elegant Dark',
    colors: {
      primary: '#1F2937',
      secondary: '#111827',
      accent: '#3B82F6',
      background: '#F9FAFB',
      text: '#1F2937'
    }
  }
];

export const FONT_PAIRS: FontPair[] = [
  {
    name: 'Modern Sans',
    heading: 'Inter',
    body: 'Inter'
  },
  {
    name: 'Editorial',
    heading: 'Playfair Display',
    body: 'Source Sans Pro'
  },
  {
    name: 'Technical',
    heading: 'JetBrains Mono',
    body: 'Source Code Pro'
  },
  {
    name: 'Friendly',
    heading: 'Montserrat',
    body: 'Open Sans'
  },
  {
    name: 'Classic',
    heading: 'Merriweather',
    body: 'Source Serif Pro'
  }
];

export function createCustomTheme(
  basePalette: string | ColorPalette,
  fontPair: string | FontPair,
  options: {
    borderRadius?: 'none' | 'small' | 'medium' | 'large';
    spacing?: 'tight' | 'normal' | 'loose';
  } = {}
): TemplateCustomization {
  const palette = typeof basePalette === 'string' 
    ? COLOR_PALETTES.find(p => p.name === basePalette) || COLOR_PALETTES[0]
    : basePalette;

  const fonts = typeof fontPair === 'string'
    ? FONT_PAIRS.find(f => f.name === fontPair) || FONT_PAIRS[0]
    : fontPair;

  const borderRadiusMap = {
    none: '0',
    small: '0.25rem',
    medium: '0.5rem',
    large: '1rem'
  };

  const spacingMap = {
    tight: { padding: '0.75rem', margin: '0.5rem' },
    normal: { padding: '1.5rem', margin: '1rem' },
    loose: { padding: '2.5rem', margin: '2rem' }
  };

  return {
    colors: palette.colors,
    fonts: {
      heading: fonts.heading,
      body: fonts.body
    },
    borderRadius: borderRadiusMap[options.borderRadius || 'medium'],
    spacing: spacingMap[options.spacing || 'normal']
  };
}

export function generateColorVariations(baseColor: string): {
  light: string;
  dark: string;
  muted: string;
} {
  // Simple color variation logic - in production, use proper color manipulation library
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return {
    light: `#${Math.min(255, r + 40).toString(16).padStart(2, '0')}${Math.min(255, g + 40).toString(16).padStart(2, '0')}${Math.min(255, b + 40).toString(16).padStart(2, '0')}`,
    dark: `#${Math.max(0, r - 40).toString(16).padStart(2, '0')}${Math.max(0, g - 40).toString(16).padStart(2, '0')}${Math.max(0, b - 40).toString(16).padStart(2, '0')}`,
    muted: `#${Math.floor(r * 0.7).toString(16).padStart(2, '0')}${Math.floor(g * 0.7).toString(16).padStart(2, '0')}${Math.floor(b * 0.7).toString(16).padStart(2, '0')}`
  };
}

export function validateCustomization(customization: Partial<TemplateCustomization>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (customization.colors) {
    Object.entries(customization.colors).forEach(([key, value]) => {
      if (value && !value.match(/^#[0-9A-Fa-f]{6}$/)) {
        errors.push(`Invalid color format for ${key}: ${value}`);
      }
    });
  }

  if (customization.fonts) {
    if (customization.fonts.heading && typeof customization.fonts.heading !== 'string') {
      errors.push('Heading font must be a string');
    }
    if (customization.fonts.body && typeof customization.fonts.body !== 'string') {
      errors.push('Body font must be a string');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}