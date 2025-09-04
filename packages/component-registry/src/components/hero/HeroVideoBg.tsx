import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers, getButtonGroupClasses } from '../../utils/responsive-utils';

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

export type HeroVideoBgProps = z.infer<typeof HeroVideoBgPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

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
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: HeroVideoBgProps) {
  const layouts = {
    'overlay-center': 'absolute inset-0 flex items-center justify-center text-center',
    'overlay-bottom': `absolute inset-x-0 bottom-0 ${responsiveSpacing.container.py} ${responsiveSpacing.container.px} text-center`,
    'side-content': `absolute inset-y-0 left-0 w-full lg:w-1/2 flex items-center ${responsiveSpacing.container.py} ${responsiveSpacing.container.px}`
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

  const handleElementClick = (elementId: string, elementType: string) => 
    createElementClickHandler(elementId, elementType, onElementClick);

  return (
    <EditableElement
      id="hero-video-section"
      onClick={handleElementClick('hero-video-section', 'section')}
      data-editable-type="section"
    >
      <section 
        className={getElementClassName('hero-video-section', `relative min-h-screen overflow-hidden ${className}`, selectedElementId)}
        style={getElementStyle('hero-video-section', customStyles)}
      >
        {/* Video Background */}
        <EditableElement
          id="hero-video-background"
          onClick={handleElementClick('hero-video-background', 'video')}
          data-editable-type="video"
        >
          {videoUrl ? (
            <video
              className={getElementClassName('hero-video-background', 'absolute inset-0 w-full h-full object-cover', selectedElementId)}
              style={getElementStyle('hero-video-background', customStyles)}
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
              className={getElementClassName('hero-video-background', 'absolute inset-0 w-full h-full bg-cover bg-center', selectedElementId)}
              style={{
                ...getElementStyle('hero-video-background', customStyles),
                backgroundImage: posterImage 
                  ? `url(${posterImage})` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            />
          )}
        </EditableElement>

        {/* Overlay */}
        <EditableElement
          id="hero-video-overlay"
          onClick={handleElementClick('hero-video-overlay', 'container')}
          data-editable-type="container"
        >
          <div 
            className={getElementClassName('hero-video-overlay', `absolute inset-0 ${styles[style].overlay}`, selectedElementId)}
            style={getElementStyle('hero-video-overlay', customStyles)}
          />
        </EditableElement>

        {/* Content */}
        <EditableElement
          id="hero-video-content-wrapper"
          className={`${layouts[layout]} ${animations[animation]}`}
          onClick={handleElementClick('hero-video-content-wrapper', 'container')}
          data-editable-type="container"
        >
          <div className={`${responsiveContainers.content} mx-auto ${responsiveSpacing.container.px}`}>
            {subtitle && (
              <EditableElement
                id="hero-video-subtitle"
                onClick={handleElementClick('hero-video-subtitle', 'text')}
                data-editable-type="text"
              >
                <p 
                  className={getElementClassName('hero-video-subtitle', `${responsiveText.caption} font-medium tracking-wide uppercase mb-3 sm:mb-4 ${styles[style].subtitle}`, selectedElementId)}
                  style={getElementStyle('hero-video-subtitle', customStyles)}
                >
                  {subtitle}
                </p>
              </EditableElement>
            )}
            
            <EditableElement
              id="hero-video-title"
              onClick={handleElementClick('hero-video-title', 'text')}
              data-editable-type="text"
            >
              <h1 
                className={getElementClassName('hero-video-title', `${responsiveText.display} font-bold mb-4 sm:mb-6 leading-tight ${styles[style].text}`, selectedElementId)}
                style={getElementStyle('hero-video-title', customStyles)}
              >
                {title}
              </h1>
            </EditableElement>
            
            {description && (
              <EditableElement
                id="hero-video-description"
                onClick={handleElementClick('hero-video-description', 'text')}
                data-editable-type="text"
              >
                <p 
                  className={getElementClassName('hero-video-description', `${responsiveText.lead} mb-6 sm:mb-8 leading-relaxed ${styles[style].description} ${responsiveContainers.narrow} ${
                    layout === 'overlay-center' ? 'mx-auto' : ''
                  }`, selectedElementId)}
                  style={getElementStyle('hero-video-description', customStyles)}
                >
                  {description}
                </p>
              </EditableElement>
            )}
            
            <EditableElement
              id="hero-video-button-group"
              onClick={handleElementClick('hero-video-button-group', 'container')}
              data-editable-type="container"
            >
              <div className={`${getButtonGroupClasses('stack')} ${
                layout === 'overlay-center' ? 'justify-center' : ''
              }`}>
                <EditableElement
                  id="hero-video-primary-button"
                  onClick={handleElementClick('hero-video-primary-button', 'button')}
                  data-editable-type="button"
                >
                  <a
                    href={ctaHref}
                    className={getElementClassName('hero-video-primary-button', `${responsiveSpacing.button.px} ${responsiveSpacing.button.py} bg-white text-gray-900 rounded-lg font-semibold ${responsiveText.body} hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center w-full sm:w-auto`, selectedElementId)}
                    style={getElementStyle('hero-video-primary-button', customStyles)}
                  >
                    {ctaText}
                  </a>
                </EditableElement>
                
                {secondaryCtaText && (
                  <EditableElement
                    id="hero-video-secondary-button"
                    onClick={handleElementClick('hero-video-secondary-button', 'button')}
                    data-editable-type="button"
                  >
                    <a
                      href={secondaryCtaHref}
                      className={getElementClassName('hero-video-secondary-button', `${responsiveSpacing.button.px} ${responsiveSpacing.button.py} border-2 border-white text-white rounded-lg font-semibold ${responsiveText.body} hover:bg-white hover:text-gray-900 transition-all duration-300 text-center w-full sm:w-auto`, selectedElementId)}
                      style={getElementStyle('hero-video-secondary-button', customStyles)}
                    >
                      {secondaryCtaText}
                    </a>
                  </EditableElement>
                )}
              </div>
            </EditableElement>
          </div>
        </EditableElement>

        {/* Scroll indicator for overlay-center layout */}
        {layout === 'overlay-center' && (
          <EditableElement
            id="hero-video-scroll-indicator"
            onClick={handleElementClick('hero-video-scroll-indicator', 'icon')}
            data-editable-type="icon"
          >
            <div 
              className={getElementClassName('hero-video-scroll-indicator', 'absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce', selectedElementId)}
              style={getElementStyle('hero-video-scroll-indicator', customStyles)}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </EditableElement>
        )}
      </section>
    </EditableElement>
  );
}

export default HeroVideoBg;