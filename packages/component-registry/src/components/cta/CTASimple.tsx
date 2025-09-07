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
import { cta } from '../../ui';

export const CTASimplePropsSchema = z.object({
  title: z.string(),
  description: z.string().optional(), // 이미지 구조에서는 보통 생략하지만 옵션으로 유지
  eyebrow: z.string().optional(),     // 작은 상단 라벨 (OUR SERVICES & EXPERTISE)
  ctaText: z.string(),
  ctaHref: z.string().optional(),
  // 배경 이미지 & 오버레이
  backgroundImage: z.string().optional(), // 배너 배경 이미지 URL
  overlayOpacity: z.number().min(0).max(1).optional().default(0.6),
  overlayColor: z.string().optional(),    // CSS color (기본은 var(--brand-600))
  // 배치 옵션
  layout: z.enum(['center']).default('center'), // 이번 구조는 center 고정
  rounded: z.boolean().optional().default(true),
  bleed: z.boolean().optional().default(false), // full-bleed 섹션 여부
  // 버튼 스타일: 배너 위에선 invert(흰색) 기본
  style: z.enum(['invert', 'solid', 'outline', 'gradient', 'text']).default('invert'),
  className: z.string().optional(),
});

export type CTASimpleProps = z.infer<typeof CTASimplePropsSchema> & {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
};

export function CTASimple({
  title,
  description,
  eyebrow = 'OUR SERVICES & EXPERTISE',
  ctaText,
  ctaHref = '#',
  backgroundImage,
  overlayOpacity = 0.6,
  overlayColor, // e.g. 'rgba(99,102,241,1)' or 'var(--brand-600)'
  layout = 'center',
  rounded = true,
  bleed = false,
  style = 'invert',
  className = '',
  onElementClick,
  selectedElementId,
  customStyles = {},
}: CTASimpleProps) {
  const handleElementClick = (elementId: string, elementType: string) =>
    createElementClickHandler(elementId, elementType, onElementClick);

  // 버튼 매핑
  const buttonClass =
    style === 'invert'
      ? cta.invert
      : style === 'solid'
      ? cta.primary
      : style === 'outline'
      ? cta.outline
      : style === 'gradient'
      ? cta.gradient
      : cta.text;

  // 배경 스타일
  const bgImageStyle: React.CSSProperties | undefined = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  // 오버레이 색상 (기본 = var(--brand-600))
  const overlayBg =
    overlayColor || 'var(--brand-600)';

  // 배너 패딩: 모바일/태블릿/데스크탑 스케일
  const sectionPadding = `${responsiveSpacing.section.py} ${responsiveSpacing.section.px}`;

  // 배너 컨테이너 클래스
  const bannerClasses = [
    'relative overflow-hidden shadow-[var(--card-shadow)]',
    rounded ? 'rounded-[var(--radius)]' : '',
    'isolate', // overlay layering
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <EditableElement
      id="cta-simple-section"
      onClick={handleElementClick('cta-simple-section', 'section')}
      data-editable-type="section"
    >
      <section
        className={getElementClassName(
          'cta-simple-section',
          // bleed가 아니면 섹션 바깥에 기본 배경과 패딩 적용
          `${bleed ? '' : `${sectionPadding} bg-[var(--muted)]`} ${className}`,
          selectedElementId,
        )}
        style={getElementStyle('cta-simple-section', customStyles)}
        role="region"
        aria-label="Call to action banner"
      >
        <div className={`${responsiveContainers.content} mx-auto`}>
          {/* 배너 카드 (배경 이미지 + 오버레이 + 컨텐트) */}
          <div
            className={bannerClasses}
            style={bgImageStyle}
          >
            {/* Overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundColor: overlayBg,
                opacity: overlayOpacity,
                mixBlendMode: 'multiply',
              }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-6 sm:px-10 py-12 sm:py-16 lg:py-24">
              {/* Eyebrow */}
              {eyebrow && (
                <p className="text-sm font-semibold tracking-wider uppercase text-white/80 mb-4">
                  {eyebrow}
                </p>
              )}

              {/* Title */}
              <h2
                className={[
                  responsiveText.h2,
                  'font-bold text-white',
                  'max-w-4xl mx-auto',
                  'mb-6',
                ].join(' ')}
              >
                {title}
              </h2>

              {/* (옵션) Description */}
              {description && (
                <p className="max-w-3xl mx-auto mb-8 text-white/90">
                  {description}
                </p>
              )}

              {/* CTA Button */}
              <a
                href={ctaHref}
                role="button"
                className={[buttonClass, 'h-11'].join(' ')}
                aria-label={ctaText}
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      </section>
    </EditableElement>
  );
}

export default CTASimple;