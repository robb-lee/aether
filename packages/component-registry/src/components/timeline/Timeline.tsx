/**
 * Timeline Component
 * 
 * Vertical timeline for processes, history, or milestones
 */

import React from 'react';
import { z } from 'zod';
import { EditableElement } from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers, responsiveGrids } from '../../utils/responsive-utils';

interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  status?: 'completed' | 'current' | 'upcoming';
  icon?: string;
}

export const TimelinePropsSchema = z.object({
  title: z.string().default("Our Journey"),
  subtitle: z.string().default("Key milestones in our growth and development"),
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
    status: z.enum(['completed', 'current', 'upcoming']).optional(),
    icon: z.string().optional()
  })).optional(),
  orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
  className: z.string().optional()
});

export type TimelineProps = z.infer<typeof TimelinePropsSchema>;

interface TimelinePropsInternal extends TimelineProps {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
}

export const Timeline: React.FC<TimelinePropsInternal> = ({
  title = "Our Journey",
  subtitle = "Key milestones in our growth and development",
  orientation = 'vertical',
  items = [
    {
      title: "Company Founded",
      description: "Started with a vision to revolutionize the industry",
      date: "2020",
      status: "completed",
      icon: "rocket"
    },
    {
      title: "First Product Launch",
      description: "Released our MVP and gained initial traction",
      date: "2021",
      status: "completed", 
      icon: "product"
    },
    {
      title: "Series A Funding",
      description: "Raised $5M to accelerate growth and expansion",
      date: "2022",
      status: "completed",
      icon: "funding"
    },
    {
      title: "Global Expansion",
      description: "Expanding to new markets and reaching 100k+ users",
      date: "2023",
      status: "current",
      icon: "globe"
    },
    {
      title: "AI Integration",
      description: "Next-generation AI features for enhanced user experience",
      date: "2024",
      status: "upcoming",
      icon: "ai"
    }
  ]
}) => {
  const getIcon = (iconName: string, status: string) => {
    const iconColor = {
      completed: 'text-green-600 bg-green-100',
      current: 'text-blue-600 bg-blue-100',
      upcoming: 'text-gray-400 bg-gray-100'
    }[status] || 'text-gray-400 bg-gray-100';

    const icons: Record<string, React.ReactElement> = {
      rocket: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      product: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      funding: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      globe: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      ai: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    };
    
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
        {icons[iconName] || icons.rocket}
      </div>
    );
  };

  const getLineColor = (status: string) => {
    return {
      completed: 'bg-green-600',
      current: 'bg-blue-600', 
      upcoming: 'bg-gray-300'
    }[status] || 'bg-gray-300';
  };

  if (orientation === 'horizontal') {
    return (
      <section className={`${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-white`} role="region" aria-label="Timeline">
        <div className={`${responsiveContainers.wide} mx-auto`}>
          <div className="text-center mb-12">
            <EditableElement as="h2" className={`${responsiveText.h2} font-bold mb-4 text-gray-900`} ariaLevel={2}>
              {title}
            </EditableElement>
            <EditableElement as="p" className={`${responsiveText.lead} text-gray-600`}>
              {subtitle}
            </EditableElement>
          </div>
          
          <div className="relative">
            <div className="flex justify-between items-center">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center" style={{ width: `${100 / items.length}%` }}>
                  {getIcon(item.icon || 'rocket', item.status || 'completed')}
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    {item.date && <p className="text-sm text-gray-500 mb-2">{item.date}</p>}
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-gray-50`} role="region" aria-label="Timeline">
      <div className={`${responsiveContainers.content} mx-auto`}>
        <div className="text-center mb-12">
          <EditableElement
            as="h2"
            className={`${responsiveText.h2} font-bold mb-4 text-gray-900`}
            ariaLevel={2}
          >
            {title}
          </EditableElement>
          
          <EditableElement
            as="p"
            className={`${responsiveText.lead} text-gray-600`}
          >
            {subtitle}
          </EditableElement>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={index} className="relative flex items-start">
                {/* Timeline icon */}
                <div className="relative z-10">
                  {getIcon(item.icon || 'rocket', item.status || 'completed')}
                </div>
                
                {/* Timeline line segment */}
                {index < items.length - 1 && (
                  <div 
                    className={`absolute left-5 top-10 w-0.5 h-8 ${getLineColor(item.status || 'completed')}`}
                    style={{ transform: 'translateX(-50%)' }}
                  ></div>
                )}
                
                {/* Content */}
                <div className={`ml-8 bg-white rounded-lg ${responsiveSpacing.card.p} shadow-sm border border-gray-200 flex-1`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    
                    {item.date && (
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {item.date}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {item.status && (
                    <div className="mt-3">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'current'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status === 'completed' && '✓ '}
                        {item.status === 'current' && '⭐ '}
                        {item.status === 'upcoming' && '⏳ '}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;