# Repository Guidelines

## Project Structure & Module Organization
- apps/web: Next.js app (App Router) and API routes.
- packages/ai-engine: AI generation pipeline (Vitest tests, TypeScript libs).
- packages/component-registry: Component metadata, loaders, preview, and tests.
- packages/templates: Ready-made site templates used by the AI engine.
- packages/ui: Shared UI primitives and utils.
- packages/database/schema.sql: Database schema source of truth.
- scripts/: Utility scripts (task management, progress updates).
- Root config: `.eslintrc.json`, `.prettierrc`, `turbo.json`, `pnpm-workspace.yaml`, `tsconfig.json`.

## Build, Test, and Development Commands
- Install: `pnpm install`
- Dev (all): `pnpm dev` (loads `.env.local`, runs Turbo across workspaces)
- Dev (one package): `pnpm -F @aether/web dev`
- Build: `pnpm build`
- Lint: `pnpm lint`  | Typecheck: `pnpm typecheck`
- Test (all): `pnpm test`
- Test (package): `pnpm -F @aether/ai-engine test`
- Format: `pnpm format` | Check: `pnpm format:check`
- Deploy (Vercel): `pnpm deploy` (prod) / `pnpm deploy:preview`

## Coding Style & Naming Conventions
- Prettier: 2 spaces, single quotes, no semicolons, width 100, trailing commas (es5).
- ESLint: Next + Prettier; TS rules enabled; unused args may start with `_`.
- Files: React components `PascalCase.tsx`; hooks `useX.ts`; utilities `camelCase.ts`.
- Next.js routes: folder-based, lowercase segments (e.g., `app/(dashboard)/sites/page.tsx`).
- Types/interfaces: `PascalCase`; constants: `SCREAMING_SNAKE_CASE`.

## Testing Guidelines
- Framework: Vitest (unit-first). Locations: `packages/*/{test,__tests__}/**/*.{ts,tsx}`.
- Run all: `pnpm test`; coverage example: `pnpm -F @aether/ai-engine test:coverage`.
- Mock external services (OpenAI, Supabase, Upstash Redis). Avoid network calls in tests.
- Add/adjust tests for new logic and public APIs; keep assertions specific.

## Commit & Pull Request Guidelines
- Commits: imperative, concise; prefer prefixes (`feat:`, `fix:`, `chore:`) and include scope or task (e.g., `Task 3.2`, `ai-engine:`).
- PRs must pass `pnpm lint && pnpm typecheck && pnpm test`.
- PR description: what/why, affected packages, migration notes (env/schema), and screenshots for UI.
- Link issues/tasks; update docs when behavior or APIs change.

## Security & Configuration
- Configure secrets in `.env.local` (see `.env.local.example`). Do not commit secrets.
- Local dev loads env via `pnpm dev` (`dotenv -e .env.local`).
- Review `vercel.json` (root and `apps/web/`) for deploy/runtime constraints.

