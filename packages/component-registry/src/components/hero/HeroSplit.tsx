import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers, getButtonGroupClasses, getContentImageClasses } from '../../utils/responsive-utils';

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

export type HeroSplitProps = z.infer<typeof HeroSplitPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
};


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
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {}
}: HeroSplitProps) {
  const isRightLayout = layout === 'right-content';
  
  const styles = {
    modern: {
      bg: 'bg-gradient-to-br from-blue-100 via-blue-50 to-white',
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

  const handleElementClick = (elementId: string, elementType: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementClick?.(elementId, elementType);
  };

  // Use shared helper functions from EditableElement

  const ContentSection = () => (
    <EditableElement
      id="hero-content-wrapper"
      className={`flex-1 ${animations[animation]}`}
      onClick={handleElementClick('hero-content-wrapper', 'container')}
      data-editable-type="container"
    >
      {subtitle && (
        <EditableElement
          id="hero-subtitle"
          className=""
          onClick={handleElementClick('hero-subtitle', 'text')}
          data-editable-type="text"
        >
          <p 
            className={getElementClassName('hero-subtitle', `${responsiveText.caption} font-medium tracking-wide uppercase mb-3 sm:mb-4 ${styles[style].subtitle}`, selectedElementId)}
            style={getElementStyle('hero-subtitle', customStyles)}
          >
            {subtitle}
          </p>
        </EditableElement>
      )}
      
      <EditableElement
        id="hero-title"
        className=""
        onClick={handleElementClick('hero-title', 'text')}
        data-editable-type="text"
      >
        <h1 
          className={getElementClassName('hero-title', `${responsiveText.display} font-bold mb-4 sm:mb-6 leading-tight ${styles[style].text}`, selectedElementId)}
          style={getElementStyle('hero-title', customStyles)}
        >
          {title}
        </h1>
      </EditableElement>
      
      {description && (
        <EditableElement
          id="hero-description"
          className=""
          onClick={handleElementClick('hero-description', 'text')}
          data-editable-type="text"
        >
          <p 
            className={getElementClassName('hero-description', `${responsiveText.lead} mb-6 sm:mb-8 leading-relaxed ${styles[style].description}`, selectedElementId)}
            style={getElementStyle('hero-description', customStyles)}
          >
            {description}
          </p>
        </EditableElement>
      )}
      
      <EditableElement
        id="hero-button-group"
        className=""
        onClick={handleElementClick('hero-button-group', 'container')}
        data-editable-type="container"
      >
        <div className={getButtonGroupClasses('stack')}>
          <EditableElement
            id="hero-primary-button"
            className=""
            onClick={handleElementClick('hero-primary-button', 'button')}
            data-editable-type="button"
          >
            <a
              href={ctaHref}
              className={getElementClassName('hero-primary-button', `${responsiveSpacing.button.px} ${responsiveSpacing.button.py} bg-blue-600 text-white rounded-lg font-semibold ${responsiveText.body} hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center w-full sm:w-auto`, selectedElementId)}
              style={getElementStyle('hero-primary-button', customStyles)}
            >
              {ctaText}
            </a>
          </EditableElement>
          
          {secondaryCtaText && (
            <EditableElement
              id="hero-secondary-button"
              className=""
              onClick={handleElementClick('hero-secondary-button', 'button')}
              data-editable-type="button"
            >
              <a
                href={secondaryCtaHref}
                className={getElementClassName('hero-secondary-button', `${responsiveSpacing.button.px} ${responsiveSpacing.button.py} border-2 border-blue-600 text-blue-600 rounded-lg font-semibold ${responsiveText.body} hover:bg-blue-600 hover:text-white transition-all duration-300 text-center w-full sm:w-auto`, selectedElementId)}
                style={getElementStyle('hero-secondary-button', customStyles)}
              >
                {secondaryCtaText}
              </a>
            </EditableElement>
          )}
        </div>
      </EditableElement>
      
      {showDemo && (
        <EditableElement
          id="hero-demo-text"
          className=""
          onClick={handleElementClick('hero-demo-text', 'text')}
          data-editable-type="text"
        >
          <p className={getElementClassName('hero-demo-text', "mt-6 text-sm text-gray-500", selectedElementId)}>
            ⚡ Try it free - No credit card required
          </p>
        </EditableElement>
      )}
    </EditableElement>
  );

  const ImageSection = () => (
    <EditableElement
      id="hero-image-wrapper"
      className="flex-1 relative"
      onClick={handleElementClick('hero-image-wrapper', 'container')}
      data-editable-type="container"
    >
      {imageUrl || demoImageUrl ? (
        <div className="relative">
          <EditableElement
            id="hero-image"
            className=""
            onClick={handleElementClick('hero-image', 'image')}
            data-editable-type="image"
          >
            <img
              src={imageUrl || demoImageUrl}
              alt={imageAlt}
              className={getElementClassName('hero-image', "w-full h-auto max-h-96 sm:max-h-[500px] lg:max-h-[600px] object-cover rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500", selectedElementId)}
            />
          </EditableElement>
          {showDemo && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl flex items-end p-6">
              <EditableElement
                id="hero-demo-badge"
                className=""
                onClick={handleElementClick('hero-demo-badge', 'text')}
                data-editable-type="text"
              >
                <span className={getElementClassName('hero-demo-badge', "bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900", selectedElementId)}>
                  Live Demo
                </span>
              </EditableElement>
            </div>
          )}
        </div>
      ) : (
        <EditableElement
          id="hero-image-placeholder"
          className=""
          onClick={handleElementClick('hero-image-placeholder', 'placeholder')}
          data-editable-type="placeholder"
        >
          <div className={getElementClassName('hero-image-placeholder', "w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center", selectedElementId)}>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-blue-200 rounded-lg mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-gray-500">Hero Image Placeholder</p>
            </div>
          </div>
        </EditableElement>
      )}
    </EditableElement>
  );

  return (
    <EditableElement
      id="hero-section"
      className=""
      onClick={handleElementClick('hero-section', 'section')}
      data-editable-type="section"
    >
      <section className={getElementClassName('hero-section', `${styles[style].bg} ${responsiveSpacing.section.py} ${responsiveSpacing.section.px} ${className}`, selectedElementId)}>
        <EditableElement
          id="hero-container"
          className=""
          onClick={handleElementClick('hero-container', 'container')}
          data-editable-type="container"
        >
          <div className={`${responsiveContainers.wide} mx-auto`}>
            <div className={`${getContentImageClasses('split')} ${
              isRightLayout ? 'lg:flex-row-reverse' : ''
            }`}>
              <ContentSection />
              <ImageSection />
            </div>
          </div>
        </EditableElement>
      </section>
    </EditableElement>
  );
}

export default HeroSplit;