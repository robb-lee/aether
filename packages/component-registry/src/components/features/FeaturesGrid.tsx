import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';

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
    '2-col': 'grid-cols-1 md:grid-cols-2',
    '3-col': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4-col': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    'masonry': 'columns-1 md:columns-2 lg:columns-3'
  };

  const styles = {
    cards: 'bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow',
    minimal: 'p-4',
    'icons-prominent': 'text-center p-6'
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
        className={getElementClassName('features-grid-section', `py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 ${className}`, selectedElementId)}
        style={getElementStyle('features-grid-section', customStyles)}
      >
        <EditableElement
          id="features-grid-container"
          onClick={handleElementClick('features-grid-container', 'container')}
          data-editable-type="container"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <EditableElement
              id="features-grid-header"
              onClick={handleElementClick('features-grid-header', 'container')}
              data-editable-type="container"
            >
              <div className="text-center mb-16">
                {subtitle && (
                  <EditableElement
                    id="features-grid-subtitle"
                    onClick={handleElementClick('features-grid-subtitle', 'text')}
                    data-editable-type="text"
                  >
                    <p 
                      className={getElementClassName('features-grid-subtitle', 'text-sm font-medium tracking-wide uppercase mb-4 text-blue-600', selectedElementId)}
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
                    className={getElementClassName('features-grid-title', 'text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900', selectedElementId)}
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
                      className={getElementClassName('features-grid-description', 'text-lg md:text-xl text-gray-600 max-w-3xl mx-auto', selectedElementId)}
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
              <div className={`grid gap-8 ${layouts[layout]} ${layout !== 'masonry' ? animations[animation] : ''}`}>
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
                          <div className={`mb-4 ${
                            style === 'icons-prominent' ? 'mx-auto w-16 h-16' : 'w-12 h-12'
                          } flex items-center justify-center`}>
                            <div 
                              className={getElementClassName(`features-grid-icon-${index}`, `w-full h-full rounded-lg flex items-center justify-center text-2xl ${
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
                          className={getElementClassName(`features-grid-title-${index}`, `text-xl font-semibold mb-3 text-gray-900 ${
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
                          className={getElementClassName(`features-grid-description-${index}`, `text-gray-600 leading-relaxed ${
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