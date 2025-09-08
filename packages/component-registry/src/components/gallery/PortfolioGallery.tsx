/**
 * Portfolio Gallery Component
 * 
 * Masonry-style gallery for showcasing work/projects
 */

'use client';

import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers, responsiveGrids } from '../../utils/responsive-utils';

interface GalleryItem {
  id?: string;
  title: string;
  description?: string;
  image: string;
  category?: string;
  link?: string;
  tags?: string[];
}

/**
 * Props schema for Portfolio Gallery component
 */
export const PortfolioGalleryPropsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string(),
    category: z.string().optional(),
    link: z.string().optional(),
    tags: z.array(z.string()).optional()
  })).optional(),
  categories: z.array(z.string()).optional(),
  showFilters: z.boolean().optional(),
  className: z.string().optional()
});

export type PortfolioGalleryProps = z.infer<typeof PortfolioGalleryPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function PortfolioGallery({
  title = "Our Work",
  subtitle = "Showcasing our latest projects and achievements",
  showFilters = true,
  categories = ["All", "Web Design", "Branding", "Mobile App"],
  items = [
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Modern shopping experience with AI recommendations",
      image: "/api/placeholder/400/300",
      category: "Web Design",
      link: "#",
      tags: ["React", "TypeScript", "AI"]
    },
    {
      id: "2", 
      title: "Brand Identity Design",
      description: "Complete brand overhaul for tech startup",
      image: "/api/placeholder/400/250",
      category: "Branding",
      link: "#",
      tags: ["Logo", "Brand Guide", "Design System"]
    },
    {
      id: "3",
      title: "Mobile Banking App",
      description: "Secure and intuitive banking experience",
      image: "/api/placeholder/400/350",
      category: "Mobile App",
      link: "#", 
      tags: ["React Native", "Security", "UX"]
    },
    {
      id: "4",
      title: "SaaS Dashboard",
      description: "Analytics platform for business intelligence",
      image: "/api/placeholder/400/280",
      category: "Web Design",
      link: "#",
      tags: ["Dashboard", "Analytics", "D3.js"]
    }
  ],
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: PortfolioGalleryProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [filteredItems, setFilteredItems] = React.useState(items);

  React.useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  const handleElementClick = (elementId: string, elementType: string) => 
    createElementClickHandler(elementId, elementType, onElementClick);

  return (
    <EditableElement
      id="portfolio-gallery-section"
      onClick={handleElementClick('portfolio-gallery-section', 'section')}
      data-editable-type="section"
    >
      <section 
        className={getElementClassName('portfolio-gallery-section', `${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-gray-50 ${className}`, selectedElementId)}
        style={getElementStyle('portfolio-gallery-section', customStyles)}
        role="region" 
        aria-label="Portfolio gallery"
      >
        <div className={`${responsiveContainers.wide} mx-auto`}>
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
            className={`${responsiveText.lead} text-gray-600 max-w-2xl mx-auto`}
          >
            {subtitle}
          </EditableElement>
        </div>
        
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`${responsiveSpacing.button.px} py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(category as string)}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        <div className={`grid ${responsiveGrids['3-col']} gap-4 sm:gap-6`}>
          {filteredItems.map((item, index) => (
            <div 
              key={item.id || index}
              className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {item.link && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <a
                      href={item.link}
                      className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                      aria-label={`View ${item.title} project`}
                    >
                      View Project
                    </a>
                  </div>
                )}
              </div>
              
              <div className={`${responsiveSpacing.card.p}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                
                {item.description && (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                )}
                
                {item.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-3">
                    {item.category}
                  </span>
                )}
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
    </EditableElement>
  );
};

export default PortfolioGallery;