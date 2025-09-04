# 컴포넌트 편집 규칙 가이드

## 🎯 개요

이 문서는 Aether 프로젝트의 모든 컴포넌트가 일관된 편집 경험을 제공하기 위한 표준 규칙을 정의합니다. 

### 목표
- 모든 컴포넌트에서 일관된 편집 UX 제공
- 개발자가 새로운 편집 가능한 컴포넌트를 쉽게 만들 수 있도록 지원
- 유지보수성과 확장성 확보

## 🏗️ 핵심 아키텍처

### EditableElement 래퍼 패턴

모든 편집 가능한 요소는 `EditableElement` 컴포넌트로 감싸야 합니다.

```typescript
interface EditableElementProps {
  id: string;                    // 고유 요소 ID
  className?: string;            // 추가 CSS 클래스
  children: React.ReactNode;     // 실제 콘텐츠
  onClick?: (e: React.MouseEvent) => void;  // 클릭 핸들러
  'data-editable-type'?: string; // 요소 타입 (text, button, image 등)
}

const EditableElement: React.FC<EditableElementProps> = ({ 
  id, 
  className = '', 
  children, 
  onClick,
  'data-editable-type': editableType
}) => (
  <div 
    id={id}
    className={`${className} cursor-pointer transition-all duration-200 
                hover:ring-2 hover:ring-blue-300 hover:bg-blue-50/30`}
    onClick={onClick}
    data-editable-type={editableType}
    data-element-id={id}
    title={`Click to edit ${editableType}`}
  >
    {children}
  </div>
);
```

### 컴포넌트 구조 계층

```
Section (전체 섹션)
├── Container (레이아웃 컨테이너)
    ├── Text Elements (텍스트 요소들)
    ├── Button Elements (버튼 요소들)
    ├── Image Elements (이미지 요소들)
    └── Other Content Elements
```

## 🔖 요소 식별 규칙

### 1. Element ID 네이밍 컨벤션

**형식**: `[컴포넌트명]-[요소용도]`

```typescript
// 올바른 예시
"hero-title"              // 히어로 섹션의 제목
"features-grid-title"     // 피쳐 그리드의 제목  
"cta-primary-button"      // CTA 섹션의 주 버튼
"header-logo"             // 헤더의 로고

// 잘못된 예시
"title"                   // 너무 일반적
"hero_title"              // 언더스코어 사용 금지
"heroTitle"               // camelCase 사용 금지
```

### 2. Element Type 분류

| Type | 용도 | PropertyPanel UI |
|------|------|------------------|
| `text` | 편집 가능한 텍스트 | 텍스트 입력창, 색상 선택, 폰트 설정 |
| `button` | 버튼/링크 | 버튼 텍스트, 배경색, 테두리 설정 |
| `image` | 이미지 | URL 입력, 파일 업로드, 대체 텍스트 |
| `container` | 레이아웃 컨테이너 | 배경색, 패딩, 테두리 설정 |
| `section` | 메인 섹션 | 배경 스타일, 간격 조정 |
| `placeholder` | 빈 상태 표시 | 콘텐츠 추가 옵션 |

## 📋 컴포넌트 Props 인터페이스

### 필수 EditorProps

모든 편집 가능한 컴포넌트는 다음 props를 지원해야 합니다:

```typescript
interface EditorProps {
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
}

// 컴포넌트 Props 예시
export interface HeroSplitProps {
  // 실제 컴포넌트 props
  title: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  // ... 기타 props
  
  // 에디터 지원 props (EditorProps 확장)
  onElementClick?: (elementId: string, elementType: string) => void;
  selectedElementId?: string;
  customStyles?: Record<string, React.CSSProperties>;
  isEditor?: boolean;
}
```

## ⚙️ 구현 가이드

### 1. 이벤트 핸들링

```typescript
// 클릭 이벤트 핸들러 생성
const handleElementClick = (elementId: string, elementType: string) => 
  (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onElementClick?.(elementId, elementType);
  };

// 사용 예시
<EditableElement
  id="hero-title"
  onClick={handleElementClick('hero-title', 'text')}
  data-editable-type="text"
>
  <h1>{title}</h1>
</EditableElement>
```

### 2. 선택 상태 시각화

```typescript
// 선택 상태에 따른 클래스 적용
const getElementClassName = (elementId: string, baseClassName: string) => {
  const isSelected = selectedElementId === elementId;
  return `${baseClassName} ${isSelected ? 
    'ring-2 ring-green-400 ring-opacity-75 bg-green-50' : ''}`;
};

// 커스텀 스타일 적용
const getElementStyle = (elementId: string) => {
  return customStyles[elementId] || {};
};
```

### 3. 키보드 이벤트 처리

텍스트 입력 시 에디터 단축키와 충돌을 방지하기 위해:

```typescript
<input
  type="text"
  value={value}
  onChange={handleChange}
  onKeyDown={(e) => e.stopPropagation()}
  onKeyUp={(e) => e.stopPropagation()}
  onKeyPress={(e) => e.stopPropagation()}
/>
```

## 🎨 PropertyPanel 확장 규칙

### 요소별 편집 UI 구성

PropertyPanel은 선택된 요소 타입에 따라 다른 UI를 보여줍니다:

```typescript
// text 타입 요소 선택 시
case 'text':
  return (
    <div>
      <textarea value={textContent} onChange={updateText} />
      <input type="color" onChange={updateColor} />
      <select onChange={updateFontSize}>
        <option value="text-sm">Small</option>
        <option value="text-lg">Large</option>
      </select>
    </div>
  );

// button 타입 요소 선택 시  
case 'button':
  return (
    <div>
      <input type="text" value={buttonText} onChange={updateButtonText} />
      <input type="color" onChange={updateBackgroundColor} />
      <select onChange={updateBorderRadius}>
        <option value="rounded-lg">Large</option>
        <option value="rounded-xl">Extra Large</option>
      </select>
    </div>
  );
```

### Props 매핑 함수

각 요소 ID를 컴포넌트 props와 연결하는 매핑 함수가 필요합니다:

```typescript
// 텍스트 요소 → 컴포넌트 props 매핑
const getTextPropName = (elementId: string): string | null => {
  switch (elementId) {
    case 'hero-title':
      return 'title';
    case 'hero-subtitle':
      return 'subtitle';
    case 'hero-description':
      return 'description';
    default:
      return null;
  }
};

// 버튼 요소 → 컴포넌트 props 매핑
const getButtonPropName = (elementId: string): string | null => {
  switch (elementId) {
    case 'hero-primary-button':
      return 'ctaText';
    case 'hero-secondary-button':
      return 'secondaryCtaText';
    default:
      return 'ctaText';
  }
};
```

## 📝 새 컴포넌트 추가 체크리스트

### Phase 1: 컴포넌트 구조 설정
- [ ] EditorProps 인터페이스 확장
- [ ] Zod 스키마 정의 (props 검증용)
- [ ] 고유한 요소 ID 계획 수립
- [ ] 요소별 타입 분류 결정

### Phase 2: EditableElement 적용
- [ ] 모든 편집 가능한 요소를 EditableElement로 감싸기
- [ ] 고유한 ID와 타입 할당
- [ ] 클릭 이벤트 핸들러 구현
- [ ] 선택 상태 시각화 함수 구현

### Phase 3: PropertyPanel 연동
- [ ] 새로운 요소 타입에 대한 편집 UI 추가
- [ ] Props 매핑 함수 구현
- [ ] 업데이트 핸들러 연결

### Phase 4: 테스팅
- [ ] 모든 요소가 클릭 가능한지 확인
- [ ] 선택 상태 시각화 작동 확인
- [ ] PropertyPanel에서 실시간 업데이트 확인
- [ ] 커스텀 스타일 적용 확인

## 💡 구현 예시

### 기본 컴포넌트 구조

```typescript
export function MyComponent({
  title,
  subtitle,
  ctaText,
  onElementClick,
  selectedElementId,
  customStyles = {},
  isEditor = false
}: MyComponentProps) {
  
  const handleElementClick = (elementId: string, elementType: string) => 
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onElementClick?.(elementId, elementType);
    };

  const getElementClassName = (elementId: string, baseClassName: string) => {
    const isSelected = selectedElementId === elementId;
    return `${baseClassName} ${isSelected ? 
      'ring-2 ring-green-400 ring-opacity-75 bg-green-50' : ''}`;
  };

  const getElementStyle = (elementId: string) => {
    return customStyles[elementId] || {};
  };

  return (
    <EditableElement
      id="my-section"
      onClick={handleElementClick('my-section', 'section')}
      data-editable-type="section"
    >
      <section className="py-20">
        <EditableElement
          id="my-container"
          onClick={handleElementClick('my-container', 'container')}
          data-editable-type="container"
        >
          <div className="max-w-7xl mx-auto">
            <EditableElement
              id="my-title"
              onClick={handleElementClick('my-title', 'text')}
              data-editable-type="text"
            >
              <h2 
                className={getElementClassName('my-title', 'text-4xl font-bold')}
                style={getElementStyle('my-title')}
              >
                {title}
              </h2>
            </EditableElement>
            
            <EditableElement
              id="my-button"
              onClick={handleElementClick('my-button', 'button')}
              data-editable-type="button"
            >
              <button 
                className={getElementClassName('my-button', 'px-6 py-3 bg-blue-600 text-white rounded-lg')}
                style={getElementStyle('my-button')}
              >
                {ctaText}
              </button>
            </EditableElement>
          </div>
        </EditableElement>
      </section>
    </EditableElement>
  );
}
```

## 🧪 테스팅 가이드

### 편집 기능 테스트 방법

1. **요소 선택 테스트**
   ```
   ✅ 모든 요소가 클릭 가능한가?
   ✅ 클릭 시 PropertyPanel에 올바른 UI가 나타나는가?
   ✅ 다른 요소 클릭 시 선택이 바뀌는가?
   ```

2. **시각적 피드백 테스트**
   ```
   ✅ 호버 시 파란색 테두리가 나타나는가?
   ✅ 선택 시 초록색 테두리가 나타나는가?
   ✅ 툴팁이 올바르게 표시되는가?
   ```

3. **실시간 업데이트 테스트**
   ```
   ✅ PropertyPanel에서 텍스트 변경 시 즉시 반영되는가?
   ✅ 색상 변경이 실시간으로 적용되는가?
   ✅ 스타일 변경이 올바르게 저장되는가?
   ```

### 일반적인 문제 해결

#### 문제: 요소 클릭이 안됨
- **원인**: EditableElement로 감싸지지 않음
- **해결**: 모든 편집 가능한 요소를 EditableElement로 감쌀 것

#### 문제: PropertyPanel에 내용이 안 나옴
- **원인**: Props 매핑 함수가 없거나 잘못됨
- **해결**: PropertyPanel.tsx에 해당 요소 타입과 매핑 함수 추가

#### 문제: 스타일이 적용 안됨
- **원인**: getElementStyle 함수 누락
- **해결**: customStyles prop을 style 속성에 적용

## 📚 API 레퍼런스

### EditableElement Props

| Prop | Type | 필수 | 설명 |
|------|------|------|------|
| id | string | ✅ | 고유한 요소 식별자 |
| className | string | ❌ | 추가 CSS 클래스 |
| children | ReactNode | ✅ | 실제 렌더링될 콘텐츠 |
| onClick | function | ❌ | 클릭 이벤트 핸들러 |
| data-editable-type | string | ❌ | 요소 타입 (PropertyPanel용) |

### EditorProps 인터페이스

| Prop | Type | 설명 |
|------|------|------|
| onElementClick | function | 요소 클릭 시 호출될 콜백 |
| selectedElementId | string | 현재 선택된 요소 ID |
| customStyles | object | 요소별 커스텀 스타일 |
| isEditor | boolean | 에디터 모드 여부 |

### PropertyPanel 확장 포인트

새로운 요소 타입 추가 시 PropertyPanel.tsx의 `renderElementSpecificProperties()` 함수에 case 추가:

```typescript
case 'your-new-type':
  return (
    <div className="border-b">
      {/* 새로운 타입에 맞는 편집 UI */}
    </div>
  );
```

## 🔄 기존 컴포넌트 마이그레이션

### 단계별 마이그레이션 프로세스

1. **분석**: 현재 컴포넌트에서 편집 가능해야 할 요소들 파악
2. **계획**: 요소별 ID와 타입 할당 계획 수립
3. **구현**: EditableElement 적용 및 이벤트 핸들러 추가
4. **연동**: PropertyPanel에 매핑 함수 추가
5. **테스트**: 편집 기능 전체 테스트

### 마이그레이션 우선순위

1. **High Priority**: Hero 컴포넌트들 (사용자가 가장 많이 편집)
2. **Medium Priority**: Features, CTA 컴포넌트들
3. **Low Priority**: Header, Footer 컴포넌트들

## 🚀 향후 개선사항

### 고려 중인 기능들

- **드래그 앤 드롭**: 요소 위치 변경 기능
- **스타일 프리셋**: 미리 정의된 스타일 테마 적용
- **반응형 편집**: 디바이스별 다른 스타일 설정
- **애니메이션 편집**: 요소별 애니메이션 설정
- **레이어 관리**: 요소 계층 구조 시각화 및 관리

### 성능 최적화 계획

- **지연 로딩**: 편집 모드가 아닐 때는 EditableElement 오버헤드 제거
- **메모이제이션**: 선택 상태 계산 최적화
- **가상화**: 많은 요소가 있는 컴포넌트에서 성능 향상

---

## 📞 도움이 필요할 때

- **일반적인 구현 문제**: 이 문서의 예시와 체크리스트 참조
- **새로운 요소 타입 추가**: PropertyPanel 확장 가이드 참조
- **성능 문제**: 최적화 섹션 참조

이 규칙들을 따르면 모든 컴포넌트에서 일관되고 직관적인 편집 경험을 제공할 수 있습니다!