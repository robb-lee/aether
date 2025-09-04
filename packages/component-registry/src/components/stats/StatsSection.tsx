/**
 * Stats Section Component
 * 
 * Display key metrics and numbers with animated counters
 */

import React from 'react';
import { EditableElement } from '../shared/EditableElement';

interface Stat {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
}

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats?: Stat[];
  layout?: 'grid' | 'horizontal';
  animated?: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
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
  ]
}) => {
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
    ? 'flex flex-wrap justify-center gap-8 lg:gap-16' 
    : 'grid md:grid-cols-2 lg:grid-cols-4 gap-8';

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 bg-blue-600 text-white" 
      role="region" 
      aria-label="Statistics and achievements"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <EditableElement
            as="h2"
            className="text-3xl font-bold mb-4 text-white"
            ariaLevel={2}
          >
            {title}
          </EditableElement>
          
          <EditableElement
            as="p"
            className="text-xl text-blue-100 max-w-2xl mx-auto"
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
                <span className="text-4xl lg:text-5xl font-bold text-white block">
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
  );
};

export default StatsSection;