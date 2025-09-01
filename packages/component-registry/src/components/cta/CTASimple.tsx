import React from 'react';
import { z } from 'zod';

export const CTASimplePropsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  ctaText: z.string(),
  ctaHref: z.string().optional(),
  layout: z.enum(['center', 'left', 'right', 'full-width']).default('center'),
  style: z.enum(['solid', 'outline', 'gradient', 'text']).default('solid'),
  className: z.string().optional()
});

export type CTASimpleProps = z.infer<typeof CTASimplePropsSchema>;

export function CTASimple({
  title,
  description,
  ctaText,
  ctaHref = '#',
  layout = 'center',
  style = 'solid',
  className = ''
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

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className={layouts[layout]}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-gray-600 mb-8">{description}</p>
          )}
          <a
            href={ctaHref}
            className={`inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${styles[style]} ${
              layout === 'full-width' ? 'w-full sm:w-auto' : ''
            }`}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASimple;