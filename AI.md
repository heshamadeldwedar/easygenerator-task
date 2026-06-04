# AI Assistance Log

> This file is maintained automatically (prompts captured by a hook) and enriched by hand as the project progresses.

## The Journey

This project follows a 6-phase plan. Here's how we're building this auth module, step by step:

- **Phase 0** — Foundation: repo scaffold, docs, hooks, commit skill
- **Phase 1** — Frontend: Vite + React + TypeScript, routing, forms, pages
- **Phase 2** — Backend: NestJS + MongoDB, auth endpoints, JWT
- **Phase 3** — Dockerization: Dockerfiles + docker-compose
- **Phase 4** — Bonus: logging, tests, Swagger, CI
- **Phase 5** — Finish: polish, finalize docs, push to GitHub

Each phase below tells its story — what I asked, what Claude did, and what I changed.

---

## Phase 0 — Foundation

### 2024-06-04

**Prompt**

> Set up Phase 0 foundation — repo skeleton with frontend/ and backend/ placeholders, comprehensive .gitignore, README with TOC and collapsible sections, AI.md as a story, prompt-capture hook that skips "don't record" prompts, git-commit skill for approval-based commits, and CLAUDE.md with project rules.

**Outcome**

Claude created the complete foundation:
- `frontend/` and `backend/` directories with `.gitkeep` files
- Downloaded tech logos (React, TypeScript, NestJS, MongoDB, Docker, Vite) to `assets/`
- `.gitignore` covering Node.js, Vite, NestJS, env files, logs, OS/editor files
- `README.md` with table of contents, tech logos, and collapsible sections
- This `AI.md` file structured as a narrative
- Prompt-capture hook at `.claude/hooks/log-prompt.sh`
- Phase state tracker at `.claude/state/current-phase`
- Commit skill at `.claude/skills/git-commit/SKILL.md`
- `CLAUDE.md` with standing project rules

---

## Phase 1 — Frontend

### 2026-06-04

**Prompt**

> Build the frontend auth module in `/frontend`: Vite + React + TypeScript, styled with Tailwind CSS v4. Match the exported designs from Claude Design in `/frontend/design-reference/`. Include sign up, sign in, and welcome pages with proper validation, auth context, API layer with interceptors, and a global loading bar.

**Outcome**

Claude built the complete frontend auth module:

**Scaffolding & Setup**
- Scaffolded Vite + React + TypeScript app while preserving `design-reference/`
- Pinned Node LTS (v24.16.0) in `.nvmrc`
- Installed dependencies: react-router-dom, react-hook-form, zod, @hookform/resolvers, axios, tailwindcss, @tailwindcss/vite

**Tailwind v4 CSS-First Setup**
- Used `@tailwindcss/vite` plugin — no PostCSS config, no `tailwind.config.js`
- Mapped all Coursely design tokens into `@theme` block with **rem-based units** for accessibility (px values divided by 16)
- `px` used only for hairline borders, focus rings, and fixed visual details (loading bar height)
- Theme labeled as "Light Theme" with comments for future dark mode extension

**Components Built**
- `Button` — primary/secondary variants with shadow-pop effect
- `Input` — with label, error states, trailing slot, accessibility (aria-describedby)
- `PasswordInput` — show/hide toggle with eye icons
- `PasswordChecklist` — live password requirements (8+ chars, letter, number, special char)
- `Card`, `Wordmark`, `Header`, `AuthShapes` — design system components
- `TopLoadingBar` — global API loading indicator

**Auth Infrastructure**
- `AuthContext` with localStorage persistence (commented the XSS tradeoff vs httpOnly cookies)
- Axios client with request/response interceptors:
  - Attaches Bearer token from localStorage
  - Increments/decrements loading counter
  - Auto-logout on 401 Unauthorized
- Module-level `loadingStore` — bridges axios (non-React) to React via subscribe pattern

**Global Loading Bar**
- Request counter (not boolean) handles concurrent requests correctly
- Anti-flicker: only shows after 150ms delay, stays visible for min 300ms
- Smooth animation: creeps to ~90%, snaps to 100% on completion
- Accessible: `role="progressbar"`, `aria-busy`, `pointer-events: none`
- Built with Tailwind utilities (considered NProgress but custom bar is cleaner and on-brand)

**Pages & Routes**
- `/signup` — Sign Up with live password checklist
- `/signin` — Sign In with show/hide toggle, invalid credentials error
- `/dashboard` — Protected welcome page with header + logout
- `/` redirects to `/signin`, unknown routes redirect to `/signin`
- `ProtectedRoute` wrapper redirects to `/signin` when not authenticated

**Quality**
- TypeScript strict mode
- Path aliases (`@/` → `src/`) in vite.config.ts and tsconfig.app.json
- Environment variables: `.env.example` and `.env` with `VITE_API_BASE_URL`
- Type definitions in `env.d.ts` for `ImportMetaEnv`
- Accessible: labeled inputs, aria-describedby on errors, focus-visible states
- Responsive: mobile-first with breakpoints at 560px (sm) and 680px (md)
- Build verified: `npm run build` and `npm run dev` both succeed

---

## Phase 2 — Backend

*Coming soon...*

---

## Phase 3 — Dockerization

*Coming soon...*

---

## Phase 4 — Bonus & Hardening

*Coming soon...*

---

## Phase 5 — Finish

*Coming soon...*
