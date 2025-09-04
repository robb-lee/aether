/**
 * Testimonials Slider Component
 * 
 * Customer testimonials in a sliding carousel format
 */

import React from 'react';
import { z } from 'zod';
import { EditableElement } from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers } from '../../utils/responsive-utils';

export const TestimonialsSliderPropsSchema = z.object({
  title: z.string().default("What Our Customers Say"),
  testimonials: z.array(z.object({
    name: z.string(),
    company: z.string(),
    content: z.string(),
    avatar: z.string().optional(),
    rating: z.number().min(1).max(5).optional()
  })).optional(),
  autoSlide: z.boolean().default(true),
  slideInterval: z.number().default(5000),
  className: z.string().optional()
});

export type TestimonialsSliderProps = z.infer<typeof TestimonialsSliderPropsSchema>;

interface TestimonialsSliderPropsInternal extends TestimonialsSliderProps {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
}

export const TestimonialsSlider: React.FC<TestimonialsSliderPropsInternal> = ({
  title = "What Our Customers Say",
  testimonials = [
    {
      name: "Sarah Chen",
      company: "TechFlow Inc",
      content: "This solution transformed our workflow. Highly recommended!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      company: "StartupLabs",
      content: "Incredible results in just 30 days. Worth every penny.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      company: "Digital Agency",
      content: "The best investment we've made for our business growth.",
      rating: 5
    }
  ],
  autoSlide = true,
  slideInterval = 5000
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    if (!autoSlide) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, testimonials.length]);

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  return (
    <section className={`${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-gray-50`} role="region" aria-label="Customer testimonials">
      <div className={`${responsiveContainers.wide} mx-auto`}>
        <EditableElement
          as="h2"
          className={`${responsiveText.h2} font-bold text-center mb-12 text-gray-900`}
          ariaLevel={2}
        >
          {title}
        </EditableElement>
        
        <div className="relative max-w-4xl mx-auto">
          <div 
            className="overflow-hidden rounded-lg"
            role="region"
            aria-live="polite"
            aria-label={`Testimonial ${currentSlide + 1} of ${testimonials.length}`}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`w-full flex-shrink-0 bg-white ${responsiveSpacing.card.p} text-center shadow-lg`}
                  aria-hidden={index !== currentSlide}
                >
                  <div className="flex justify-center mb-4" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <blockquote className={`${responsiveText.lead} text-gray-700 mb-6 italic`}>
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={`${testimonial.name} avatar`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-6 space-x-2" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentSlide(index)}
                role="tab"
                aria-selected={index === currentSlide}
                aria-controls={`testimonial-${index}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;