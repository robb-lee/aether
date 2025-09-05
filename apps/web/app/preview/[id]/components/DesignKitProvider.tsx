'use client'

import React, { createContext, useContext, useEffect } from 'react';
import { getDesignKit, DesignKitConfig } from '@aether/component-registry/design-system';

interface DesignKitContextType {
  kit: DesignKitConfig;
  kitId: string;
  applyKitToElement: (className: string) => string;
}

const DesignKitContext = createContext<DesignKitContextType | null>(null);

interface DesignKitProviderProps {
  kitId: string;
  children: React.ReactNode;
}

export function DesignKitProvider({ kitId, children }: DesignKitProviderProps) {
  const kit = getDesignKit(kitId);

  // Apply CSS variables to document root when kit changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing kit data attributes
    root.removeAttribute('data-kit');
    
    // Apply new kit
    root.setAttribute('data-kit', kitId);
    
    // Apply CSS variables
    Object.entries(kit.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply kit-specific body classes
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('kit-'))
      .concat(`kit-${kitId}`)
      .join(' ');

    // Cleanup on unmount
    return () => {
      Object.keys(kit.cssVariables).forEach(property => {
        root.style.removeProperty(property);
      });
      document.body.className = document.body.className
        .split(' ')
        .filter(cls => !cls.startsWith('kit-'))
        .join(' ');
    };
  }, [kit, kitId]);

  const applyKitToElement = (baseClassName: string = ''): string => {
    const kitClasses = [];
    
    // Add spacing based on kit preference
    const spacingMap = {
      'compact': 'space-y-4',
      'normal': 'space-y-6',
      'wide': 'space-y-8',
      'extra-wide': 'space-y-12'
    };
    kitClasses.push(spacingMap[kit.tokens.spacing]);
    
    // Add typography
    const fontMap = {
      'Inter': 'font-sans',
      'Merriweather': 'font-serif',
      'Bebas Neue': 'font-display',
      'system-ui': 'font-system'
    };
    kitClasses.push(fontMap[kit.tokens.primaryFont as keyof typeof fontMap] || 'font-sans');
    
    // Add border radius
    const radiusMap = {
      'none': 'rounded-none',
      'small': 'rounded-sm',
      'medium': 'rounded-md',
      'large': 'rounded-lg',
      'extra-large': 'rounded-xl'
    };
    kitClasses.push(radiusMap[kit.tokens.borderRadius]);
    
    // Add shadows
    const shadowMap = {
      'none': 'shadow-none',
      'minimal': 'shadow-sm',
      'soft': 'shadow-md',
      'dramatic': 'shadow-2xl'
    };
    kitClasses.push(shadowMap[kit.tokens.shadows]);
    
    // Add animations
    if (kit.tokens.animations === 'smooth') {
      kitClasses.push('transition-all', 'duration-300', 'ease-out');
    } else if (kit.tokens.animations === 'dynamic') {
      kitClasses.push('transition-all', 'duration-500', 'ease-spring');
    }
    
    return [baseClassName, ...kitClasses].filter(Boolean).join(' ');
  };

  const contextValue: DesignKitContextType = {
    kit,
    kitId,
    applyKitToElement,
  };

  return (
    <DesignKitContext.Provider value={contextValue}>
      {children}
    </DesignKitContext.Provider>
  );
}

export function useDesignKit(): DesignKitContextType {
  const context = useContext(DesignKitContext);
  if (!context) {
    throw new Error('useDesignKit must be used within a DesignKitProvider');
  }
  return context;
}

export function withDesignKit<T extends {}>(
  Component: React.ComponentType<T>
): React.ComponentType<T & { designKit?: string }> {
  return function WithDesignKitWrapper({ designKit = 'modern-saas', ...props }) {
    return (
      <DesignKitProvider kitId={designKit}>
        <Component {...(props as T)} />
      </DesignKitProvider>
    );
  };
}