// src/design/ui.ts
// Design Kit 연계 UI 프리셋 모음 (Tailwind 클래스 프리셋)
// - 목적: 컴포넌트에서 반복되는 스타일 패턴을 한 곳에서 관리
// - 원칙: 색/라운드/그림자 등은 반드시 디자인킷 CSS 변수(var(--...))만 참조

// 공통 포커스 링
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--focus)]";

// 탭 (카테고리/필터 등)
export const tabs = {
  // 컨테이너: 모바일/태블릿/데스크탑 간격 반응
  root: "flex flex-wrap justify-center gap-2 sm:gap-3",
  // 탭 버튼 기본
  tab: `px-4 py-2 rounded-[var(--radius-pill)] font-medium transition-colors outline-none ${focusRing}`,
  // 선택/비선택 상태 (색상은 디자인킷 변수 사용)
  selected: "bg-[var(--brand-600)] text-white",
  unselected:
    "bg-[color-mix(in oklab, var(--muted) 100%, transparent)] text-[var(--foreground)] hover:bg-[color-mix(in oklab, var(--muted) 85%, transparent)]",
};

// 카드(블로그 카드/피처 카드 공통)
export const card = {
  base:
    "bg-[var(--card-bg)] rounded-[var(--radius)] shadow-[var(--card-shadow)] overflow-hidden transition-shadow duration-300",
  hover: "hover:shadow-lg",
  body: "p-6",
  // 필요시 헤더/미디어 섹션 프리셋
  media: "relative overflow-hidden",
  title:
    "text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--brand-600)] transition-colors",
  text: "text-[color-mix(in oklab, var(--foreground) 70%, white)] leading-relaxed",
};

// 배지(카테고리 등)
export const badge = {
  category:
    "absolute top-4 left-4 px-3 py-1 rounded-[var(--radius-pill)] text-sm font-medium bg-[var(--brand-600)] text-white",
};

// 애스펙트 비율
export const aspect = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

// 빈 상태(Empty State)
export const emptyState = {
  block:
    "col-span-full flex flex-col items-center justify-center py-16 text-center",
  title: "text-lg font-medium text-[var(--foreground)]",
  desc:
    "text-[color-mix(in oklab, var(--foreground) 60%, white)] mt-2 max-w-prose",
};

// 링크/버튼형 CTA (옵션)
export const cta = {
  primary: `inline-flex items-center justify-center px-6 py-3 bg-[var(--brand-600)] text-white font-semibold rounded-[var(--radius)] hover:bg-[var(--brand-700)] transition-colors ${focusRing}`,
  ghost:   `inline-flex items-center justify-center px-6 py-3 bg-transparent text-[var(--brand-600)] font-semibold rounded-[var(--radius)] hover:bg-[color-mix(in oklab, var(--muted) 85%, transparent)] transition-colors ${focusRing}`,
  outline: `inline-flex items-center justify-center px-6 py-3 border border-[var(--brand-600)] text-[var(--brand-600)] font-semibold rounded-[var(--radius)] hover:bg-[var(--brand-600)] hover:text-white transition-colors ${focusRing}`,
  gradient:`inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-[var(--radius)] bg-[linear-gradient(90deg,var(--brand-600),_color-mix(in_oklab,var(--brand-600)_60%,var(--secondary, #8b5cf6)))] hover:opacity-95 transition-[opacity,filter] ${focusRing}`,
  text:    `inline-flex items-center justify-center px-3 py-2 text-[var(--brand-600)] font-semibold underline underline-offset-4 rounded-[var(--radius)] hover:text-[var(--brand-700)] transition-colors ${focusRing}`,
  invert: `inline-flex items-center justify-center px-6 py-3 bg-white text-[var(--foreground)] font-semibold rounded-[var(--radius)] hover:opacity-90 transition-colors ${focusRing}`,
};

// 메타 정보(작성자/날짜/읽기시간 등) 라인
export const metaLine =
  "flex items-center justify-between text-sm text-[color-mix(in oklab, var(--foreground) 60%, white)]";

// 접근성 힌트: 탭용 역할/속성 세트 (선택적으로 사용)
export const aria = {
  tablist: { role: "tablist", "aria-label": "Tabs" } as const,
  tab: (selected: boolean) =>
    ({ role: "tab", "aria-selected": selected, tabIndex: selected ? 0 : -1 } as const),
};

// Form fields
export const form = {
  field:
    "w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-white text-[var(--foreground)] placeholder-gray-400 focus:border-[var(--brand-600)] transition-colors " +
    focusRing,
  textarea: "w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-white text-[var(--foreground)] placeholder-gray-400 resize-none min-h-[120px] focus:border-[var(--brand-600)] transition-colors " + focusRing,
  label: "block text-sm font-medium text-[var(--foreground)] mb-1",
  helper: "text-sm text-[color-mix(in oklab, var(--foreground) 60%, white)]",
};