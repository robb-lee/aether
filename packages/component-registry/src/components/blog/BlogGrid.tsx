/**
 * Blog Grid Component
 * Blog posts display in responsive grid layout
 * - A11y 탭(카테고리), 16:9 썸네일, Empty 상태
 * - Design Kit 연계(ui.ts 프리셋 사용)
 * - Mobile / Tablet / Desktop 반응형 대응
 */

'use client';

import React from 'react';
import { z } from 'zod';
import {
  EditableElement,
  createElementClickHandler,
  getElementClassName,
  getElementStyle,
} from '../shared/EditableElement';
import {
  responsiveSpacing,
  responsiveText,
  responsiveContainers,
  responsiveGrids,
} from '../../utils/responsive-utils';
import {
  tabs,
  card,
  badge,
  aspect,
  emptyState,
  focusRing,
  metaLine,
} from '../../ui';

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
  posts: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string(),
        excerpt: z.string(),
        author: z.string(),
        publishedAt: z.string(),
        readTime: z.string().optional(),
        category: z.string().optional(),
        image: z.string().optional(),
        link: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  showCategories: z.boolean().optional(),
  postsPerPage: z.number().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  className: z.string().optional(),
});

export type BlogGridProps = z.infer<typeof BlogGridPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function BlogGrid({
  title = 'Latest Articles',
  subtitle = "Stay updated with our latest insights and news",
  showCategories = true,
  postsPerPage = 6,
  ctaText = 'View All Posts',
  ctaLink = '/blog',
  posts = [
    {
      id: '1',
      title: '10 Tips for Better Product Design',
      excerpt:
        "Learn essential design principles that will improve your product's user experience and conversion rates.",
      author: 'Sarah Chen',
      publishedAt: '2024-01-15',
      readTime: '5 min read',
      category: 'Design',
      image: '/api/placeholder/400/250',
      link: '/blog/product-design-tips',
      tags: ['Design', 'UX', 'Product'],
    },
    {
      id: '2',
      title: 'The Future of AI in Web Development',
      excerpt:
        'Explore how artificial intelligence is reshaping the way we build and deploy web applications.',
      author: 'Michael Rodriguez',
      publishedAt: '2024-01-12',
      readTime: '8 min read',
      category: 'Technology',
      image: '/api/placeholder/400/250',
      link: '/blog/ai-web-development',
      tags: ['AI', 'Development', 'Future'],
    },
    {
      id: '3',
      title: 'Building Scalable Teams',
      excerpt:
        'Strategies for growing your startup team while maintaining culture and productivity.',
      author: 'Emily Johnson',
      publishedAt: '2024-01-10',
      readTime: '6 min read',
      category: 'Business',
      image: '/api/placeholder/400/250',
      link: '/blog/scalable-teams',
      tags: ['Teams', 'Startup', 'Management'],
    },
  ],
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false,
}: BlogGridProps) {
  // Tabs state & ref (for keyboard navigation)
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  // 카테고리 집계 (All + 고유 카테고리)
  const categories = [
    'All',
    ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean))),
  ];

  // 카테고리 필터 + 페이지 사이즈
  const filteredPosts =
    selectedCategory === 'All'
      ? posts.slice(0, postsPerPage)
      : posts
          .filter((post) => post.category === selectedCategory)
          .slice(0, postsPerPage);

  // 사용자 로케일 우선으로 날짜 포맷 (다국어 별도 처리 전 단계)
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleElementClick = (elementId: string, elementType: string) =>
    createElementClickHandler(elementId, elementType, onElementClick);

  // A11y Tabs Keyboard: ← → Home End
  const onTabsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [],
    );
    if (items.length === 0) return;
    const currentIndex = items.findIndex(
      (el) => el.getAttribute('aria-selected') === 'true',
    );
    const move = (nextIdx: number) => {
      const el = items[(nextIdx + items.length) % items.length];
      if (!el) return;
      el.focus();
      const val = el.getAttribute('data-value');
      if (val) setSelectedCategory(val);
    };
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        move(currentIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        move(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        move(0);
        break;
      case 'End':
        e.preventDefault();
        move(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <EditableElement
      id="blog-grid-section"
      onClick={handleElementClick('blog-grid-section', 'section')}
      data-editable-type="section"
    >
      <section
        className={getElementClassName(
          'blog-grid-section',
          // 반응형 여백: responsiveSpacing 유틸 사용
          `${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-white ${className}`,
          selectedElementId,
        )}
        style={getElementStyle('blog-grid-section', customStyles)}
        role="region"
        aria-label="Blog articles"
      >
        <div className={`${responsiveContainers.wide} mx-auto`}>
          {/* 헤더: 타이틀/서브타이틀 */}
          <div className="text-center mb-10 sm:mb-12">
            <EditableElement
              as="h2"
              className={`${responsiveText.h2} font-bold mb-3 sm:mb-4 text-gray-900`}
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

          {/* 카테고리 탭 (모바일/태블릿 간격 대응) */}
          {showCategories && categories.length > 1 && (
            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Blog categories"
              className={`${tabs.root} mb-8 sm:mb-12`}
              onKeyDown={onTabsKeyDown}
            >
              {categories.map((category) => {
                const selected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    role="tab"
                    data-value={category}
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    className={[
                      // 모바일 터치타깃 강화: h-11(44px 근접)로 height 보정
                      `${tabs.tab} h-11 sm:h-auto`,
                      selected ? tabs.selected : tabs.unselected,
                    ].join(' ')}
                    onClick={() => setSelectedCategory(category || 'All')}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}

          {/* 카드 그리드
              responsiveGrids['3-col'] 가정: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              gap: 모바일 24px, 태블릿 32px 근사 (gap-6 sm:gap-8)
          */}
          <div className={`grid ${responsiveGrids['3-col']} gap-6 sm:gap-8`}>
            {/* Empty 상태 */}
            {filteredPosts.length === 0 && (
              <div className={emptyState.block}>
                <p className={emptyState.title}>No posts found</p>
                <p className={emptyState.desc}>
                  Try a different category or reset the filter.
                </p>
              </div>
            )}

            {/* 카드 목록 */}
            {filteredPosts.map((post, index) => (
              <article
                key={post.id || index}
                className={`${card.base} ${card.hover}`}
              >
                {/* 썸네일: 16:9 비율, 모바일에서도 균일 */}
                {post.image && (
                  <div className={`relative ${card.media} h-56 sm:h-64 md:h-72 lg:h-80`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />

                    {post.category && (
                      <span className={badge.category}>{post.category}</span>
                    )}
                  </div>
                )}

                {/* 본문 */}
                <div className={card.body}>
                  <div className="mb-4">
                    <h3 className={card.title}>
                      {post.link ? (
                        <a
                          href={post.link}
                          className={`hover:underline rounded ${focusRing}`}
                        >
                          {post.title}
                        </a>
                      ) : (
                        post.title
                      )}
                    </h3>

                    <p className={`${card.text} line-clamp-3`}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div className={metaLine}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate max-w-[40%]">{post.author}</span>
                      <span aria-hidden="true">•</span>
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>

                    {post.readTime && <span>{post.readTime}</span>}
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

          {/* CTA */}
          {ctaText && ctaLink && (
            <div className="text-center mt-10 sm:mt-12">
              <a
                href={ctaLink}
                className={`inline-flex items-center px-6 py-3 bg-[var(--brand-600)] text-white font-semibold rounded-[var(--radius)] hover:bg-[var(--brand-700)] transition-colors ${focusRing}`}
              >
                {ctaText}
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>
    </EditableElement>
  );
}

export default BlogGrid;