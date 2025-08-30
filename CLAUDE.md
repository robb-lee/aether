# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aether** is an AI-powered website builder that creates professional websites in 30 seconds. The project aims to enable AI to generate complete websites from text prompts, with instant deployment to production and visual drag-and-drop editing capabilities.

**Core Value Proposition:**
- **30-second generation**: From text prompt to live website
- **AI-first approach**: GPT-4 for structure, Claude-3 for content, DALL-E for images
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

When asked to execute a task, follow this pattern:

1. **Read the task details** from task.md
2. **Mark task as in progress** in task.md
3. **Execute the task** according to specifications
4. **Test the implementation** to verify it works
5. **Update task status** to completed in task.md
6. **Update work-log.md** with completion details
7. **Commit changes** with descriptive message

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
  web/                 # Main Next.js 14 application
  preview/             # Dynamic site preview server
packages/
  ui/                  # Shared React components
  ai-engine/           # AI integration (GPT-4, Claude, DALL-E)
  editor-core/         # Visual editor logic
  templates/           # Site templates
  database/            # Supabase schema and types
```

### Key Technical Decisions

**Frontend Stack:**
- Next.js 14 with App Router (Server Components for performance)
- React 18 with Suspense boundaries
- Tailwind CSS with custom design system
- Framer Motion for animations
- Zustand + Immer for state management

**Backend Stack:**
- Vercel Edge Runtime (eliminates cold starts)
- Supabase (PostgreSQL with Row Level Security)
- Redis for AI response caching

**AI Integration:**
- GPT-4-turbo for structure generation
- Claude-3-haiku for content optimization
- DALL-E 3 for image generation
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

1. **Structure Generation** (GPT-4): Creates site architecture
2. **Content Generation** (Claude-3): Writes optimized copy
3. **Design Generation** (GPT-4): Applies styling and themes
4. **Image Generation** (DALL-E): Creates visual assets

Prompt templates are stored in `packages/ai-engine/prompts/` and documented in `prompt.md`.

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
1. Create component in `packages/ui/components/`
2. Add to component registry in `packages/editor-core/registry/`
3. Create preview renderer in `apps/preview/components/`
4. Add to template system if reusable

### Modifying AI Prompts
1. Update prompt template in `packages/ai-engine/prompts/`
2. Test with `pnpm ai:test`
3. Validate output format with `pnpm ai:validate`
4. Update cost tracking if token usage changes

### Creating a New Template
1. Design template structure in `packages/templates/[category]/`
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

# Commit with standard message
git add . && git commit -m "Task 1.1: Project initialization - Completed (25min)"
```

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
```