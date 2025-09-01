import React from 'react';
import { z } from 'zod';

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

export type FeaturesCardsProps = z.infer<typeof FeaturesCardsPropsSchema>;

export function FeaturesCards({
  title,
  subtitle,
  features,
  layout = 'vertical',
  style = 'shadowed',
  className = ''
}: FeaturesCardsProps) {
  const styles = {
    shadowed: 'bg-white rounded-xl shadow-lg hover:shadow-xl',
    bordered: 'bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300',
    flat: 'bg-gray-50 rounded-xl hover:bg-white',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl'
  };

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {subtitle && (
            <p className="text-blue-600 font-medium mb-4">{subtitle}</p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className={`p-6 transition-all duration-300 ${styles[style]}`}>
              {feature.icon && (
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              {feature.image && (
                <img src={feature.image} alt={feature.title} className="mt-4 rounded-lg" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesCards;