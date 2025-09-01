# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📊 Current Progress Status
- **Completed**: Task 1.1-1.6 (Day 1) ✅
- **Next Task**: Task 2.1 - LiteLLM Client Enhancement
- **Current Day**: Day 2/14
- **Overall Progress**: 6/84 tasks completed

## Project Overview

**Aether** is an AI-powered website builder that creates professional websites in 30 seconds. The project aims to enable AI to generate complete websites from text prompts, with instant deployment to production and visual drag-and-drop editing capabilities.

**Core Value Proposition:**
- **30-second generation**: From text prompt to live website
- **AI-first approach**: claude-4-sonnet for content/analysis, gpt-5-mini for fast processing, gpt-5 for images
- **Instant deployment**: Direct to Vercel with custom domains
- **Visual editing**: Code-free customization after generation

## Development Workflow

This project follows a structured 14-day sprint methodology with detailed task tracking:

1. **Check task.md** for the current task to work on
2. **Update work-log.md** with progress and blockers
3. **Follow WORKFLOW.md** for detailed development procedures
4. Each task includes specific AI prompts, acceptance criteria, and test requirements

### Key Files for Task Management
- `task.md` - Complete task breakdown with 84 tasks over 14 days
- `work-log.md` - Daily progress tracking and issue documentation
- `WORKFLOW.md` - Step-by-step guide for executing tasks

## 📌 IMPORTANT: Task Progress Tracking

**When completing ANY task, you MUST update the following files:**

### 1. Update task.md
```markdown
# Before starting a task:
**Status**: [ ] Not Started

# While working:
**Status**: [ ] 🔄 In Progress

# After completion:
**Status**: [x] Completed ✅
**Actual Time**: [actual time spent]
```

### 2. Update Progress Tracker in task.md
```markdown
# Update the progress table at the top of task.md:
| Day | Date | Planned Tasks | Completed | Status | Notes |
| 1 | [date] | 6 tasks | X/6 | 🟡 | [any notes] |
```

### 3. Update work-log.md
```markdown
# Add completion entry:
- [x] **[time]** - Task X.X: [Task Name]
  - Status: ✅ Complete
  - Issues: [any issues encountered]
  - Time: [actual time]
```

### 4. Git Commit After Each Task
```bash
# After completing each task:
git add .
git commit -m "Task X.X: [Description] - Completed"
```

### Task Execution Template

⚠️ **MANDATORY: When executing ANY task, you MUST complete ALL these steps:**

1. **Read the task details** from task.md
2. **Mark task as in progress**: `pnpm task:start X.X`
3. **Execute the task** according to specifications
4. **Test the implementation** to verify it works
5. **Complete the task tracking**:
   ```bash
   # REQUIRED COMMANDS - RUN THESE AFTER EVERY TASK:
   pnpm task:complete X.X XXmin  # Mark as complete
   pnpm progress:update          # Update progress
   git add -A                    # Stage all changes
   git commit -m "Task X.X: Description - Completed"
   git push origin main          # Push to repository
   pnpm task:status             # Show final status
   ```
6. **Show completion summary** with all files created/modified

### Example Task Completion Response

```
✅ Task 1.1: Project Initialization - COMPLETED

📝 Files Created:
- package.json
- turbo.json
- apps/web/app/layout.tsx
- [list all created files]

✅ Tests Passed:
- pnpm dev runs successfully
- TypeScript compilation successful
- Tailwind styles applied

📊 Progress Update:
- task.md: Status marked as [x] Completed ✅
- work-log.md: Entry added with 25min actual time
- Progress Tracker: Day 1 - 1/6 tasks completed

💾 Committed:
git commit -m "Task 1.1: Project initialization with Next.js 14 and Turborepo"

⏭️ Ready for Task 1.2: Supabase Setup
```

## Development Commands

Once the project is initialized, use these commands:

```bash
# Development
pnpm dev              # Start development server (will run Turborepo)
pnpm dev:web          # Start only the web app
pnpm dev:preview      # Start preview server

# Building
pnpm build            # Build all packages
pnpm build:web        # Build main web app

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests with Vitest
pnpm test:e2e         # Run E2E tests with Playwright

# Database
pnpm db:push          # Push schema changes to Supabase
pnpm db:generate      # Generate TypeScript types from schema
pnpm db:migrate       # Run migrations

# AI Development
pnpm ai:test          # Test AI prompt generation
pnpm ai:validate      # Validate prompt templates

# Deployment
pnpm deploy           # Deploy to Vercel
pnpm deploy:preview   # Deploy preview branch
```

## Architecture & Code Structure

### Monorepo Structure (Turborepo)
```
apps/
  web/                 # Main Next.js 14 application ✅
  preview/             # Dynamic site preview server (TODO - Day 3)
packages/
  ui/                  # Shared React components ✅
  ai-engine/           # AI integration (partially implemented)
  editor-core/         # Visual editor logic (TODO - Day 4)
  templates/           # Site templates (TODO - Day 5)
  database/            # Supabase schema ✅ (types.ts TODO)
```

### Key Technical Decisions

**Frontend Stack:**
- Next.js 14 with App Router (Server Components for performance) ✅
- React 18 with Suspense boundaries ✅
- Tailwind CSS with custom design system ✅
- Framer Motion for animations (TODO - as needed)
- Zustand + Immer for state management (TODO - as needed)

**Backend Stack:**
- Vercel Edge Runtime (eliminates cold starts) ✅
- Supabase (PostgreSQL with Row Level Security) ✅
- Redis for AI response caching (TODO - Day 7)

**AI Integration:**
- claude-4-sonnet for primary content/analysis
- gpt-5-mini for quick responses and optimization
- gpt-5 for image generation
- All models accessed via LiteLLM unified gateway
- Streaming responses with Vercel AI SDK

### Component Architecture

The visual editor uses a JSON-based component tree stored in the database:
```typescript
{
  "root": {
    "type": "page",
    "props": {},
    "children": [
      {
        "type": "section",
        "props": { "className": "..." },
        "children": [...]
      }
    ]
  }
}
```

### API Routes Pattern

All API routes use Edge Runtime for optimal performance:
```typescript
export const runtime = 'edge';
```

### Database Schema

Key tables (defined in `schema.md`):
- `users` - User profiles with subscription tiers
- `sites` - Website metadata and component trees
- `templates` - Reusable site templates
- `ai_generations` - AI generation history and caching
- `deployments` - Deployment tracking

## AI Prompt Strategy

The project uses a multi-stage AI generation process:

1. **Structure Generation** (claude-4-sonnet): Creates site architecture
2. **Content Generation** (claude-4-sonnet): Writes optimized copy
3. **Quick Processing** (gpt-5-mini): Fast responses and optimization
4. **Image Generation** (gpt-5): Creates visual assets

Prompt templates will be stored in `packages/ai-engine/prompts/` (TODO - Day 2) and documented in `prompt.md`.

## Development Phases

### Week 1 (Days 1-7): MVP Core
- Project setup and infrastructure
- AI integration and prompt engine
- Basic visual editor
- Template system
- One-click deployment

### Week 2 (Days 8-14): Production Ready
- User authentication
- Payment integration
- Advanced editor features
- Performance optimization
- Production deployment

## Testing Strategy

- **Unit Tests**: Vitest for component and utility testing
- **Integration Tests**: Test AI generation pipeline
- **E2E Tests**: Playwright for user workflows
- **Performance Tests**: Core Web Vitals monitoring

## Performance Targets

- **Generation Time**: < 30 seconds
- **Time to Interactive**: < 3 seconds
- **Lighthouse Score**: > 90
- **Bundle Size**: < 200KB JS, < 100KB CSS

## Security Considerations

- All API routes protected with Supabase RLS
- Environment variables for sensitive keys
- Rate limiting on AI endpoints
- Input sanitization for user prompts
- CORS configuration for preview domains

## Deployment

The project auto-deploys to Vercel on push to main:
- Preview deployments for PRs
- Production deployment on main branch
- Custom domain support via Vercel Domains API

## Common Development Tasks

### Adding a New Component
1. Create component in `packages/ui/src/components/`
2. Add to component registry in `packages/editor-core/registry/` (TODO - when editor-core is implemented)
3. Create preview renderer in `apps/preview/components/` (TODO - when preview app is created)
4. Add to template system if reusable (TODO - when templates package is created)

### Modifying AI Prompts
1. Update prompt template in `packages/ai-engine/prompts/` (TODO - create prompts directory)
2. Test with `pnpm ai:test` (TODO - implement test command)
3. Validate output format with `pnpm ai:validate` (TODO - implement validation)
4. Update cost tracking if token usage changes

### Creating a New Template
1. Design template structure in `packages/templates/[category]/` (TODO - when templates package is created)
2. Define component tree JSON
3. Add theme configuration
4. Create preview image
5. Register in template gallery

## Important Context

- This is a **solo development project** with AI pair programming assistance
- The 14-day timeline is aggressive - focus on MVP features only
- Each task in `task.md` includes specific AI prompts to accelerate development
- Use `work-log.md` to track blockers and time spent on each task
- The project prioritizes speed of generation over perfect output
- Visual editor should be intuitive enough for non-technical users

## 🧪 테스트 작성 가이드라인

### 모델 참조 규칙
- **❌ 절대 금지**: 테스트 코드에 AI 모델명 하드코딩
- **❌ 절대 금지**: 테스트 코드에 기본값 제공 (`|| 'model-name'`)
- **✅ 필수**: 환경 변수만 사용 (`process.env.AI_PRIMARY_MODEL`)
- **✅ 필수**: 테스트 실행 전 환경 변수 설정 확인

```typescript
// ❌ 잘못된 방법
expect(result.model).toBe('gpt-4-turbo');
expect(result.model).toBe(process.env.AI_PRIMARY_MODEL || 'claude-4-sonnet');

// ✅ 올바른 방법  
expect(result.model).toBe(process.env.AI_PRIMARY_MODEL);
```

### 사용 가능한 모델 확인
```bash
# LiteLLM에서 사용 가능한 모델 확인
curl -X GET "$LITELLM_API_BASE/models" -H "Authorization: Bearer $LITELLM_API_KEY"
```

### 환경 변수 기반 테스트
- `AI_PRIMARY_MODEL=claude-4-sonnet`: 주 모델 (콘텐츠/분석)
- `AI_FALLBACK_MODEL=gpt-5-mini`: 대체 모델 (빠른 처리)
- `AI_IMAGE_MODEL=gpt-5`: 이미지 모델 (실제 이미지 생성 가능)

### 테스트 실행 전 체크리스트
1. 모델명이 하드코딩되어 있지 않은가?
2. **환경 변수가 올바르게 설정되어 있는가?** (필수!)
3. 테스트에서 기본값(`|| 'model'`)을 사용하지 않는가?
4. 실제 API에서 해당 모델이 사용 가능한가?
5. Mock과 실제 테스트가 분리되어 있는가?

### 현재 사용 가능한 모델 (2025년 9월 기준)
- `claude-4-sonnet`: 메인 모델
- `gpt-5-mini`: 빠른 처리용
- `gpt-oss-20b`: 오픈소스 대안
- `Qwen2.5-14b-instruct`: 중국 모델

## 🤖 Automated Progress Tracking

### Helper Scripts for Task Management

Create these helper scripts to automate progress tracking:

#### 1. Create task-manager.js
```javascript
// scripts/task-manager.js
const fs = require('fs');
const path = require('path');

const TASK_FILE = path.join(__dirname, '../task.md');
const LOG_FILE = path.join(__dirname, '../work-log.md');

function markTaskComplete(taskNumber, actualTime) {
  // Update task.md
  let taskContent = fs.readFileSync(TASK_FILE, 'utf8');
  const taskPattern = new RegExp(`Task ${taskNumber}:[^\n]*\n\*\*Status\*\*: \\[ \\][^\n]*`, 'g');
  taskContent = taskContent.replace(taskPattern, (match) => {
    return match.replace('[ ]', '[x]').replace('Not Started', 'Completed ✅') + `\n**Actual Time**: ${actualTime}`;
  });
  fs.writeFileSync(TASK_FILE, taskContent);
  
  // Update work-log.md
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const logEntry = `\n- [x] **${timestamp}** - Task ${taskNumber}: Completed\n  - Status: ✅ Complete\n  - Time: ${actualTime}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
  
  console.log(`✅ Task ${taskNumber} marked as complete!`);
}

// Usage: node scripts/task-manager.js complete 1.1 25min
const [action, taskNum, time] = process.argv.slice(2);
if (action === 'complete') {
  markTaskComplete(taskNum, time);
}
```

#### 2. Add to package.json
```json
{
  "scripts": {
    "task:complete": "node scripts/task-manager.js complete",
    "task:status": "node scripts/task-status.js",
    "progress:update": "node scripts/update-progress.js"
  }
}
```

### Automatic Task Completion Commands

When completing a task, use these commands:

```bash
# Mark task as complete
pnpm task:complete 1.1 25min

# Update progress tracker
pnpm progress:update

# Generate daily summary
pnpm daily:summary

# Commit with standard message
git add . && git commit -m "Task 1.1: Project initialization - Completed (25min)"
```

**Available Helper Scripts** (already implemented in `/scripts/`):
- `task-manager.js` - Task tracking automation
- `update-progress.js` - Progress tracker updates
- `daily-summary.js` - Daily progress reports
- `test-env.js` & `test-env-simple.js` - Environment validation

### Task Execution Checklist for Claude Code

☑️ **BEFORE starting any task:**
```bash
# 1. Check current task
cat task.md | grep -A 5 "Task X.X"

# 2. Mark as in progress
sed -i '' 's/\[ \] Not Started/\[ \] 🔄 In Progress/g' task.md
```

☑️ **AFTER completing any task:**
```bash
# 1. Mark as complete
pnpm task:complete X.X "XXmin"

# 2. Update progress
pnpm progress:update

# 3. Commit changes
git add -A && git commit -m "Task X.X: [Description] - Completed (XXmin)"
```

### Automatic Progress Report

At the end of each day, generate a progress report:

```bash
# Generate daily summary
echo "## Day X Summary - $(date)" >> work-log.md
echo "Tasks Completed: $(grep -c '✅' task.md)" >> work-log.md
echo "Time Spent: $(grep 'Actual Time' task.md | awk '{sum+=$3} END {print sum}')min" >> work-log.md
```

## 🎯 Task Completion Verification

**Every task completion MUST include:**

1. ✅ **Code Implementation** - All required files created/modified
2. 🧪 **Testing** - Verify the feature works
3. 📝 **Documentation** - Update relevant docs
4. 📋 **Progress Tracking** - Update task.md and work-log.md
5. 💾 **Git Commit** - Commit with descriptive message

**Example completion confirmation:**
```
=== TASK 1.1 COMPLETION REPORT ===
✅ Implementation: Complete
✅ Tests: Passing
✅ Docs: Updated
✅ Progress: Tracked
✅ Committed: task-1.1-complete

Next: Task 1.2 ready to start
==================================

---

## 🧩 Component Registry 시스템 가이드라인

### 🔄 프롬프트 전략 변경 (CRITICAL)

**Aether는 이제 Component Registry 기반으로 작동합니다.**

#### **절대 하지 말 것** ❌
- 컴포넌트 구조 직접 생성 (HTML/JSX 코드)
- 새로운 컴포넌트 타입 생성
- CSS/스타일 정의 생성
- 전체 JSON 컴포넌트 트리 생성

#### **반드시 할 것** ✅
- Registry에서 컴포넌트 ID 선택만
- Props와 Content만 생성
- 기존 componentId 사용
- 토큰 사용량 최소화

### 예시 변경

#### **이전 방식** (잘못됨 - 절대 사용 금지):
```json
{
  "components": {
    "root": {
      "type": "div",
      "className": "min-h-screen",
      "children": [
        {
          "id": "hero_1", 
          "type": "section",
          "className": "hero-section bg-gradient-to-r from-blue-600 to-purple-600",
          "children": [
            {
              "type": "div",
              "className": "container mx-auto px-4",
              "children": [...]
            }
          ]
        }
      ]
    }
  }
}
```

#### **현재 방식** (올바름 - 필수 사용):
```json
{
  "selections": [
    {
      "componentId": "hero-split",
      "props": {
        "title": "Transform Your Business with AI",
        "subtitle": "Get professional websites in 30 seconds",
        "ctaText": "Start Building",
        "imagePrompt": "Modern SaaS dashboard interface"
      }
    },
    {
      "componentId": "features-grid", 
      "props": {
        "title": "Why Choose Our Platform",
        "features": [
          {"title": "Lightning Fast", "description": "30-second generation"}
        ]
      }
    }
  ]
}
```

### 🎯 컴포넌트 선택 우선순위

1. **업종별 최적화**: SaaS → hero-split, E-commerce → hero-centered
2. **성능 점수**: Lighthouse 90+ 컴포넌트 우선
3. **사용 통계**: 가장 성공적인 컴포넌트 선택
4. **호환성**: 선택된 컴포넌트들이 잘 조합되는지 확인

### 📊 성능 목표 및 측정

- **토큰 사용량**: 500-2,000 (이전 대비 90% 절감)
- **생성 시간**: 10-15초 (이전 대비 66% 단축)  
- **품질 일관성**: 100% (사전 테스트된 컴포넌트)
- **사용자 만족도**: 95%+ (일관된 품질)

### ⚠️ 개발 시 주의사항

1. **기존 작업 보존**: Task 2.1-2.3의 LiteLLM 통합은 그대로 유지
2. **점진적 전환**: 기존 직접 생성 방식을 fallback으로 유지
3. **호환성**: Component Registry 도입 후에도 기존 사이트 편집 가능
4. **확장성**: 새 컴포넌트 추가가 쉬워야 함
```