import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers, responsiveGrids, responsiveGaps } from '../../utils/responsive-utils';

const FeatureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconColor: z.string().optional()
});

export const FeaturesGridPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  features: z.array(FeatureItemSchema),
  layout: z.enum(['2-col', '3-col', '4-col', 'masonry']).default('3-col'),
  style: z.enum(['cards', 'minimal', 'icons-prominent']).default('cards'),
  animation: z.enum(['stagger-up', 'fade-in-sequence', 'hover-lift']).default('stagger-up'),
  className: z.string().optional()
});

export type FeaturesGridProps = z.infer<typeof FeaturesGridPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function FeaturesGrid({
  title,
  subtitle,
  description,
  features,
  layout = '3-col',
  style = 'cards',
  animation = 'stagger-up',
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: FeaturesGridProps) {
  const layouts = {
    '2-col': responsiveGrids['2-col'],
    '3-col': responsiveGrids['3-col'],
    '4-col': responsiveGrids['4-col'],
    'masonry': 'columns-1 sm:columns-2 lg:columns-3'
  };

  const styles = {
    cards: `bg-white ${responsiveSpacing.card.p} rounded-xl shadow-lg hover:shadow-xl transition-shadow`,
    minimal: responsiveSpacing.component.py,
    'icons-prominent': `text-center ${responsiveSpacing.card.p}`
  };

  const animations = {
    'stagger-up': 'animate-stagger-up',
    'fade-in-sequence': 'animate-fade-sequence',
    'hover-lift': 'hover:transform hover:-translate-y-2 transition-transform duration-300'
  };

  const handleElementClick = (elementId: string, elementType: string) => 
    createElementClickHandler(elementId, elementType, onElementClick);

  return (
    <EditableElement
      id="features-grid-section"
      onClick={handleElementClick('features-grid-section', 'section')}
      data-editable-type="section"
    >
      <section 
        className={getElementClassName('features-grid-section', `${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-gray-50 ${className}`, selectedElementId)}
        style={getElementStyle('features-grid-section', customStyles)}
      >
        <EditableElement
          id="features-grid-container"
          onClick={handleElementClick('features-grid-container', 'container')}
          data-editable-type="container"
        >
          <div className={`${responsiveContainers.wide} mx-auto`}>
            {/* Header */}
            <EditableElement
              id="features-grid-header"
              onClick={handleElementClick('features-grid-header', 'container')}
              data-editable-type="container"
            >
              <div className="text-center mb-12 sm:mb-16">
                {subtitle && (
                  <EditableElement
                    id="features-grid-subtitle"
                    onClick={handleElementClick('features-grid-subtitle', 'text')}
                    data-editable-type="text"
                  >
                    <p 
                      className={getElementClassName('features-grid-subtitle', `${responsiveText.caption} font-medium tracking-wide uppercase mb-3 sm:mb-4 text-blue-600`, selectedElementId)}
                      style={getElementStyle('features-grid-subtitle', customStyles)}
                    >
                      {subtitle}
                    </p>
                  </EditableElement>
                )}
                
                <EditableElement
                  id="features-grid-title"
                  onClick={handleElementClick('features-grid-title', 'text')}
                  data-editable-type="text"
                >
                  <h2 
                    className={getElementClassName('features-grid-title', `${responsiveText.h1} font-bold mb-4 sm:mb-6 text-gray-900`, selectedElementId)}
                    style={getElementStyle('features-grid-title', customStyles)}
                  >
                    {title}
                  </h2>
                </EditableElement>
                
                {description && (
                  <EditableElement
                    id="features-grid-description"
                    onClick={handleElementClick('features-grid-description', 'text')}
                    data-editable-type="text"
                  >
                    <p 
                      className={getElementClassName('features-grid-description', `${responsiveText.lead} text-gray-600 ${responsiveContainers.content} mx-auto`, selectedElementId)}
                      style={getElementStyle('features-grid-description', customStyles)}
                    >
                      {description}
                    </p>
                  </EditableElement>
                )}
              </div>
            </EditableElement>

            {/* Features Grid */}
            <EditableElement
              id="features-grid-wrapper"
              onClick={handleElementClick('features-grid-wrapper', 'container')}
              data-editable-type="container"
            >
              <div className={`grid ${responsiveGaps.normal} ${layouts[layout]} ${layout !== 'masonry' ? animations[animation] : ''}`}>
                {features.map((feature, index) => (
                  <EditableElement
                    key={index}
                    id={`features-grid-item-${index}`}
                    onClick={handleElementClick(`features-grid-item-${index}`, 'container')}
                    data-editable-type="container"
                  >
                    <div
                      className={getElementClassName(`features-grid-item-${index}`, `${styles[style]} ${animations['hover-lift']}`, selectedElementId)}
                      style={{
                        ...getElementStyle(`features-grid-item-${index}`, customStyles),
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {feature.icon && (
                        <EditableElement
                          id={`features-grid-icon-${index}`}
                          onClick={handleElementClick(`features-grid-icon-${index}`, 'icon')}
                          data-editable-type="icon"
                        >
                          <div className={`mb-3 sm:mb-4 ${
                            style === 'icons-prominent' ? 'mx-auto w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16' : 'w-10 h-10 sm:w-12 sm:h-12'
                          } flex items-center justify-center`}>
                            <div 
                              className={getElementClassName(`features-grid-icon-${index}`, `w-full h-full rounded-lg flex items-center justify-center text-lg sm:text-xl lg:text-2xl ${
                                feature.iconColor || 'bg-blue-100 text-blue-600'
                              }`, selectedElementId)}
                              style={getElementStyle(`features-grid-icon-${index}`, customStyles)}
                            >
                              {feature.icon}
                            </div>
                          </div>
                        </EditableElement>
                      )}
                      
                      <EditableElement
                        id={`features-grid-title-${index}`}
                        onClick={handleElementClick(`features-grid-title-${index}`, 'text')}
                        data-editable-type="text"
                      >
                        <h3 
                          className={getElementClassName(`features-grid-title-${index}`, `${responsiveText.h3} font-semibold mb-2 sm:mb-3 text-gray-900 ${
                            style === 'icons-prominent' ? 'text-center' : ''
                          }`, selectedElementId)}
                          style={getElementStyle(`features-grid-title-${index}`, customStyles)}
                        >
                          {feature.title}
                        </h3>
                      </EditableElement>
                      
                      <EditableElement
                        id={`features-grid-description-${index}`}
                        onClick={handleElementClick(`features-grid-description-${index}`, 'text')}
                        data-editable-type="text"
                      >
                        <p 
                          className={getElementClassName(`features-grid-description-${index}`, `${responsiveText.body} text-gray-600 leading-relaxed ${
                            style === 'icons-prominent' ? 'text-center' : ''
                          }`, selectedElementId)}
                          style={getElementStyle(`features-grid-description-${index}`, customStyles)}
                        >
                          {feature.description}
                        </p>
                      </EditableElement>
                    </div>
                  </EditableElement>
                ))}
              </div>
            </EditableElement>
          </div>
        </EditableElement>
      </section>
    </EditableElement>
  );
}

export default FeaturesGrid;