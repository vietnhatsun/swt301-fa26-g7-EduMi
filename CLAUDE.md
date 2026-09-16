# CLAUDE.md - Project Guidelines for HIPZI

## Development Commands
- `npm run dev`: Start Next.js development server
- `npm run build`: Build production bundle
- `npm run lint`: Run ESLint checks
- `npm test`: Run unit tests with Vitest

## Architecture Standards
- **Framework**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Directory Structure**:
  - `src/app`: Page routes, layouts, API endpoints
  - `src/components`: UI components (Shared UI, layout components)
  - `src/config`: App constants, site config, environment specs
  - `src/hooks`: Custom React client hooks
  - `src/lib`: Utilities, helper functions, client SDK instances (`cn` helper)
  - `src/server`: Server Actions, server services, DB models
  - `src/types`: TypeScript interfaces & type definitions

## Code Style & Formatting
- Use TypeScript strictly; avoid using `any`.
- Keep components small, modular, and typed.
- Server-side functions should be located in `src/server/` or marked with `'use server'`.
- Client interactive logic should be marked with `'use client'`.
