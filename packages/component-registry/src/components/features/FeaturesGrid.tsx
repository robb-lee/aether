import React from 'react';
import { z } from 'zod';
import {
  EditableElement,
  createElementClickHandler,
  getElementClassName,
  getElementStyle,
} from '../shared/EditableElement';
import { responsiveSpacing, responsiveText, responsiveContainers } from '../../utils/responsive-utils';
import { focusRing } from '../../ui';

/** ─ Schema (단일 스타일) ─ */
const FeatureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  href: z.string().optional(),
  dotColor: z.string().optional(),      // 타이틀 뒤 점 색
  decoColor: z.string().optional(),     // 우하단 라디얼 장식색(옵션)
});

export const FeaturesGridPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  features: z.array(FeatureItemSchema),
  layout: z.enum(['auto','2-col','3-col','4-col']).default('auto'),
  className: z.string().optional(),
});

export type FeaturesGridProps = z.infer<typeof FeaturesGridPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
};

export function FeaturesGrid({
  title,
  subtitle,
  description,
  features,
  layout = 'auto',
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
}: FeaturesGridProps) {
  const handleElementClick = (id: string, type: string) =>
    createElementClickHandler(id, type, onElementClick);

  // 1→2→3→(아이템 7개 이상) 4열
  const gridCols =
    layout === '2-col'
      ? 'grid-cols-1 sm:grid-cols-2'
      : layout === '3-col'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : layout === '4-col'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ' + (features.length >= 7 ? 'xl:grid-cols-4' : '');

  // 공통 카드(모두 동일)
  const tileShell =
    'relative rounded-[1.75rem] overflow-hidden bg-[var(--card-bg)] shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg';
  const tileInner = 'flex min-h-[230px] lg:min-h-[250px] flex-col justify-between p-6 sm:p-7 lg:p-8';

  return (
    <EditableElement
      id="features-grid-section"
      onClick={handleElementClick('features-grid-section','section')}
      data-editable-type="section"
    >
      <section
        className={getElementClassName(
          'features-grid-section',
          `${responsiveSpacing.section.py} ${responsiveSpacing.section.px} bg-[var(--background)] ${className}`,
          selectedElementId
        )}
        style={getElementStyle('features-grid-section', customStyles)}
        role="region"
        aria-label="Product features"
      >
        <div className={`${responsiveContainers.wide} mx-auto`}>
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            {subtitle && (
              <p className="text-[var(--brand-600)] font-semibold tracking-wide mb-2">{subtitle}</p>
            )}
            <h2 className={`${responsiveText.h2} font-bold text-[var(--foreground)]`}>{title}</h2>
            {description && (
              <p className="mt-4 max-w-3xl mx-auto text-[color-mix(in oklab,var(--foreground) 70%,white)]">
                {description}
              </p>
            )}
          </div>

          {/* Grid */}
          <div className={`grid gap-6 sm:gap-8 ${gridCols}`}>
            {features.map((f, i) => {
              const dot = f.dotColor || 'color-mix(in oklab, var(--brand-600) 90%, white)';
              const deco = f.decoColor || 'rgba(99,102,241,.14)';

              return (
                <article
                  key={i}
                  className={getElementClassName(
                    `features-grid-item-${i}`,
                    tileShell,
                    selectedElementId
                  )}
                >
                  {/* 우하단 라디얼 장식 */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-16 -right-14 w-[320px] h-[320px] rounded-full blur-3xl"
                    style={{
                      background: `radial-gradient(60% 60% at 50% 50%, ${deco} 0%, transparent 70%)`,
                    }}
                  />

                  <div className={tileInner}>
                    {/* 상단: 타이틀 + 점(타이틀 뒤에 붙임) & 설명 */}
                    <div>
                      <h3 className="text-[1.6rem] sm:text-[1.7rem] font-semibold tracking-tight text-[var(--foreground)] inline-flex items-center gap-2">
                        <span className="truncate">{f.title}</span>
                        <span
                          aria-hidden
                          className="inline-block w-2.5 h-2.5 rounded-full flex-none"
                          style={{ backgroundColor: dot }}
                        />
                      </h3>
                      <p className="mt-2 leading-relaxed text-[color-mix(in oklab,var(--foreground) 70%,white)]">
                        {f.description}
                      </p>
                    </div>

                    {/* 하단: Learn more → */}
                    {f.href && (
                      <div className="pt-5">
                        <a
                          href={f.href}
                          className={['inline-flex items-center gap-2 font-medium rounded text-[var(--brand-600)] hover:text-[var(--brand-700)]', focusRing].join(' ')}
                        >
                          Learn more
                          <svg
                            className="w-[18px] h-[18px]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </EditableElement>
  );
}

export default FeaturesGrid;