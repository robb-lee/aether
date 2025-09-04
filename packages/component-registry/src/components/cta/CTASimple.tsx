import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';

export const CTASimplePropsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  ctaText: z.string(),
  ctaHref: z.string().optional(),
  layout: z.enum(['center', 'left', 'right', 'full-width']).default('center'),
  style: z.enum(['solid', 'outline', 'gradient', 'text']).default('solid'),
  className: z.string().optional()
});

export type CTASimpleProps = z.infer<typeof CTASimplePropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function CTASimple({
  title,
  description,
  ctaText,
  ctaHref = '#',
  layout = 'center',
  style = 'solid',
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: CTASimpleProps) {
  const layouts = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
    'full-width': 'text-center'
  };

  const styles = {
    solid: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
    text: 'text-blue-600 hover:text-blue-700 underline'
  };

  const handleElementClick = (elementId: string, elementType: string) => 
    createElementClickHandler(elementId, elementType, onElementClick);

  return (
    <EditableElement
      id="cta-simple-section"
      onClick={handleElementClick('cta-simple-section', 'section')}
      data-editable-type="section"
    >
      <section 
        className={getElementClassName('cta-simple-section', `py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 ${className}`, selectedElementId)}
        style={getElementStyle('cta-simple-section', customStyles)}
      >
        <EditableElement
          id="cta-simple-container"
          onClick={handleElementClick('cta-simple-container', 'container')}
          data-editable-type="container"
        >
          <div className="max-w-4xl mx-auto">
            <EditableElement
              id="cta-simple-content"
              onClick={handleElementClick('cta-simple-content', 'container')}
              data-editable-type="container"
            >
              <div className={layouts[layout]}>
                <EditableElement
                  id="cta-simple-title"
                  onClick={handleElementClick('cta-simple-title', 'text')}
                  data-editable-type="text"
                >
                  <h2 
                    className={getElementClassName('cta-simple-title', 'text-3xl md:text-4xl font-bold text-gray-900 mb-4', selectedElementId)}
                    style={getElementStyle('cta-simple-title', customStyles)}
                  >
                    {title}
                  </h2>
                </EditableElement>
                
                {description && (
                  <EditableElement
                    id="cta-simple-description"
                    onClick={handleElementClick('cta-simple-description', 'text')}
                    data-editable-type="text"
                  >
                    <p 
                      className={getElementClassName('cta-simple-description', 'text-lg text-gray-600 mb-8', selectedElementId)}
                      style={getElementStyle('cta-simple-description', customStyles)}
                    >
                      {description}
                    </p>
                  </EditableElement>
                )}
                
                <EditableElement
                  id="cta-simple-button"
                  onClick={handleElementClick('cta-simple-button', 'button')}
                  data-editable-type="button"
                >
                  <a
                    href={ctaHref}
                    className={getElementClassName('cta-simple-button', `inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${styles[style]} ${
                      layout === 'full-width' ? 'w-full sm:w-auto' : ''
                    }`, selectedElementId)}
                    style={getElementStyle('cta-simple-button', customStyles)}
                  >
                    {ctaText}
                  </a>
                </EditableElement>
              </div>
            </EditableElement>
          </div>
        </EditableElement>
      </section>
    </EditableElement>
  );
}

export default CTASimple;