# Shadcn/UI 기반 디자인 시스템 설계 문서

## 1. 개요
이 문서는 **shadcn/ui + lucide-react** 조합을 기반으로 하는 디자인 시스템 구축 계획을 정리한 것이다. 목표는 **반응형 제품 소개 웹사이트**(QueryPie, Linear, Apple과 같은 구조)를 효율적으로 제작할 수 있는 디자인 시스템을 마련하는 것이다.

## 2. Foundation (디자인 토큰)

### 색상 (Colors)
* **Semantic**: primary, secondary, accent, destructive, warning, success
* **Neutral**: gray scale (50–950)
* **State**: hover, active, disabled, focus
* **Surface**: background, foreground, card, popover, muted

### 타이포그래피 (Typography)
* **Font Families**: heading, body, mono
* **Size Scale**: xs → 5xl
* **Weight**: 300, 400, 500, 600, 700
* **Line Height**: tight, normal, relaxed
* **Letter Spacing**: tighter, normal, wider

### 간격 (Spacing)
* **Base**: 4px or 8px
* **Scale**: 0 → 24 (단위 rem 변환)
* **Container Widths**: xs → full
* **Section vs Component gaps**

### 효과 (Effects)
* **Border Radius**: none → full
* **Shadows**: sm → 2xl, inner
* **Blur**: sm → xl
* **Transitions**: duration, easing curves
* **Z-index Scale**: dropdown (50), modal (100), toast (150), overlay (200)

### 아이콘 (Icons)
* **Lucide-react 기반**
* **Size tokens**: xs=12, sm=14, md=16, lg=20, xl=24, 2xl=32
* **Stroke**: 1.25~1.75 (테마별 다름)
* **Color**: `--icon`, 상태별 색상 변수
* **접근성**: 의미 전달 시 aria-label, 장식용 시 aria-hidden

### 애니메이션 & 모션 (Animation & Motion)
* **Animation Presets**: fade-in, slide-up, slide-down, scale, rotate
* **Duration Tokens**: fast (150ms), normal (300ms), slow (500ms)
* **Easing Functions**: ease-in, ease-out, ease-in-out, spring
* **Scroll Animations**: Intersection Observer 기반
* **Micro-interactions**: hover, focus, click feedback

## 3. Grid System & Layout

### Grid System
* **Column Grid**: 12/16/24 컬럼 옵션
* **Container Max Width**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px), full
* **Gutter Width**: 16px, 24px, 32px
* **Safe Area Padding**: 모바일 노치 대응

### Breakpoints
* **xs**: 0px
* **sm**: 640px
* **md**: 768px
* **lg**: 1024px
* **xl**: 1280px
* **2xl**: 1536px

### Layout Utilities
* **Flexbox Utilities**: flex-row, flex-col, justify-*, items-*, gap-*
* **Grid Utilities**: grid-cols-*, grid-rows-*, col-span-*
* **Positioning**: absolute, relative, fixed, sticky
* **Overflow**: hidden, auto, scroll

## 4. Design Kit (테마 변형)

### Modern SaaS
* Gradient, Inter 폰트, 넓은 여백, 큰 radius, 부드러운 shadow

### E-commerce
* 높은 대비, 굵은 CTA 버튼, 카드 레이아웃, bold outline

### Creative Agency
* 비비드 색상, display 폰트, 비대칭 레이아웃, 3D/패럴랙스 효과

### Corporate
* 네이비/그레이 팔레트, 세리프 헤딩, 직각 모서리, 미니멀 shadow

### Startup
* 밝은 색상, 둥근 산세리프, 중간 여백, 부드러운 모서리

## 5. UI 컴포넌트 세트

### Navigation & Layout
* Header/NavBar, Sidebar/Drawer, Footer
* Section/Container (반응형 래퍼)
* Breadcrumb, Pagination, Tabs

### Forms & Controls
* Button (primary, secondary, ghost, destructive 등)
* Input, Textarea, Select, Combobox
* Checkbox, Radio Group, Switch, Slider
* Toggle Group, Form Wrapper
* Date Picker, Time Picker
* File Upload, Drag & Drop

### Data Display
* Card (feature, pricing, testimonial, blog)
* Table, List, Typography Styles
* Avatar, Badge, Icon Wrapper
* AspectRatio (이미지/영상)
* Progress Bar, Skeleton Loader
* Timeline, Stepper

### Feedback & Overlay
* Dialog, Sheet, Modal
* Toast, Alert, Banner
* Tooltip, Popover, HoverCard
* Accordion, Collapsible
* Loading States (spinner, skeleton, placeholder)
* Empty States, Error States

### Section Blocks (Composite)
* Hero Section (simple, image/text, video background)
* Features Section (grid cards, image+text pair)
* Logo Cloud (trusted by logos)
* Testimonials (carousel, quote style)
* Pricing Section (plan cards, feature list)
* CTA Section (headline+button)
* FAQ Section (accordion)
* Stats Section (numbers, charts)
* Team Section (member cards)
* Contact Section (form + info)

### Compound Components
* `<Card>`, `<Card.Header>`, `<Card.Body>`, `<Card.Footer>`
* `<Form>`, `<Form.Field>`, `<Form.Label>`, `<Form.Error>`
* `<Table>`, `<Table.Header>`, `<Table.Body>`, `<Table.Row>`

## 6. 상태 관리 & 패턴

### Component States
* **Default**: 기본 상태
* **Hover**: 마우스 오버
* **Active**: 클릭/탭 중
* **Focus**: 키보드 포커스
* **Disabled**: 비활성화
* **Loading**: 데이터 로딩 중
* **Error**: 에러 발생
* **Success**: 성공 상태
* **Empty**: 데이터 없음

### UI Patterns
* **Optimistic UI**: 즉각적인 피드백
* **Progressive Disclosure**: 단계적 정보 노출
* **Skeleton Screens**: 로딩 중 레이아웃 유지
* **Infinite Scroll**: 무한 스크롤
* **Pull to Refresh**: 당겨서 새로고침

## 7. 기술 구조

### CSS Architecture
* **CSS Variable System**: JSON/JS 토큰 → CSS 변수 빌드
* **Theme Provider**: 다크모드 및 테마 스코핑 지원
* **Tailwind Merge**: 클래스 충돌 해결
* **PostCSS Plugins**: autoprefixer, cssnano

### Component Architecture
* **Shadcn base + Theme wrapper + Variant resolver**
* **Headless UI Integration**: 접근성 강화
* **Compound Components Pattern**
* **Controlled vs Uncontrolled Components**

### Build & Optimization
* **Design Token Management**: Build-time 최적화, Runtime switching
* **Component Lazy Loading**: React.lazy() + Suspense
* **Critical CSS Extraction**
* **Bundle Splitting**: route-based, component-based
* **Image Optimization**: next/image, WebP, AVIF

## 8. 성능 & 최적화

### Performance Targets
* **LCP (Largest Contentful Paint)**: < 2.5s
* **FID (First Input Delay)**: < 100ms
* **CLS (Cumulative Layout Shift)**: < 0.1
* **TTI (Time to Interactive)**: < 3.8s

### Optimization Strategies
* **Code Splitting**: 라우트별, 컴포넌트별
* **Tree Shaking**: 미사용 코드 제거
* **Minification**: CSS, JS 최소화
* **Compression**: gzip, brotli
* **CDN Usage**: 정적 자산 캐싱
* **Preloading & Prefetching**

## 9. 반응형 & 접근성

### 반응형 디자인
* **Mobile-First Approach**
* **Fluid Typography**: clamp() 활용
* **Responsive Images**: srcset, sizes
* **Touch-Friendly**: 44×44px 최소 터치 영역
* **Viewport Meta Tag**

### 접근성 (Accessibility)
* **WCAG 2.1 AA 준수**
* **명도 대비**: 4.5:1 (normal), 3:1 (large)
* **키보드 네비게이션**: 모든 인터랙티브 요소
* **Screen Reader Support**: ARIA labels, roles
* **Focus Management**: visible focus indicators
* **prefers-reduced-motion 대응**
* **Lang Attribute**: 언어 명시
* **Skip Navigation Links**

## 10. 테스팅 & 문서화

### Testing Strategy
* **Unit Testing**: Jest, React Testing Library
* **Integration Testing**: Cypress, Playwright
* **Visual Regression Testing**: Chromatic, Percy
* **Accessibility Testing**: axe-core, Pa11y
* **Performance Testing**: Lighthouse CI

### Documentation
* **Storybook Integration**: 컴포넌트 카탈로그
* **API Documentation**: Props, Methods, Events
* **Usage Examples**: 실제 사용 예제
* **Best Practices**: Do's and Don'ts
* **Migration Guides**: 버전 업그레이드 가이드

## 11. 콘텐츠 전략

### 텍스트 가이드라인
* **Tone & Voice**: 친근하고 전문적인
* **Microcopy**: 간결하고 명확한
* **Error Messages**: 해결책 제시
* **Placeholder Text**: 도움이 되는 힌트
* **CTA Text**: 액션 중심의 동사 사용

### 콘텐츠 원칙
* **Clarity**: 명확하고 이해하기 쉬운
* **Consistency**: 일관된 용어 사용
* **Conciseness**: 간결하고 핵심적인
* **Context**: 맥락에 맞는 정보 제공

## 12. 버전 관리 & 마이그레이션

### Version Control
* **Semantic Versioning**: MAJOR.MINOR.PATCH
* **Change Log**: 모든 변경사항 기록
* **Design Token Versioning**: 토큰별 버전 관리
* **Component Versioning**: 독립적 버전 관리

### Migration Strategy
* **Deprecation Policy**: 최소 2개 버전 유지
* **Breaking Changes**: major 버전에서만
* **Migration Tools**: 자동 마이그레이션 스크립트
* **Backward Compatibility**: 가능한 한 유지

## 13. 구현 단계

### Phase 0: Audit (2주)
* 기존 UI 인벤토리 분석
* 사용 패턴 도출
* 요구사항 정의

### Phase 1: Foundation (4주)
* 디자인 토큰 시스템 구축
* CSS 변수 시스템 구현
* Theme Provider 개발
* Grid & Layout 시스템

### Phase 2: First Kit (6주)
* Modern SaaS 키트 완성 (기본값)
* 핵심 컴포넌트 개발
* 전체 컴포넌트 variant 매핑
* Storybook 구축

### Phase 3: Kit Expansion (8주)
* E-commerce, Creative, Corporate, Startup 키트 추가
* Kit 선택 UI 제공
* 고급 컴포넌트 개발

### Phase 4: Customization (4주)
* 색상/폰트 커스터마이징 도구
* 간격 조정 옵션
* Theme Builder UI

### Phase 5: Monitoring & Iteration (지속)
* 사용 패턴 추적
* 성능 모니터링
* 사용자 피드백 수집
* 지속적 개선

## 14. 아이콘 사용 가이드 (Lucide)

### Icon System
* **Icon Wrapper**: `<Icon icon={...} size="md" />`
* **IconButton Component**: 44×44px 최소 터치 영역
* **Status Icon Mapping**: `statusIconMap`
* **Kit별 Variations**: stroke/color 변형

### Icon Guidelines
* **Consistent Size**: 토큰 사용
* **Meaningful Icons**: 직관적 의미 전달
* **Accessible Icons**: aria-label 필수
* **Loading States**: 애니메이션 아이콘

## 15. 결론

이 디자인 시스템은 **shadcn/ui 프리미티브 + lucide 아이콘**을 토대로:

* 제품 소개 페이지의 핵심 UI 패턴 (Hero, Features, Pricing, Testimonials 등)을 모두 커버하며
* 반응형, 다크모드, 접근성을 완벽히 지원하고
* 키트/테마를 통해 여러 브랜드 성격을 일관되게 표현할 수 있으며
* 성능 최적화와 개발자 경험을 모두 고려한 시스템이다

최종적으로, 개발자와 디자이너가 **일관된 토큰 + 컴포넌트 라이브러리**를 공유하여 빠르고 안정적으로 제품 웹사이트를 제작할 수 있게 된다.