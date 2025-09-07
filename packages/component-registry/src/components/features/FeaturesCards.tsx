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
import { card, aspect, focusRing } from '../../ui';

const FeatureCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),   // image 없을 때 대체 심볼/이모지 등
  image: z.string().optional(),  // 상단 비주얼
});

export const FeaturesCardsPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  features: z.array(FeatureCardSchema),
  layout: z.enum(['horizontal', 'vertical', 'mixed']).default('vertical'),
  style: z.enum(['shadowed', 'bordered', 'flat', 'gradient']).default('shadowed'),
  // QueryPie 톤용 오버레이 옵션
  overlayOpacity: z.number().min(0).max(1).optional().default(0.55),
  overlayColor: z.string().optional(), // 기본은 var(--brand-600)
  className: z.string().optional(),
});

export type FeaturesCardsProps = z.infer<typeof FeaturesCardsPropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function FeaturesCards({
  title,
  subtitle,
  features,
  layout = 'vertical',
  style = 'shadowed',
  overlayOpacity = 0.55,
  overlayColor, // e.g. 'var(--brand-600)' or 'rgba(99,102,241,1)'
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
}: FeaturesCardsProps) {
  const handleElementClick = (elementId: string, elementType: string) =>
    createElementClickHandler(elementId, elementType, onElementClick);

  const shellByStyle: Record<NonNullable<FeaturesCardsProps['style']>, string> = {
    shadowed: `${card.base} ${card.hover}`,
    bordered:
      'bg-[var(--card-bg)] rounded-[var(--radius)] border border-[var(--border)] transition-shadow duration-300 hover:shadow-md',
    flat:
      'bg-[var(--card-bg)] rounded-[var(--radius)] transition-colors duration-300 hover:bg-[color-mix(in oklab,var(--muted) 80%,transparent)]',
    gradient:
      'rounded-[var(--radius)] overflow-hidden shadow-[var(--card-shadow)] bg-[linear-gradient(180deg,_color-mix(in_oklab,var(--brand-600)_10%,white),_white_45%)]',
  };

  // 카드 헤더(이미지) 영역 높이: 레이아웃에 따라 살짝 가변
  const imageAspect = layout === 'horizontal' ? aspect['4/3'] : aspect['16/9'];

  return (
    <EditableElement
      id="features-cards-section"
      onClick={handleElementClick('features-cards-section', 'section')}
      data-editable-type="section"
    >
      <section
        className={getElementClassName(
          'features-cards-section',
          `${responsiveSpacing.section.py} ${responsiveSpacing.section.px} ${className}`,
          selectedElementId,
        )}
        style={getElementStyle('features-cards-section', customStyles)}
        role="region"
        aria-label="Key features"
      >
        <EditableElement
          id="features-cards-container"
          onClick={handleElementClick('features-cards-container', 'container')}
          data-editable-type="container"
        >
          <div className={`${responsiveContainers.wide} mx-auto`}>
            {/* Header */}
            <EditableElement
              id="features-cards-header"
              onClick={handleElementClick('features-cards-header', 'container')}
              data-editable-type="container"
            >
              <div className="text-center mb-10 sm:mb-14">
                {subtitle && (
                  <EditableElement
                    id="features-cards-subtitle"
                    onClick={handleElementClick('features-cards-subtitle', 'text')}
                    data-editable-type="text"
                  >
                    <p
                      className={getElementClassName(
                        'features-cards-subtitle',
                        'text-[var(--brand-600)] font-semibold tracking-wide mb-3',
                        selectedElementId,
                      )}
                      style={getElementStyle('features-cards-subtitle', customStyles)}
                    >
                      {subtitle}
                    </p>
                  </EditableElement>
                )}
                <EditableElement
                  id="features-cards-title"
                  onClick={handleElementClick('features-cards-title', 'text')}
                  data-editable-type="text"
                >
                  <h2
                    className={getElementClassName(
                      'features-cards-title',
                      `${responsiveText.h2} font-bold text-[var(--foreground)]`,
                      selectedElementId,
                    )}
                    style={getElementStyle('features-cards-title', customStyles)}
                  >
                    {title}
                  </h2>
                </EditableElement>
              </div>
            </EditableElement>

            {/* Grid */}
            <EditableElement
              id="features-cards-grid"
              onClick={handleElementClick('features-cards-grid', 'container')}
              data-editable-type="container"
            >
              <div
                className={`grid gap-6 sm:gap-8 ${responsiveGrids['3-col']}`}
              >
                {features.map((feature, index) => {
                  const hasImage = Boolean(feature.image);
                  const overlayBg = overlayColor || 'var(--brand-600)';

                  return (
                    <EditableElement
                      key={index}
                      id={`features-cards-item-${index}`}
                      onClick={handleElementClick(
                        `features-cards-item-${index}`,
                        'container',
                      )}
                      data-editable-type="container"
                    >
                      <article
                        className={getElementClassName(
                          `features-cards-item-${index}`,
                          [
                            shellByStyle[style],
                            'overflow-hidden', // 큰 라운드에 맞춰 내부도 클립
                          ].join(' '),
                          selectedElementId,
                        )}
                        style={getElementStyle(
                          `features-cards-item-${index}`,
                          customStyles,
                        )}
                      >
                        {/* Visual (image or icon) */}
                        <div className="relative">
                          {hasImage ? (
                            <div className={`relative ${imageAspect}`}>
                              <img
                                src={feature.image!}
                                alt={feature.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                              {/* gradient/solid overlay to darken, like QueryPie */}
                              <div
                                className="absolute inset-0"
                                style={{
                                  background:
                                    `linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.35) 100%), ${overlayBg}`,
                                  mixBlendMode: 'multiply',
                                  opacity: overlayOpacity,
                                }}
                                aria-hidden="true"
                              />
                              {/* title (white) over image */}
                              <h3
                                className={[
                                  'absolute inset-x-0 bottom-0 px-6 pb-6',
                                  'text-white text-xl sm:text-2xl font-semibold',
                                ].join(' ')}
                              >
                                {feature.title}
                              </h3>
                            </div>
                          ) : (
                            // icon fallback block
                            <div
                              className={[
                                'px-6 pt-6',
                                'flex items-center gap-3 text-[var(--brand-600)]',
                              ].join(' ')}
                            >
                              <div className="w-12 h-12 rounded-lg bg-[color-mix(in oklab,var(--brand-600) 12%,white)] grid place-items-center">
                                <span className="text-2xl" aria-hidden="true">
                                  {feature.icon || '★'}
                                </span>
                              </div>
                              <h3 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)]">
                                {feature.title}
                              </h3>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`${card.body} pt-6`}>
                          <p className="text-[color-mix(in oklab,var(--foreground) 70%,white)] leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </article>
                    </EditableElement>
                  );
                })}
              </div>
            </EditableElement>
          </div>
        </EditableElement>
      </section>
    </EditableElement>
  );
}

export default FeaturesCards;