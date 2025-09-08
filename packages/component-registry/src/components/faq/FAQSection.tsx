/**
 * FAQ Section Component
 * - QueryPie 스타일: 카드형 아코디언(각 행이 라운드+보더+섀도우)
 * - A11y: 버튼/aria-expanded/aria-controls 키보드 접근
 * - 반응형: 모바일/태블릿/데스크탑 여백 스케일
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
} from '../../utils/responsive-utils';
import { focusRing } from '../../ui';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

/** Props schema */
export const FAQSectionPropsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        category: z.string().optional(),
      }),
    )
    .optional(),
  showSearch: z.boolean().optional(),
  showCategories: z.boolean().optional(),
  className: z.string().optional(),
});

export type FAQSectionProps = z.infer<typeof FAQSectionPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function FAQSection({
  title = 'FAQ',
  subtitle = 'Popular Questions',
  // 구조상 기본 비활성화
  showSearch = false,
  showCategories = false,
  faqs = [
    { question: 'Is Huel a weight loss product?', answer: 'Huel is a nutritionally complete meal that can support weight management depending on your goals and usage.', category: 'General' },
    { question: 'Can I try a sample?', answer: 'We occasionally offer sample packs. Keep an eye on our newsletter and social channels for announcements.', category: 'Orders' },
    { question: 'How do I amend my subscription?', answer: 'You can amend your subscription in the account portal: change frequency, flavors, or pause anytime.', category: 'Subscription' },
    { question: 'How can I track my delivery?', answer: 'Tracking details are emailed once your order ships. You can also find them in your order history.', category: 'Orders' },
    { question: 'What should I do if I have any issues with my order?', answer: 'Contact support with your order number. We’ll investigate and resolve it as quickly as possible.', category: 'Support' },
    { question: 'Can I amend or cancel my order?', answer: 'Orders can be amended or canceled before fulfillment. Visit your order page or contact support.', category: 'Orders' },
    { question: 'Can I return my order?', answer: 'Returns are accepted within 30 days for unopened items. See our returns policy for details.', category: 'Returns' },
  ],
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
}: FAQSectionProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set());

  const categories = [
    'All',
    ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean))),
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const handleElementClick = (elementId: string, elementType: string) =>
    createElementClickHandler(elementId, elementType, onElementClick);

  return (
    <EditableElement
      id="faq-section"
      onClick={handleElementClick('faq-section', 'section')}
      data-editable-type="section"
    >
      <section
        className={getElementClassName(
          'faq-section',
          `${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-[var(--background)] ${className}`,
          selectedElementId,
        )}
        style={getElementStyle('faq-section', customStyles)}
        role="region"
        aria-label="Frequently asked questions"
      >
        <div className={`${responsiveContainers.content} mx-auto`}>
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <EditableElement as="h2" ariaLevel={2}>
              <h2 className={`${responsiveText.h2} font-bold text-[var(--foreground)]`}>
                {title}
              </h2>
            </EditableElement>
            <EditableElement as="p">
              <p className="mt-2 text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
                {subtitle}
              </p>
            </EditableElement>
          </div>

          {/* (옵션) 검색/카테고리 */}
          {(showSearch || showCategories) && (
            <div className="mb-8 space-y-4">
              {showSearch && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={[
                      'w-full px-4 py-3 rounded-[var(--radius)] border',
                      'border-[var(--border)] bg-white text-[var(--foreground)] placeholder-gray-400',
                      'transition-colors',
                      focusRing,
                    ].join(' ')}
                    aria-label="Search frequently asked questions"
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[color-mix(in oklab,var(--foreground) 50%,white)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}

              {showCategories && categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        className={[
                          'px-4 py-2 rounded-[var(--radius-pill)] text-sm font-medium transition-colors',
                          active
                            ? 'bg-[var(--brand-600)] text-white'
                            : 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[color-mix(in oklab,var(--muted) 85%,transparent)]',
                          focusRing,
                        ].join(' ')}
                        onClick={() => setSelectedCategory(cat || 'All')}
                        aria-pressed={active}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* FAQ 리스트: 카드형(hover가 모서리까지 적용) */}
          <div className="space-y-3">
            {filteredFAQs.map((faq, idx) => {
              const isOpen = openItems.has(idx);
              return (
                <div
                  key={idx}
                  className={[
                    'group rounded-[var(--radius)] border border-[var(--border)]',
                    'bg-white/70 shadow-sm hover:shadow transition-all',
                    'hover:bg-white',
                  ].join(' ')}
                >
                  <button
                    className={[
                      'w-full flex items-center justify-between gap-4',
                      'px-4 sm:px-5 py-4 sm:py-5 text-left',
                      'transition-colors',
                      focusRing,
                    ].join(' ')}
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="text-base sm:text-lg font-medium text-[var(--foreground)]">
                      {faq.question}
                    </span>

                    {/* + / – 아이콘 (열리면 회전) */}
                    <span
                      className={[
                        'flex-none inline-grid place-items-center w-6 h-6 rounded-full',
                        'border border-[var(--border)] text-[var(--foreground)]',
                        'transition-transform', isOpen ? 'rotate-45' : '',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>

                  {/* 답변(슬라이드/페이드) */}
                  <div
                    id={`faq-answer-${idx}`}
                    className={[
                      'overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                    ].join(' ')}
                    aria-hidden={!isOpen}
                  >
                    <div className="px-4 sm:px-5 pb-5 text-[color-mix(in oklab,var(--foreground) 70%,white)]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 빈 상태 */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[color-mix(in oklab,var(--foreground) 60%,white)]">
                No FAQs found matching your search.
              </p>
            </div>
          )}

          {/* 하단 안내 */}
          <div className="text-center mt-10 sm:mt-12">
            <p className="text-[color-mix(in oklab,var(--foreground) 65%,white)] mb-3">
              Didn’t find what you’re looking for?
            </p>
            <a
              href="/contact"
              className={[
                'inline-flex items-center font-medium',
                'text-[var(--brand-600)] hover:text-[var(--brand-700)]',
              ].join(' ')}
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </EditableElement>
  );
}

export default FAQSection;