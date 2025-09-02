# GEMINI.md

## Project Overview

This project is a pnpm monorepo for "Aether", an AI-powered website builder that aims to create professional websites in 30 seconds. The project is built with Next.js for the frontend and has a sophisticated AI engine for code generation. The monorepo is structured with `apps` and `packages` directories, managed by pnpm workspaces and Turbo for efficient task running.

### Key Technologies

*   **Frontend:** Next.js, React, Tailwind CSS
*   **Backend:** Node.js, LiteLLM
*   **Monorepo:** pnpm, Turbo
*   **Deployment:** Vercel

### Architecture

The project is a monorepo with the following key packages:

*   `apps/web`: The main Next.js web application, which serves as the user interface for the website builder.
*   `packages/ai-engine`: The core of the AI functionality. It handles prompt engineering, model routing, response parsing, and validation. It uses LiteLLM to interact with different AI models.
*   `packages/component-registry`: A registry for UI components that can be used to build websites. It allows for searching and recommending components based on different criteria.
*   `packages/database`: Contains the database schema.
*   `packages/templates`: Contains templates for generating websites.
*   `packages/ui`: A shared UI library.

## Building and Running

### Prerequisites

*   Node.js (version specified in `.nvmrc` if available)
*   pnpm

### Installation

```bash
pnpm install
```

### Development

To start the development server, run:

```bash
pnpm dev
```

This will start the Next.js application in development mode.

### Building

To build the project for production, run:

```bash
pnpm build
```

This will build all the packages and applications in the monorepo.

### Testing

To run the tests, use the following commands:

*   Run all tests:
    ```bash
    pnpm test
    ```
*   Run unit tests:
    ```bash
    pnpm test:unit
    ```
*   Run end-to-end tests:
    ```bash
    pnpm test:e2e
    ```

## Development Conventions

### Linting

To lint the codebase, run:

```bash
pnpm lint
```

### Type Checking

To check for type errors, run:

```bash
pnpm typecheck
```

### Formatting

This project uses Prettier for code formatting. To format the code, run:

```bash
pnpm format
```

To check for formatting errors, run:

```bash
pnpm format:check
```

### Committing

This project follows the conventional commit specification. Please make sure your commit messages are in the correct format.
