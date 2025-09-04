/**
 * Blog Grid Component
 * 
 * Blog posts display in responsive grid layout
 */

import React from 'react';
import { z } from 'zod';
import { EditableElement, createElementClickHandler, getElementClassName, getElementStyle } from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers, responsiveGrids } from '../../utils/responsive-utils';

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime?: string;
  category?: string;
  image?: string;
  link?: string;
  tags?: string[];
}

/**
 * Props schema for Blog Grid component
 */
export const BlogGridPropsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  posts: z.array(z.object({
    id: z.string().optional(),
    title: z.string(),
    excerpt: z.string(),
    author: z.string(),
    publishedAt: z.string(),
    readTime: z.string().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    link: z.string().optional(),
    tags: z.array(z.string()).optional()
  })).optional(),
  showCategories: z.boolean().optional(),
  postsPerPage: z.number().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  className: z.string().optional()
});

export type BlogGridProps = z.infer<typeof BlogGridPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function BlogGrid({
  title = "Latest Articles",
  subtitle = "Stay updated with our latest insights and news",
  showCategories = true,
  postsPerPage = 6,
  ctaText = "View All Posts",
  ctaLink = "/blog",
  posts = [
    {
      id: "1",
      title: "10 Tips for Better Product Design",
      excerpt: "Learn essential design principles that will improve your product's user experience and conversion rates.",
      author: "Sarah Chen",
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      category: "Design",
      image: "/api/placeholder/400/250",
      link: "/blog/product-design-tips",
      tags: ["Design", "UX", "Product"]
    },
    {
      id: "2",
      title: "The Future of AI in Web Development",
      excerpt: "Explore how artificial intelligence is reshaping the way we build and deploy web applications.",
      author: "Michael Rodriguez",
      publishedAt: "2024-01-12",
      readTime: "8 min read",
      category: "Technology",
      image: "/api/placeholder/400/250",
      link: "/blog/ai-web-development",
      tags: ["AI", "Development", "Future"]
    },
    {
      id: "3",
      title: "Building Scalable Teams",
      excerpt: "Strategies for growing your startup team while maintaining culture and productivity.",
      author: "Emily Johnson",
      publishedAt: "2024-01-10",
      readTime: "6 min read",
      category: "Business",
      image: "/api/placeholder/400/250",
      link: "/blog/scalable-teams",
      tags: ["Teams", "Startup", "Management"]
    }
  ],
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  
  const categories = ["All", ...Array.from(new Set(posts.map(post => post.category).filter(Boolean)))];
  
  const filteredPosts = selectedCategory === "All" 
    ? posts.slice(0, postsPerPage)
    : posts.filter(post => post.category === selectedCategory).slice(0, postsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleElementClick = (elementId: string, elementType: string) => 
    createElementClickHandler(elementId, elementType, onElementClick);

  return (
    <EditableElement
      id="blog-grid-section"
      onClick={handleElementClick('blog-grid-section', 'section')}
      data-editable-type="section"
    >
      <section 
        className={getElementClassName('blog-grid-section', `${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-white ${className}`, selectedElementId)}
        style={getElementStyle('blog-grid-section', customStyles)}
        role="region" 
        aria-label="Blog articles"
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
        
        {showCategories && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`${responsiveSpacing.button.px} py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category as string)}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        <div className={`grid ${responsiveGrids['3-col']} gap-6 sm:gap-8`}>
          {filteredPosts.map((post, index) => (
            <article 
              key={post.id || index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {post.image && (
                <div className="relative overflow-hidden h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  )}
                </div>
              )}
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.link ? (
                      <a href={post.link} className="hover:underline">
                        {post.title}
                      </a>
                    ) : (
                      post.title
                    )}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span>{post.author}</span>
                    <span>•</span>
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  
                  {post.readTime && (
                    <span>{post.readTime}</span>
                  )}
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        
        {ctaText && ctaLink && (
          <div className="text-center mt-12">
            <a
              href={ctaLink}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {ctaText}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
    </EditableElement>
  );
};

export default BlogGrid;