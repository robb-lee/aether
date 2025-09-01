import React from 'react';
import { z } from 'zod';

/**
 * Props schema for Hero Split component
 */
export const HeroSplitPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  ctaText: z.string(),
  ctaHref: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  layout: z.enum(['left-content', 'right-content', 'alternating']).default('left-content'),
  style: z.enum(['modern', 'corporate', 'playful']).default('modern'),
  animation: z.enum(['slide-in', 'fade-parallax', 'stagger']).default('slide-in'),
  showDemo: z.boolean().default(false),
  demoImageUrl: z.string().optional(),
  className: z.string().optional()
});

export type HeroSplitProps = z.infer<typeof HeroSplitPropsSchema>;

/**
 * Hero Split - Perfect for SaaS and tech products needing explanation
 */
export function HeroSplit({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref = '#',
  secondaryCtaText,
  secondaryCtaHref = '#',
  imageUrl,
  imageAlt = 'Hero image',
  layout = 'left-content',
  style = 'modern',
  animation = 'slide-in',
  showDemo = false,
  demoImageUrl,
  className = ''
}: HeroSplitProps) {
  const isRightLayout = layout === 'right-content';
  
  const styles = {
    modern: {
      bg: 'bg-gradient-to-br from-gray-50 to-white',
      text: 'text-gray-900',
      subtitle: 'text-blue-600',
      description: 'text-gray-600'
    },
    corporate: {
      bg: 'bg-white',
      text: 'text-gray-900',
      subtitle: 'text-indigo-600',
      description: 'text-gray-700'
    },
    playful: {
      bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
      text: 'text-gray-900',
      subtitle: 'text-purple-600',
      description: 'text-gray-600'
    }
  };

  const animations = {
    'slide-in': isRightLayout ? 'animate-slide-in-right' : 'animate-slide-in-left',
    'fade-parallax': 'animate-fade-parallax',
    'stagger': 'animate-stagger'
  };

  const ContentSection = () => (
    <div className={`flex-1 ${animations[animation]}`}>
      {subtitle && (
        <p className={`text-sm font-medium tracking-wide uppercase mb-4 ${styles[style].subtitle}`}>
          {subtitle}
        </p>
      )}
      
      <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${styles[style].text}`}>
        {title}
      </h1>
      
      {description && (
        <p className={`text-lg md:text-xl mb-8 leading-relaxed ${styles[style].description}`}>
          {description}
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={ctaHref}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
        >
          {ctaText}
        </a>
        
        {secondaryCtaText && (
          <a
            href={secondaryCtaHref}
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 text-center"
          >
            {secondaryCtaText}
          </a>
        )}
      </div>
      
      {showDemo && (
        <p className="mt-6 text-sm text-gray-500">
          ⚡ Try it free - No credit card required
        </p>
      )}
    </div>
  );

  const ImageSection = () => (
    <div className="flex-1 relative">
      {imageUrl || demoImageUrl ? (
        <div className="relative">
          <img
            src={imageUrl || demoImageUrl}
            alt={imageAlt}
            className="w-full h-auto rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
          {showDemo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl flex items-end p-6">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                Live Demo
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500">Hero Image Placeholder</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className={`${styles[style].bg} py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col gap-12 items-center ${
          isRightLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}>
          <ContentSection />
          <ImageSection />
        </div>
      </div>
    </section>
  );
}

export default HeroSplit;