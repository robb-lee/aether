import React from 'react';
import { z } from 'zod';

/**
 * Props schema for Hero Video Background component
 */
export const HeroVideoBgPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  ctaText: z.string(),
  ctaHref: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  videoUrl: z.string().optional(),
  posterImage: z.string().optional(),
  layout: z.enum(['overlay-center', 'overlay-bottom', 'side-content']).default('overlay-center'),
  style: z.enum(['cinematic', 'bright', 'dramatic']).default('cinematic'),
  animation: z.enum(['video-fade', 'text-reveal', 'overlay-slide']).default('video-fade'),
  autoplay: z.boolean().default(true),
  muted: z.boolean().default(true),
  loop: z.boolean().default(true),
  className: z.string().optional()
});

export type HeroVideoBgProps = z.infer<typeof HeroVideoBgPropsSchema>;

/**
 * Hero Video Background - Perfect for entertainment and lifestyle brands
 */
export function HeroVideoBg({
  title,
  subtitle,
  description,
  ctaText,
  ctaHref = '#',
  secondaryCtaText,
  secondaryCtaHref = '#',
  videoUrl,
  posterImage,
  layout = 'overlay-center',
  style = 'cinematic',
  animation = 'video-fade',
  autoplay = true,
  muted = true,
  loop = true,
  className = ''
}: HeroVideoBgProps) {
  const layouts = {
    'overlay-center': 'absolute inset-0 flex items-center justify-center text-center',
    'overlay-bottom': 'absolute inset-x-0 bottom-0 p-8 text-center',
    'side-content': 'absolute inset-y-0 left-0 w-1/2 flex items-center p-8'
  };

  const styles = {
    cinematic: {
      overlay: 'bg-black/40',
      text: 'text-white',
      subtitle: 'text-blue-200',
      description: 'text-gray-200'
    },
    bright: {
      overlay: 'bg-white/20 backdrop-blur-sm',
      text: 'text-white',
      subtitle: 'text-yellow-200',
      description: 'text-gray-100'
    },
    dramatic: {
      overlay: 'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
      text: 'text-white',
      subtitle: 'text-red-300',
      description: 'text-gray-200'
    }
  };

  const animations = {
    'video-fade': 'animate-fade-in-slow',
    'text-reveal': 'animate-text-reveal',
    'overlay-slide': 'animate-slide-up-slow'
  };

  return (
    <section className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Video Background */}
      {videoUrl ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline
          poster={posterImage}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: posterImage 
              ? `url(${posterImage})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 ${styles[style].overlay}`} />

      {/* Content */}
      <div className={`${layouts[layout]} ${animations[animation]}`}>
        <div className="max-w-4xl mx-auto px-4">
          {subtitle && (
            <p className={`text-sm font-medium tracking-wide uppercase mb-4 ${styles[style].subtitle}`}>
              {subtitle}
            </p>
          )}
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${styles[style].text}`}>
            {title}
          </h1>
          
          {description && (
            <p className={`text-lg md:text-xl mb-8 leading-relaxed ${styles[style].description} max-w-2xl ${
              layout === 'overlay-center' ? 'mx-auto' : ''
            }`}>
              {description}
            </p>
          )}
          
          <div className={`flex flex-col sm:flex-row gap-4 ${
            layout === 'overlay-center' ? 'justify-center' : ''
          }`}>
            <a
              href={ctaHref}
              className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center"
            >
              {ctaText}
            </a>
            
            {secondaryCtaText && (
              <a
                href={secondaryCtaHref}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 text-center"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator for overlay-center layout */}
      {layout === 'overlay-center' && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </section>
  );
}

export default HeroVideoBg;