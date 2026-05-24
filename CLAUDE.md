# Wedding Photography Website — Claude Code Rules

## Project
Premium wedding photography website inspired by caroweiss.com. Built with Next.js 14 (App Router), Tailwind CSS, shadcn/ui, PostgreSQL, Prisma ORM. Single repo — Next.js handles both frontend and API routes. No separate backend server.

## Stack
- **Framework**: Next.js 14 App Router (TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js (admin only)
- **Storage**: Cloudinary (photo uploads)
- **Email**: Resend
- **Deployment**: Vercel + Supabase (Postgres)

## Project Structure
```
/app
  /(site)          ← public-facing pages
    /page.tsx      ← home
    /portfolio/
    /about/
    /journal/
    /investment/
    /contact/
  /(admin)         ← protected admin routes
    /dashboard/
    /galleries/
    /stories/
    /inquiries/
  /api/            ← Next.js route handlers
/components
  /ui/             ← shadcn primitives
  /site/           ← public page components
  /admin/          ← admin UI components
  /shared/         ← used in both
/lib
  /prisma.ts       ← prisma client singleton
  /auth.ts         ← nextauth config
  /cloudinary.ts   ← upload helpers
  /utils.ts
/prisma
  /schema.prisma
  /seed.ts
```

## Code Rules (read before every response)
1. **One file per response** unless explicitly asked for multiple.
2. **No explanations** — only code and inline comments where non-obvious.
3. **No placeholder comments** like `// TODO` or `// add logic here`.
4. **Minimal imports** — no unused imports, no barrel re-exports unless they already exist.
5. **Server Components by default** — add `"use client"` only when needed (event handlers, hooks, browser APIs).
6. **API routes** live in `app/api/[resource]/route.ts`. Keep handlers thin; logic goes in `/lib` or `/services`.
7. **Prisma** — always use the singleton from `lib/prisma.ts`. Never instantiate `new PrismaClient()` inline.
8. **Images** — always use `next/image` with explicit `width`/`height` or `fill`. Never raw `<img>`.
9. **Env vars** — access only via a typed `lib/env.ts` that throws on missing values.
10. **Error handling** — API routes return `{ error: string }` with correct HTTP status. No unhandled promise rejections.
11. **No duplicate code** — check existing components before creating new ones.
12. **Tailwind only** — no inline styles, no CSS modules, no styled-components.
13. **Type everything** — no `any`. Define types in the same file or `types/` folder if shared.
14. **SEO** — every page exports a `generateMetadata` function.
15. **Commits** — not your job. Don't suggest git commands unless asked.

## Naming Conventions
- Files/folders: `kebab-case`
- Components: `PascalCase`
- Functions/vars: `camelCase`
- DB models: `PascalCase` (Prisma convention)
- Env vars: `SCREAMING_SNAKE_CASE`

## Response Format
```
FILE: path/to/file.ts
---
<full file content>
```
Always output the complete file. No truncation with "rest stays the same".

## Performance Targets
- LCP < 2.5s, CLS < 0.1, FID < 100ms
- Images served via Cloudinary CDN with auto format/quality
- Static pages where possible; ISR for gallery/journal pages (revalidate: 60)
- Font: next/font with display: swap

## DO NOT
- Do not install packages without being asked
- Do not modify `prisma/schema.prisma` unless the task explicitly requires it
- Do not touch files not mentioned in the task
- Do not wrap every component in a `<div>` — use semantic HTML
- Do not add animations unless the task mentions them
