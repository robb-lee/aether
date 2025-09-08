/**
 * Stats Section Component
 * 
 * Display key metrics and numbers with animated counters
 */

'use client';

import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers, responsiveGrids } from '../../utils/responsive-utils';

interface Stat {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Props schema for Stats Section component
 */
export const StatsSectionPropsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    prefix: z.string().optional(),
    suffix: z.string().optional()
  })).optional(),
  layout: z.enum(['grid', 'horizontal']).optional(),
  animated: z.boolean().optional(),
  className: z.string().optional()
});

export type StatsSectionProps = z.infer<typeof StatsSectionPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function StatsSection({
  title = "Trusted by Thousands",
  subtitle = "Join the growing community of satisfied customers",
  layout = 'grid',
  animated = true,
  stats = [
    {
      value: "10,000+",
      label: "Happy Customers",
      description: "Businesses trust our platform",
      icon: "users"
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Reliable service you can count on",
      icon: "shield"
    },
    {
      value: "500+",
      label: "Projects Completed",
      description: "Successful implementations",
      icon: "chart"
    },
    {
      value: "24/7",
      label: "Support",
      description: "We're here when you need us",
      icon: "support"
    }
  ],
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: StatsSectionProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animated]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactElement> = {
      users: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      shield: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      chart: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      support: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    };
    
    return icons[iconName] || icons.chart;
  };

  const gridClasses = layout === 'horizontal' 
    ? 'flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-16' 
    : `grid ${responsiveGrids['4-col']} gap-6 sm:gap-8`;

  const handleElementClick = (elementId: string, elementType: string) => 
    createElementClickHandler(elementId, elementType, onElementClick);

  return (
    <EditableElement
      id="stats-section"
      onClick={handleElementClick('stats-section', 'section')}
      data-editable-type="section"
    >
      <section 
        ref={sectionRef}
        className={getElementClassName('stats-section', `${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-blue-600 text-white ${className}`, selectedElementId)}
        style={getElementStyle('stats-section', customStyles)}
        role="region" 
        aria-label="Statistics and achievements"
      >
        <div className={`${responsiveContainers.wide} mx-auto`}>
        <div className="text-center mb-12">
          <EditableElement
            as="h2"
            className={`${responsiveText.h2} font-bold mb-4 text-white`}
            ariaLevel={2}
          >
            {title}
          </EditableElement>
          
          <EditableElement
            as="p"
            className={`${responsiveText.lead} text-blue-100 max-w-2xl mx-auto`}
          >
            {subtitle}
          </EditableElement>
        </div>
        
        <div className={gridClasses}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center ${
                animated 
                  ? `transform transition-all duration-700 delay-${index * 100} ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`
                  : ''
              }`}
            >
              {stat.icon && (
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-500 bg-opacity-30 rounded-lg flex items-center justify-center text-blue-100">
                    {getIcon(stat.icon)}
                  </div>
                </div>
              )}
              
              <div className="mb-2">
                <span className={`${responsiveText.display} font-bold text-white block`}>
                  {stat.prefix || ''}{stat.value}{stat.suffix || ''}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-blue-100 mb-2">
                {stat.label}
              </h3>
              
              {stat.description && (
                <p className="text-blue-200 text-sm leading-relaxed">
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
    </EditableElement>
  );
};

export default StatsSection;