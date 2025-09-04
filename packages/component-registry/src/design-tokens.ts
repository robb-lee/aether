/**
 * Design Token System
 * 
 * Foundation tokens for the Aether design system based on the architecture document.
 * These tokens provide the base layer that Design Kits will reference.
 */

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

// Token utility functions
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