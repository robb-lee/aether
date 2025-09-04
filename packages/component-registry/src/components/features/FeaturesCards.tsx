import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';

const FeatureCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  image: z.string().optional()
});

export const FeaturesCardsPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  features: z.array(FeatureCardSchema),
  layout: z.enum(['horizontal', 'vertical', 'mixed']).default('vertical'),
  style: z.enum(['shadowed', 'bordered', 'flat', 'gradient']).default('shadowed'),
  className: z.string().optional()
});

export type FeaturesCardsProps = z.infer<typeof FeaturesCardsPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function FeaturesCards({
  title,
  subtitle,
  features,
  layout = 'vertical',
  style = 'shadowed',
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: FeaturesCardsProps) {
  const styles = {
    shadowed: 'bg-white rounded-xl shadow-lg hover:shadow-xl',
    bordered: 'bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300',
    flat: 'bg-gray-50 rounded-xl hover:bg-white',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl'
  };

  const handleElementClick = (elementId: string, elementType: string) => 
    createElementClickHandler(elementId, elementType, onElementClick);

  return (
    <EditableElement
      id="features-cards-section"
      onClick={handleElementClick('features-cards-section', 'section')}
      data-editable-type="section"
    >
      <section 
        className={getElementClassName('features-cards-section', `py-20 px-4 sm:px-6 lg:px-8 ${className}`, selectedElementId)}
        style={getElementStyle('features-cards-section', customStyles)}
      >
        <EditableElement
          id="features-cards-container"
          onClick={handleElementClick('features-cards-container', 'container')}
          data-editable-type="container"
        >
          <div className="max-w-7xl mx-auto">
            <EditableElement
              id="features-cards-header"
              onClick={handleElementClick('features-cards-header', 'container')}
              data-editable-type="container"
            >
              <div className="text-center mb-16">
                {subtitle && (
                  <EditableElement
                    id="features-cards-subtitle"
                    onClick={handleElementClick('features-cards-subtitle', 'text')}
                    data-editable-type="text"
                  >
                    <p 
                      className={getElementClassName('features-cards-subtitle', 'text-blue-600 font-medium mb-4', selectedElementId)}
                      style={getElementStyle('features-cards-subtitle', customStyles)}
                    >
                      {subtitle}
                    </p>
                  </EditableElement>
                )}
                <EditableElement
                  id="features-cards-title"
                  onClick={handleElementClick('features-cards-title', 'text')}
                  data-editable-type="text"
                >
                  <h2 
                    className={getElementClassName('features-cards-title', 'text-3xl md:text-4xl font-bold text-gray-900 mb-6', selectedElementId)}
                    style={getElementStyle('features-cards-title', customStyles)}
                  >
                    {title}
                  </h2>
                </EditableElement>
              </div>
            </EditableElement>
            
            <EditableElement
              id="features-cards-grid"
              onClick={handleElementClick('features-cards-grid', 'container')}
              data-editable-type="container"
            >
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <EditableElement
                    key={index}
                    id={`features-cards-item-${index}`}
                    onClick={handleElementClick(`features-cards-item-${index}`, 'container')}
                    data-editable-type="container"
                  >
                    <div 
                      className={getElementClassName(`features-cards-item-${index}`, `p-6 transition-all duration-300 ${styles[style]}`, selectedElementId)}
                      style={getElementStyle(`features-cards-item-${index}`, customStyles)}
                    >
                      {feature.icon && (
                        <EditableElement
                          id={`features-cards-icon-${index}`}
                          onClick={handleElementClick(`features-cards-icon-${index}`, 'icon')}
                          data-editable-type="icon"
                        >
                          <div 
                            className={getElementClassName(`features-cards-icon-${index}`, 'w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4', selectedElementId)}
                            style={getElementStyle(`features-cards-icon-${index}`, customStyles)}
                          >
                            <span className="text-2xl">{feature.icon}</span>
                          </div>
                        </EditableElement>
                      )}
                      
                      <EditableElement
                        id={`features-cards-item-title-${index}`}
                        onClick={handleElementClick(`features-cards-item-title-${index}`, 'text')}
                        data-editable-type="text"
                      >
                        <h3 
                          className={getElementClassName(`features-cards-item-title-${index}`, 'text-xl font-semibold mb-3 text-gray-900', selectedElementId)}
                          style={getElementStyle(`features-cards-item-title-${index}`, customStyles)}
                        >
                          {feature.title}
                        </h3>
                      </EditableElement>
                      
                      <EditableElement
                        id={`features-cards-item-description-${index}`}
                        onClick={handleElementClick(`features-cards-item-description-${index}`, 'text')}
                        data-editable-type="text"
                      >
                        <p 
                          className={getElementClassName(`features-cards-item-description-${index}`, 'text-gray-600', selectedElementId)}
                          style={getElementStyle(`features-cards-item-description-${index}`, customStyles)}
                        >
                          {feature.description}
                        </p>
                      </EditableElement>
                      
                      {feature.image && (
                        <EditableElement
                          id={`features-cards-item-image-${index}`}
                          onClick={handleElementClick(`features-cards-item-image-${index}`, 'image')}
                          data-editable-type="image"
                        >
                          <img 
                            src={feature.image} 
                            alt={feature.title} 
                            className={getElementClassName(`features-cards-item-image-${index}`, 'mt-4 rounded-lg', selectedElementId)}
                            style={getElementStyle(`features-cards-item-image-${index}`, customStyles)}
                          />
                        </EditableElement>
                      )}
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
}

export default FeaturesCards;