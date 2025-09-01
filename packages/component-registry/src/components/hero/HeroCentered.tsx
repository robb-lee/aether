import React from 'react';
import { z } from 'zod';

/**
 * Props schema for Hero Centered component
 */
export const HeroCenteredPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  ctaText: z.string(),
  ctaHref: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  backgroundImage: z.string().optional(),
  variant: z.enum(['center', 'offset-left', 'offset-right']).default('center'),
  style: z.enum(['minimal', 'rich', 'gradient']).default('minimal'),
  animation: z.enum(['fade-in', 'slide-up', 'zoom-in']).default('fade-in'),
  className: z.string().optional()
});

export type HeroCenteredProps = z.infer<typeof HeroCenteredPropsSchema>;

/**
 * Hero Centered - Perfect for product showcases and focused messaging
 */
export function HeroCentered({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref = '#',
  secondaryCtaText,
  secondaryCtaHref = '#',
  backgroundImage,
  variant = 'center',
  style = 'minimal',
  animation = 'fade-in',
  className = ''
}: HeroCenteredProps) {
  const variants = {
    center: 'text-center',
    'offset-left': 'text-left max-w-2xl',
    'offset-right': 'text-right max-w-2xl ml-auto'
  };

  const styles = {
    minimal: 'bg-white',
    rich: 'bg-gradient-to-b from-gray-50 to-white',
    gradient: 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white'
  };

  const animations = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'zoom-in': 'animate-zoom-in'
  };

  return (
    <section 
      className={`
        relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center
        ${styles[style]}
        ${className}
      `}
      style={backgroundImage ? { 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className={`${variants[variant]} ${animations[animation]}`}>
          {subtitle && (
            <p className={`
              text-sm font-medium tracking-wide uppercase mb-4
              ${style === 'gradient' ? 'text-blue-200' : 'text-blue-600'}
            `}>
              {subtitle}
            </p>
          )}
          
          <h1 className={`
            text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight
            ${style === 'gradient' ? 'text-white' : 'text-gray-900'}
          `}>
            {title}
          </h1>
          
          {description && (
            <p className={`
              text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed
              ${style === 'gradient' ? 'text-gray-200' : 'text-gray-600'}
            `}>
              {description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={ctaHref}
              className={`
                px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300
                transform hover:scale-105 hover:shadow-lg
                ${style === 'gradient' 
                  ? 'bg-white text-blue-600 hover:bg-gray-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {ctaText}
            </a>
            
            {secondaryCtaText && (
              <a
                href={secondaryCtaHref}
                className={`
                  px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300
                  border-2 hover:bg-opacity-10
                  ${style === 'gradient'
                    ? 'border-white text-white hover:bg-white'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }
                `}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative elements for rich style */}
      {style === 'rich' && (
        <>
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-xl"></div>
        </>
      )}
    </section>
  );
}

export default HeroCentered;