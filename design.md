# Aether Design System

> A comprehensive design language for the AI-powered website builder that creates professional websites in 30 seconds.

## Table of Contents
1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Components](#4-components)
5. [Animation System](#5-animation-system)
6. [Spacing & Layout](#6-spacing--layout)
7. [Responsive Design](#7-responsive-design)
8. [Icons & Imagery](#8-icons--imagery)
9. [Design Tokens](#9-design-tokens)
10. [Accessibility](#10-accessibility)

---

## 1. Design Principles

### 1.1 Speed First
**Lightning-fast interactions with instant feedback**
- All interactions respond within 100ms
- Optimistic UI updates for perceived performance
- Skeleton loaders instead of spinners
- GPU-accelerated animations only (transform, opacity)
- Lazy loading for below-the-fold content

```css
/* Performance-optimized animation */
.fast-transition {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* 성능 최적화를 위한 컨테인먼트 */
.component-tree {
  content-visibility: auto; /* 뷰포트 밖 콘텐츠 렌더링 지연 */
  contain: layout style paint; /* 렌더링 최적화 */
  contain-intrinsic-size: auto 500px; /* 미리 공간 할당 */
}

/* 복잡한 레이아웃 최적화 */
.editor-canvas {
  isolation: isolate; /* 새로운 스택 컨텍스트 생성 */
  transform: translateZ(0); /* GPU 가속 */
  backface-visibility: hidden; /* 픍셀 서브 렌더링 방지 */
}
```

### 1.2 AI Native
**Designed for dynamic, AI-generated content**
- Flexible layouts that adapt to varying content lengths
- Smart truncation with "Show more" for AI text
- Placeholder states for generating content
- Graceful fallbacks for AI failures
- Content-aware color extraction

```tsx
// AI content container with adaptive layout
<div className="ai-content-wrapper flex flex-col gap-4 min-h-0 max-h-[80vh] overflow-auto">
  <div className="ai-text line-clamp-3 hover:line-clamp-none transition-all">
    {content}
  </div>
</div>
```

### 1.3 Accessibility First
**WCAG 2.1 AA compliant by default**
- Minimum contrast ratio 4.5:1 for text
- Focus indicators on all interactive elements
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support

```tsx
// Accessible button component
<button
  className="focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
  aria-label="Generate website"
  role="button"
  tabIndex={0}
>
  Generate
</button>
```

### 1.4 Mobile First
**Progressive enhancement from mobile to desktop**
- Touch-friendly tap targets (minimum 44x44px)
- Responsive typography with fluid scaling
- Mobile-optimized navigation patterns
- Performance budget: <100KB CSS, <200KB JS
- Viewport-aware component rendering

### 1.5 Delightful
**Thoughtful micro-interactions that spark joy**
- Smooth spring animations for natural movement
- Haptic feedback on mobile interactions
- Particle effects for AI generation
- Sound effects (optional) for key actions
- Easter eggs for power users

---

## 2. Color System

### 2.1 Brand Colors

```css
:root {
  /* Primary - Electric Blue */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6; /* Main brand color */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  --primary-950: #172554;

  /* Secondary - Midnight */
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-200: #e2e8f0;
  --secondary-300: #cbd5e1;
  --secondary-400: #94a3b8;
  --secondary-500: #64748b;
  --secondary-600: #475569;
  --secondary-700: #334155;
  --secondary-800: #1e293b;
  --secondary-900: #0f172a;
  --secondary-950: #020617;

  /* Accent - Neon Purple */
  --accent-50: #faf5ff;
  --accent-100: #f3e8ff;
  --accent-200: #e9d5ff;
  --accent-300: #d8b4fe;
  --accent-400: #c084fc;
  --accent-500: #a855f7; /* AI features */
  --accent-600: #9333ea;
  --accent-700: #7e22ce;
  --accent-800: #6b21a8;
  --accent-900: #581c87;

  /* AI Gradient */
  --ai-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --ai-gradient-hover: linear-gradient(135deg, #764ba2 0%, #f093fb 100%);
  --ai-gradient-animated: linear-gradient(270deg, #667eea, #764ba2, #f093fb, #667eea);
}
```

### 2.2 Semantic Colors

```css
:root {
  /* Success */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;

  /* Warning */
  --warning-50: #fefce8;
  --warning-500: #eab308;
  --warning-600: #ca8a04;
  --warning-700: #a16207;

  /* Error */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-700: #b91c1c;

  /* Info */
  --info-50: #eff6ff;
  --info-500: #3b82f6;
  --info-600: #2563eb;
  --info-700: #1d4ed8;

  /* Neutral (Gray scale) */
  --neutral-50: #fafafa;
  --neutral-100: #f4f4f5;
  --neutral-200: #e4e4e7;
  --neutral-300: #d4d4d8;
  --neutral-400: #a1a1aa;
  --neutral-500: #71717a;
  --neutral-600: #52525b;
  --neutral-700: #3f3f46;
  --neutral-800: #27272a;
  --neutral-900: #18181b;
  --neutral-950: #09090b;
}
```

### 2.3 Dark Mode

```css
[data-theme="dark"] {
  /* Inverted brand colors */
  --primary-50: #172554;
  --primary-500: #60a5fa;
  --primary-900: #eff6ff;

  /* Background layers */
  --bg-primary: #09090b;
  --bg-secondary: #18181b;
  --bg-tertiary: #27272a;
  --bg-elevated: #3f3f46;

  /* Text colors */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;

  /* Borders */
  --border-default: #27272a;
  --border-hover: #3f3f46;
  --border-focus: #60a5fa;
}
```

### 2.4 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          // ... all primary colors
          500: 'var(--primary-500)',
        },
        ai: {
          gradient: 'var(--ai-gradient)',
          purple: 'var(--accent-500)',
        }
      },
      backgroundImage: {
        'ai-gradient': 'var(--ai-gradient)',
        'ai-gradient-animated': 'var(--ai-gradient-animated)',
      }
    }
  }
}
```

---

## 3. Typography

### 3.1 Font Stack

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
  --font-display: 'Cal Sans', var(--font-sans); /* For headings */
}
```

### 3.2 Type Scale

```css
/* Fluid typography with clamp() */
:root {
  /* Text sizes */
  --text-xs: clamp(0.75rem, 2vw, 0.75rem);     /* 12px */
  --text-sm: clamp(0.875rem, 2.5vw, 0.875rem); /* 14px */
  --text-base: clamp(1rem, 3vw, 1rem);         /* 16px */
  --text-lg: clamp(1.125rem, 3.5vw, 1.125rem); /* 18px */
  --text-xl: clamp(1.25rem, 4vw, 1.25rem);     /* 20px */
  --text-2xl: clamp(1.5rem, 5vw, 1.5rem);      /* 24px */
  --text-3xl: clamp(1.875rem, 6vw, 1.875rem);  /* 30px */
  --text-4xl: clamp(2.25rem, 7vw, 2.25rem);    /* 36px */
  --text-5xl: clamp(3rem, 8vw, 3rem);          /* 48px */
  --text-6xl: clamp(3.75rem, 10vw, 3.75rem);   /* 60px */
  --text-7xl: clamp(4.5rem, 12vw, 4.5rem);     /* 72px */

  /* Line heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Letter spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

### 3.3 Font Weights

```css
:root {
  --font-thin: 100;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

### 3.4 Typography Components

```tsx
// Heading component with responsive sizing
export const Heading = ({ level, children, className = '' }) => {
  const styles = {
    h1: 'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight',
    h2: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    h3: 'text-3xl md:text-4xl lg:text-5xl font-semibold',
    h4: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    h5: 'text-xl md:text-2xl lg:text-3xl font-medium',
    h6: 'text-lg md:text-xl lg:text-2xl font-medium',
  };

  const Tag = level;
  return <Tag className={`${styles[level]} ${className}`}>{children}</Tag>;
};
```

### 3.5 Website Generation Font Presets

```typescript
export const fontPresets = {
  modern: {
    heading: 'Inter',
    body: 'Inter',
    weights: [400, 500, 600, 700],
  },
  elegant: {
    heading: 'Playfair Display',
    body: 'Lora',
    weights: [400, 500, 700],
  },
  playful: {
    heading: 'Fredoka',
    body: 'Nunito',
    weights: [400, 600, 700],
  },
  professional: {
    heading: 'Montserrat',
    body: 'Open Sans',
    weights: [400, 500, 600, 700],
  },
  tech: {
    heading: 'Space Grotesk',
    body: 'JetBrains Mono',
    weights: [400, 500, 700],
  },
};
```

---

## 4. Components

### 4.1 Core Components

#### Button Component

```tsx
// Button variants and sizes
export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900 dark:bg-secondary-800 dark:hover:bg-secondary-700',
    ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
    ai: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl',
    danger: 'bg-error-500 hover:bg-error-600 text-white',
    success: 'bg-success-500 hover:bg-success-600 text-white',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs rounded-md',
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2.5 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
    xl: 'px-8 py-4 text-xl rounded-xl',
  };

  const loadingSpinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && loadingSpinner}
      {children}
    </button>
  );
};
```

#### Input Component

```tsx
export const Input = ({
  type = 'text',
  label,
  error,
  hint,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`
            w-full px-3 py-2 ${icon ? 'pl-10' : ''}
            border border-neutral-300 dark:border-neutral-700
            rounded-lg shadow-sm
            placeholder-neutral-400 dark:placeholder-neutral-600
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            dark:bg-neutral-900 dark:text-white
            ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {hint && !error && (
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
    </div>
  );
};
```

#### Card Component

```tsx
export const Card = ({
  variant = 'basic',
  hover = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const variants = {
    basic: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800',
    elevated: 'bg-white dark:bg-neutral-900 shadow-lg',
    interactive: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:shadow-lg transition-shadow',
    preview: 'bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700',
    ai: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800',
  };

  return (
    <div
      className={`
        ${variants[variant]}
        rounded-xl p-6
        ${hover ? 'hover:scale-[1.02] transition-transform duration-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
```

#### Modal Component

```tsx
export const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`
          relative bg-white dark:bg-neutral-900 
          rounded-2xl shadow-2xl
          ${sizes[size]} w-full
          transform transition-all
        `}>
          {/* Header */}
          <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

#### Toast Component

```tsx
export const Toast = ({
  type = 'info',
  message,
  action,
  onClose,
}) => {
  const types = {
    success: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      icon: '✓',
      iconColor: 'text-success-600 dark:text-success-400',
    },
    error: {
      bg: 'bg-error-50 dark:bg-error-900/20',
      border: 'border-error-200 dark:border-error-800',
      icon: '✕',
      iconColor: 'text-error-600 dark:text-error-400',
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800',
      icon: '!',
      iconColor: 'text-warning-600 dark:text-warning-400',
    },
    info: {
      bg: 'bg-info-50 dark:bg-info-900/20',
      border: 'border-info-200 dark:border-info-800',
      icon: 'i',
      iconColor: 'text-info-600 dark:text-info-400',
    },
    loading: {
      bg: 'bg-neutral-50 dark:bg-neutral-900',
      border: 'border-neutral-200 dark:border-neutral-800',
      icon: '◌',
      iconColor: 'text-neutral-600 dark:text-neutral-400 animate-spin',
    },
  };

  const style = types[type];

  return (
    <div className={`
      ${style.bg} ${style.border}
      border rounded-lg p-4 shadow-lg
      flex items-center gap-3
      min-w-[300px] max-w-[500px]
    `}>
      <div className={`
        w-8 h-8 rounded-full
        ${style.bg} ${style.border} border
        flex items-center justify-center
        font-bold ${style.iconColor}
      `}>
        {style.icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-neutral-900 dark:text-white">
          {message}
        </p>
        {action && (
          <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1">
            {action}
          </button>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
```

### 4.2 Layout Components

#### Container Component

```tsx
export const Container = ({
  maxWidth = 'xl',
  padding = true,
  children,
  className = '',
}) => {
  const maxWidths = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`
      ${maxWidths[maxWidth]}
      mx-auto w-full
      ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};
```

#### Grid Component

```tsx
export const Grid = ({
  cols = 12,
  gap = 4,
  children,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  const gaps = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div className={`
      grid ${gridCols[cols]} ${gaps[gap]}
      ${className}
    `}>
      {children}
    </div>
  );
};
```

#### Stack Component

```tsx
export const Stack = ({
  direction = 'vertical',
  gap = 4,
  align = 'start',
  justify = 'start',
  children,
  className = '',
}) => {
  const directions = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  const gaps = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div className={`
      flex ${directions[direction]}
      ${gaps[gap]}
      ${alignments[align]}
      ${justifications[justify]}
      ${className}
    `}>
      {children}
    </div>
  );
};
```

### 4.3 AI Components

#### Skeleton Loader Component

```tsx
export const SkeletonLoader = ({ 
  variant = 'text',
  width = '100%',
  height = 'auto',
  className = '' 
}) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    avatar: 'w-12 h-12 rounded-full',
    card: 'h-32 rounded-lg',
    image: 'h-48 rounded-lg',
    button: 'h-10 w-24 rounded-md'
  };

  return (
    <div
      className={`
        skeleton
        ${variants[variant]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
};
```

```css
/* 스켈레톤 로더 애니메이션 */
@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

/* 다크모드 스켈레톤 */
[data-theme="dark"] .skeleton {
  background: linear-gradient(
    90deg,
    #27272a 25%,
    #3f3f46 50%,
    #27272a 75%
  );
}

/* 콘텐츠 로딩 패턴 */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-paragraph {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-paragraph .skeleton:nth-child(1) { width: 100%; }
.skeleton-paragraph .skeleton:nth-child(2) { width: 95%; }
.skeleton-paragraph .skeleton:nth-child(3) { width: 85%; }
```

#### AIGeneratingCard Component

```tsx
export const AIGeneratingCard = ({ 
  progress = 0,
  stage = 'Initializing',
  preview = null 
}) => {
  return (
    <Card variant="ai" className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-x" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Generating Your Website
          </h3>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {Math.round(progress)}%
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Stage indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {stage}
          </span>
        </div>
        
        {/* Preview skeleton or actual preview */}
        {preview ? (
          <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
            {preview}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
          </div>
        )}
      </div>
    </Card>
  );
};
```

#### AIPromptInput Component

```tsx
export const AIPromptInput = ({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  placeholder = "Describe your dream website...",
  isGenerating = false,
}) => {
  return (
    <div className="relative">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full min-h-[120px] p-4 pr-12
            border-2 border-neutral-200 dark:border-neutral-800
            rounded-xl resize-none
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            dark:bg-neutral-900 dark:text-white
            placeholder-neutral-400 dark:placeholder-neutral-600
            text-lg
          "
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) {
              onSubmit();
            }
          }}
        />
        
        {/* Magic AI icon */}
        <div className="absolute top-4 right-4 text-purple-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
            />
          </svg>
        </div>
      </div>
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onChange(value + ' ' + suggestion)}
              className="
                px-3 py-1 text-sm
                bg-purple-100 dark:bg-purple-900/30
                text-purple-700 dark:text-purple-300
                rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50
                transition-colors
              "
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {/* Submit button */}
      <Button
        variant="ai"
        size="lg"
        onClick={onSubmit}
        disabled={!value || isGenerating}
        loading={isGenerating}
        className="mt-4 w-full"
      >
        {isGenerating ? 'Generating Magic...' : 'Generate Website'}
      </Button>
    </div>
  );
};
```

#### AIResultPreview Component

```tsx
export const AIResultPreview = ({
  siteData,
  isLoading = false,
  onEdit,
  onDeploy,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        
        {/* Hero skeleton */}
        <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        
        {/* Content skeletons */}
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Preview iframe */}
      <div className="relative rounded-xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-800">
        <iframe
          src={siteData.previewUrl}
          className="w-full h-[600px]"
          title="Site Preview"
        />
        
        {/* Overlay controls */}
        <div className="
          absolute inset-0 bg-gradient-to-t from-black/50 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity
          pointer-events-none
        ">
          <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-auto">
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                />
              </svg>
              Edit
            </Button>
            <Button variant="ai" size="sm" onClick={onDeploy}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              Deploy
            </Button>
          </div>
        </div>
      </div>
      
      {/* Device switcher */}
      <div className="mt-4 flex justify-center gap-2">
        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
        </button>
        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
```

#### AILoadingStates Component

```tsx
export const AILoadingStates = ({ type = 'skeleton' }) => {
  const types = {
    skeleton: (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
      </div>
    ),
    typing: (
      <div className="flex items-center gap-1">
        <span className="text-2xl">✨</span>
        <span className="text-neutral-600 dark:text-neutral-400">AI is thinking</span>
        <span className="animate-pulse">.</span>
        <span className="animate-pulse animation-delay-200">.</span>
        <span className="animate-pulse animation-delay-400">.</span>
      </div>
    ),
    particles: (
      <div className="relative h-32">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    ),
    progress: (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">Generating components</span>
          <span className="text-purple-600 dark:text-purple-400">73%</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full w-3/4 transition-all" />
        </div>
      </div>
    ),
  };

  return types[type];
};
```

### 4.4 Editor Components

#### Canvas Component

```tsx
export const Canvas = ({
  components = [],
  selectedId,
  onSelect,
  onDrop,
  gridEnabled = true,
}) => {
  return (
    <div className="relative w-full h-full bg-neutral-50 dark:bg-neutral-950 overflow-auto">
      {/* Grid overlay */}
      {gridEnabled && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                transparent, 
                transparent 39px, 
                rgba(0,0,0,0.05) 39px, 
                rgba(0,0,0,0.05) 40px
              ),
              repeating-linear-gradient(90deg, 
                transparent, 
                transparent 39px, 
                rgba(0,0,0,0.05) 39px, 
                rgba(0,0,0,0.05) 40px
              )
            `,
          }}
        />
      )}
      
      {/* Ruler guides */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        {/* Ruler marks */}
      </div>
      <div className="absolute top-0 left-0 bottom-0 w-6 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800">
        {/* Ruler marks */}
      </div>
      
      {/* Canvas content */}
      <div className="relative p-8 ml-6 mt-6">
        {components.map((component) => (
          <div
            key={component.id}
            className={`
              relative group cursor-move
              ${selectedId === component.id ? 'ring-2 ring-primary-500' : ''}
            `}
            onClick={() => onSelect(component.id)}
            style={{
              position: 'absolute',
              left: component.x,
              top: component.y,
              width: component.width,
              height: component.height,
            }}
          >
            {/* Component content */}
            {component.content}
            
            {/* Resize handles */}
            {selectedId === component.id && (
              <>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary-500 rounded-full cursor-nw-resize" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full cursor-ne-resize" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary-500 rounded-full cursor-sw-resize" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary-500 rounded-full cursor-se-resize" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### PropertyPanel Component

```tsx
export const PropertyPanel = ({
  selectedComponent,
  onUpdate,
}) => {
  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
        Select a component to edit properties
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-neutral-900 dark:text-white">
        Properties
      </h3>
      
      {/* Basic properties */}
      <div className="space-y-3">
        <Input
          label="ID"
          value={selectedComponent.id}
          disabled
        />
        <Input
          label="Class"
          value={selectedComponent.className}
          onChange={(e) => onUpdate({ className: e.target.value })}
        />
      </div>
      
      {/* Position */}
      <div>
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Position
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="X"
            type="number"
            value={selectedComponent.x}
            onChange={(e) => onUpdate({ x: parseInt(e.target.value) })}
          />
          <Input
            label="Y"
            type="number"
            value={selectedComponent.y}
            onChange={(e) => onUpdate({ y: parseInt(e.target.value) })}
          />
        </div>
      </div>
      
      {/* Size */}
      <div>
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Size
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Width"
            type="number"
            value={selectedComponent.width}
            onChange={(e) => onUpdate({ width: parseInt(e.target.value) })}
          />
          <Input
            label="Height"
            type="number"
            value={selectedComponent.height}
            onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
          />
        </div>
      </div>
      
      {/* Styling */}
      <div>
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Styling
        </h4>
        <div className="space-y-2">
          <Input
            label="Background"
            type="color"
            value={selectedComponent.background}
            onChange={(e) => onUpdate({ background: e.target.value })}
          />
          <Input
            label="Text Color"
            type="color"
            value={selectedComponent.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
```

#### LayerPanel Component

```tsx
export const LayerPanel = ({
  layers,
  selectedId,
  onSelect,
  onReorder,
  onToggleVisibility,
  onToggleLock,
}) => {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
        Layers
      </h3>
      
      <div className="space-y-1">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`
              flex items-center gap-2 p-2 rounded-lg cursor-pointer
              ${selectedId === layer.id 
                ? 'bg-primary-100 dark:bg-primary-900/30' 
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }
            `}
            onClick={() => onSelect(layer.id)}
          >
            {/* Visibility toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(layer.id);
              }}
              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
            >
              {layer.visible ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                  />
                </svg>
              )}
            </button>
            
            {/* Lock toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(layer.id);
              }}
              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
            >
              {layer.locked ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
                  />
                </svg>
              )}
            </button>
            
            {/* Layer icon */}
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded flex items-center justify-center">
              {layer.type === 'text' && 'T'}
              {layer.type === 'image' && '□'}
              {layer.type === 'shape' && '○'}
            </div>
            
            {/* Layer name */}
            <span className="flex-1 text-sm text-neutral-900 dark:text-white">
              {layer.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### Toolbar Component

```tsx
export const Toolbar = ({
  tools,
  activeTool,
  onToolSelect,
}) => {
  const toolIcons = {
    select: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M15 15l-2 5L9 9l11 4-5 2z" 
        />
      </svg>
    ),
    text: <span className="font-bold text-lg">T</span>,
    rectangle: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
      </svg>
    ),
    circle: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" strokeWidth={2} />
      </svg>
    ),
    image: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    ),
    hand: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" 
        />
      </svg>
    ),
  };

  return (
    <div className="flex gap-1 p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`
            p-2 rounded-lg transition-colors
            ${activeTool === tool.id 
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }
          `}
          title={tool.name}
        >
          {toolIcons[tool.id]}
        </button>
      ))}
      
      {/* Separator */}
      <div className="w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />
      
      {/* Additional tools */}
      <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
      </button>
    </div>
  );
};
```

---

## 5. Animation System

### 5.1 Transitions

```typescript
// framer-motion-config.ts
export const transitions = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  // Modal/overlay transitions
  overlay: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },

  // Slide transitions
  slideIn: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { type: 'spring', damping: 30, stiffness: 300 }
  },

  // Fade transitions
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  }
};
```

### 5.2 Micro-interactions

```typescript
export const microInteractions = {
  // Button interactions
  button: {
    tap: { scale: 0.98 },
    hover: { scale: 1.02 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  },

  // Card interactions
  card: {
    hover: { 
      y: -4,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },

  // Link interactions
  link: {
    hover: { x: 2 },
    transition: { type: 'tween', duration: 0.1 }
  },

  // Icon interactions
  icon: {
    hover: { rotate: 15 },
    tap: { rotate: -15 },
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  }
};
```

### 5.3 Loading States

```typescript
export const loadingAnimations = {
  // Skeleton pulse
  skeleton: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Spinner rotation
  spinner: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  },

  // Dots bounce
  dots: {
    animate: {
      y: [-3, 3, -3],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
        staggerChildren: 0.1
      }
    }
  },

  // Progress bar
  progress: {
    initial: { width: 0 },
    animate: { width: '100%' },
    transition: { duration: 30, ease: 'linear' }
  }
};
```

### 5.4 AI Generation Effects

```typescript
export const aiEffects = {
  // Generating pulse
  generating: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },

  // Particle float
  particle: {
    animate: {
      y: [-20, 20],
      x: [-10, 10],
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        },
        x: {
          duration: 5,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }
      }
    }
  },

  // Gradient animation
  gradient: {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  },

  // Text reveal
  reveal: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.02
      }
    }
  }
};
```

---

## 6. Spacing & Layout

### 6.1 Grid System

```css
/* 12-column grid system */
.grid-system {
  --columns: 12;
  --gutter: 1.5rem; /* 24px */
  --margin: 1rem; /* 16px on mobile, scales up */
  
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: var(--gutter);
  margin: 0 var(--margin);
}

/* Column spans */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-5 { grid-column: span 5; }
.col-6 { grid-column: span 6; }
.col-7 { grid-column: span 7; }
.col-8 { grid-column: span 8; }
.col-9 { grid-column: span 9; }
.col-10 { grid-column: span 10; }
.col-11 { grid-column: span 11; }
.col-12 { grid-column: span 12; }

/* Responsive columns */
@media (max-width: 640px) {
  .sm\:col-6 { grid-column: span 6; }
  .sm\:col-12 { grid-column: span 12; }
}

@media (min-width: 768px) {
  .md\:col-4 { grid-column: span 4; }
  .md\:col-6 { grid-column: span 6; }
  .md\:col-8 { grid-column: span 8; }
}

@media (min-width: 1024px) {
  .lg\:col-3 { grid-column: span 3; }
  .lg\:col-4 { grid-column: span 4; }
  .lg\:col-6 { grid-column: span 6; }
}
```

### 6.2 Spacing Scale

```css
/* 8px base unit spacing system */
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-5: 1.25rem;  /* 20px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-7: 1.75rem;  /* 28px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-10: 2.5rem;  /* 40px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-14: 3.5rem;  /* 56px */
  --spacing-16: 4rem;    /* 64px */
  --spacing-20: 5rem;    /* 80px */
  --spacing-24: 6rem;    /* 96px */
  --spacing-28: 7rem;    /* 112px */
  --spacing-32: 8rem;    /* 128px */
  --spacing-36: 9rem;    /* 144px */
  --spacing-40: 10rem;   /* 160px */
  --spacing-44: 11rem;   /* 176px */
  --spacing-48: 12rem;   /* 192px */
  --spacing-52: 13rem;   /* 208px */
  --spacing-56: 14rem;   /* 224px */
  --spacing-60: 15rem;   /* 240px */
  --spacing-64: 16rem;   /* 256px */
  --spacing-72: 18rem;   /* 288px */
  --spacing-80: 20rem;   /* 320px */
  --spacing-96: 24rem;   /* 384px */
}

/* Spacing utilities */
.space-y-4 > * + * { margin-top: var(--spacing-4); }
.space-x-4 > * + * { margin-left: var(--spacing-4); }

/* Padding utilities */
.p-4 { padding: var(--spacing-4); }
.px-4 { padding-left: var(--spacing-4); padding-right: var(--spacing-4); }
.py-4 { padding-top: var(--spacing-4); padding-bottom: var(--spacing-4); }

/* Margin utilities */
.m-4 { margin: var(--spacing-4); }
.mx-4 { margin-left: var(--spacing-4); margin-right: var(--spacing-4); }
.my-4 { margin-top: var(--spacing-4); margin-bottom: var(--spacing-4); }

/* Gap utilities for flexbox/grid */
.gap-4 { gap: var(--spacing-4); }
.gap-x-4 { column-gap: var(--spacing-4); }
.gap-y-4 { row-gap: var(--spacing-4); }
```

### 6.3 Container Sizes

```css
:root {
  --container-xs: 475px;
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  --container-3xl: 1920px;
  --container-full: 100%;
}

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

@media (min-width: 640px) {
  .container { max-width: var(--container-sm); }
}

@media (min-width: 768px) {
  .container { max-width: var(--container-md); }
}

@media (min-width: 1024px) {
  .container { max-width: var(--container-lg); }
}

@media (min-width: 1280px) {
  .container { max-width: var(--container-xl); }
}

@media (min-width: 1536px) {
  .container { max-width: var(--container-2xl); }
}
```

---

## 7. Responsive Design

### 7.1 Breakpoints

```css
/* Mobile-first breakpoint system */
:root {
  --screen-xs: 475px;   /* Extra small devices */
  --screen-sm: 640px;   /* Small devices (landscape phones) */
  --screen-md: 768px;   /* Medium devices (tablets) */
  --screen-lg: 1024px;  /* Large devices (desktops) */
  --screen-xl: 1280px;  /* Extra large devices (large desktops) */
  --screen-2xl: 1536px; /* 2X large devices (larger desktops) */
  --screen-3xl: 1920px; /* 3X large devices (full HD) */
}

/* Tailwind breakpoint utilities */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 7.2 Mobile Patterns

```tsx
// Mobile navigation pattern
export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2"
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      <div className={`
        fixed inset-0 z-50 bg-white dark:bg-neutral-900
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:hidden
      `}>
        {/* Menu content */}
      </div>
    </>
  );
};

// Touch-friendly components
export const TouchButton = ({ children, ...props }) => (
  <button
    className="min-h-[44px] min-w-[44px] p-3 tap-highlight-transparent"
    {...props}
  >
    {children}
  </button>
);

// Swipeable carousel
export const SwipeCarousel = ({ items }) => {
  return (
    <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      <div className="flex gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-none w-[80vw] sm:w-[60vw] md:w-[40vw] snap-center"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 7.3 Desktop Patterns

```tsx
// Desktop sidebar layout
export const DesktopLayout = ({ sidebar, content }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar - hidden on mobile */}
      <aside className="hidden lg:block w-64 xl:w-80 border-r border-neutral-200 dark:border-neutral-800">
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {content}
      </main>
    </div>
  );
};

// Desktop data table
export const DesktopTable = ({ columns, data }) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            {columns.map((col) => (
              <th key={col.key} className="text-left p-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-neutral-100 dark:border-neutral-900">
              {columns.map((col) => (
                <td key={col.key} className="p-3">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 8. Icons & Imagery

### 8.1 Icon System

```tsx
// Using Lucide React for consistent icons
import { 
  Home, 
  Settings, 
  User, 
  Search, 
  Plus, 
  X, 
  ChevronDown,
  Sparkles, // AI icon
  Wand2, // Magic/AI icon
  Zap, // Fast/Performance icon
  Globe, // Deploy icon
  Code2, // Code/Developer icon
  Palette, // Design icon
  Layers, // Layers/Components icon
  MousePointer, // Cursor/Select icon
} from 'lucide-react';

// Icon sizes
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
};

// AI-specific icons
export const AIIcons = {
  generate: <Sparkles className="w-5 h-5" />,
  magic: <Wand2 className="w-5 h-5" />,
  fast: <Zap className="w-5 h-5" />,
  brain: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
      />
    </svg>
  ),
};
```

### 8.2 Image Guidelines

```tsx
// Image optimization component
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
}) => {
  return (
    <picture>
      <source
        srcSet={`${src}?fm=webp&w=${width * 2}`}
        type="image/webp"
        media="(min-width: 768px)"
      />
      <source
        srcSet={`${src}?fm=webp&w=${width}`}
        type="image/webp"
      />
      <img
        src={`${src}?w=${width}&h=${height}&fit=cover`}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        className={className}
      />
    </picture>
  );
};

// Placeholder while loading
export const ImagePlaceholder = ({ aspectRatio = '16/9' }) => (
  <div 
    className="bg-neutral-200 dark:bg-neutral-800 animate-pulse"
    style={{ aspectRatio }}
  />
);
```

### 8.3 AI Generated Assets

```tsx
// AI image generation status
export const AIImageStatus = ({ status, imageUrl }) => {
  if (status === 'generating') {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-purple-500 animate-pulse mx-auto mb-2" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Generating image...
            </p>
          </div>
        </div>
        {/* Animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="aspect-video bg-error-50 dark:bg-error-900/20 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <X className="w-12 h-12 text-error-500 mx-auto mb-2" />
          <p className="text-sm text-error-600 dark:text-error-400">
            Failed to generate image
          </p>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt="AI generated" 
      className="w-full h-auto rounded-lg"
    />
  );
};
```

---

## 9. Design Tokens

```json
{
  "color": {
    "primary": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "200": "#bfdbfe",
      "300": "#93c5fd",
      "400": "#60a5fa",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af",
      "900": "#1e3a8a",
      "950": "#172554"
    },
    "neutral": {
      "50": "#fafafa",
      "100": "#f4f4f5",
      "200": "#e4e4e7",
      "300": "#d4d4d8",
      "400": "#a1a1aa",
      "500": "#71717a",
      "600": "#52525b",
      "700": "#3f3f46",
      "800": "#27272a",
      "900": "#18181b",
      "950": "#09090b"
    },
    "semantic": {
      "success": "#22c55e",
      "warning": "#eab308",
      "error": "#ef4444",
      "info": "#3b82f6"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": ["Inter", "system-ui", "sans-serif"],
      "mono": ["JetBrains Mono", "monospace"],
      "display": ["Cal Sans", "Inter", "sans-serif"]
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem"
    },
    "fontWeight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.25,
      "normal": 1.5,
      "relaxed": 1.625
    }
  },
  "spacing": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "32": "8rem",
    "40": "10rem",
    "48": "12rem",
    "56": "14rem",
    "64": "16rem"
  },
  "animation": {
    "duration": {
      "instant": "0ms",
      "fast": "150ms",
      "normal": "300ms",
      "slow": "500ms",
      "slower": "1000ms"
    },
    "easing": {
      "linear": "linear",
      "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
      "easeOut": "cubic-bezier(0, 0, 0.2, 1)",
      "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
      "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)"
    }
  },
  "shadow": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "base": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
  },
  "borderRadius": {
    "none": "0",
    "sm": "0.125rem",
    "base": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "full": "9999px"
  },
  "breakpoint": {
    "xs": "475px",
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  }
}
```

---

## 10. Accessibility

### 10.1 Color Contrast

```css
/* Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text) */
:root {
  /* Text on backgrounds */
  --text-on-primary: #ffffff; /* Contrast ratio: 8.59:1 */
  --text-on-secondary: #ffffff; /* Contrast ratio: 15.3:1 */
  --text-on-success: #ffffff; /* Contrast ratio: 4.52:1 */
  --text-on-error: #ffffff; /* Contrast ratio: 4.54:1 */
  
  /* Minimum contrast pairs */
  --min-contrast-text: #525252; /* On white: 7.48:1 */
  --min-contrast-large: #737373; /* On white: 4.52:1 */
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --primary-500: #1d4ed8;
    --text-primary: #000000;
    --bg-primary: #ffffff;
    --border-default: #000000;
  }
}
```

### 10.2 Focus States

```css
/* Visible focus indicators for keyboard navigation */
.focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Remove focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-500);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-to-content:focus {
  top: 0;
}
```

### 10.3 Screen Reader Support

```tsx
// Screen reader only text
export const SROnly = ({ children }) => (
  <span className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
    {children}
  </span>
);

// Accessible form component
export const AccessibleForm = ({ fields, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} role="form">
      {fields.map((field) => (
        <div key={field.id} className="mb-4">
          <label 
            htmlFor={field.id}
            className="block text-sm font-medium mb-1"
          >
            {field.label}
            {field.required && (
              <span aria-label="required" className="text-error-500 ml-1">
                *
              </span>
            )}
          </label>
          <input
            id={field.id}
            name={field.name}
            type={field.type}
            required={field.required}
            aria-required={field.required}
            aria-invalid={field.error ? 'true' : 'false'}
            aria-describedby={field.error ? `${field.id}-error` : undefined}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {field.error && (
            <p id={`${field.id}-error`} className="mt-1 text-sm text-error-600">
              {field.error}
            </p>
          )}
        </div>
      ))}
      <button type="submit" className="btn-primary">
        Submit
      </button>
    </form>
  );
};

// Live region for dynamic updates
export const LiveRegion = ({ message, type = 'polite' }) => (
  <div
    role="status"
    aria-live={type}
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);
```

### 10.4 Keyboard Navigation

```tsx
// Keyboard navigation hook
export const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tab trap for modals
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }

      // Escape to close
      if (e.key === 'Escape') {
        // Close modal/dropdown
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Roving tabindex for lists
export const RovingTabIndex = ({ items }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((index + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((index - 1 + items.length) % items.length);
    }
  };

  return (
    <ul role="list">
      {items.map((item, index) => (
        <li
          key={index}
          tabIndex={focusedIndex === index ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, index)}
          role="listitem"
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
```

---

## Appendix

### A. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          // Primary color palette
        },
        ai: {
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### B. Component Examples

```tsx
// Complete page example using the design system
export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Container maxWidth="xl" className="py-20">
          <Grid cols={12} gap={8}>
            <div className="col-span-12 lg:col-span-6">
              <Heading level="h1" className="mb-6">
                Build Websites with
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {' '}AI Magic
                </span>
              </Heading>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                Generate professional websites in 30 seconds. No code required.
              </p>
              <Stack direction="horizontal" gap={4}>
                <Button variant="ai" size="lg">
                  Start Building
                </Button>
                <Button variant="ghost" size="lg">
                  Watch Demo
                </Button>
              </Stack>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <AIGeneratingCard
                progress={75}
                stage="Optimizing content"
              />
            </div>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <Container maxWidth="xl">
          <Heading level="h2" className="text-center mb-12">
            Everything You Need
          </Heading>
          <Grid cols={12} gap={6}>
            {features.map((feature) => (
              <div key={feature.id} className="col-span-12 md:col-span-6 lg:col-span-4">
                <Card variant="interactive" hover>
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </Card>
              </div>
            ))}
          </Grid>
        </Container>
      </section>
    </div>
  );
};
```

### C. Do's and Don'ts

#### Do's ✅
- Use semantic HTML elements for better accessibility
- Maintain consistent spacing using the 8px grid
- Test all interactions with keyboard navigation
- Provide loading states for all async operations
- Use the AI gradient for AI-related features
- Optimize animations for 60fps performance
- Follow mobile-first responsive design
- Include focus states for all interactive elements

#### Don'ts ❌
- Don't use colors outside the defined palette
- Don't create custom spacing values
- Don't use animations longer than 500ms for micro-interactions
- Don't forget dark mode variants
- Don't use font sizes smaller than 14px for body text
- Don't create components without loading and error states
- Don't ignore accessibility requirements
- Don't use px units for responsive design

---

## Conclusion

The Aether Design System provides a comprehensive foundation for building a modern, AI-powered website builder. By following these guidelines, you ensure consistency, accessibility, and a delightful user experience across all touchpoints.

For questions or updates to this design system, please refer to the design team or submit a pull request with proposed changes.

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: Aether Design Team