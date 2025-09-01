import React from 'react';
import { z } from 'zod';

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

export type FeaturesGridProps = z.infer<typeof FeaturesGridPropsSchema>;

export function FeaturesGrid({
  title,
  subtitle,
  description,
  features,
  layout = '3-col',
  style = 'cards',
  animation = 'stagger-up',
  className = ''
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

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {subtitle && (
            <p className="text-sm font-medium tracking-wide uppercase mb-4 text-blue-600">
              {subtitle}
            </p>
          )}
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            {title}
          </h2>
          
          {description && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className={`grid gap-8 ${layouts[layout]} ${layout !== 'masonry' ? animations[animation] : ''}`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${styles[style]} ${animations['hover-lift']}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {feature.icon && (
                <div className={`mb-4 ${
                  style === 'icons-prominent' ? 'mx-auto w-16 h-16' : 'w-12 h-12'
                } flex items-center justify-center`}>
                  <div 
                    className={`w-full h-full rounded-lg flex items-center justify-center text-2xl ${
                      feature.iconColor || 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {feature.icon}
                  </div>
                </div>
              )}
              
              <h3 className={`text-xl font-semibold mb-3 text-gray-900 ${
                style === 'icons-prominent' ? 'text-center' : ''
              }`}>
                {feature.title}
              </h3>
              
              <p className={`text-gray-600 leading-relaxed ${
                style === 'icons-prominent' ? 'text-center' : ''
              }`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;