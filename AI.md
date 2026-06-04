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

### 2026-06-04 (Fix Pass)

**Prompt**

> PHASE 1 — fixes. The frontend is built but needs corrections. Work against the files in /frontend/design-reference/ as the source of truth. Fix: decorative geometric shapes, input/form states from sates.html, dead assets/tab title/favicon, and extract inline SVGs to assets with vite-plugin-svgr.

**Outcome**

Claude made the following corrections:

**Design Fidelity**
- Replaced simple blurred blobs with geometric shapes matching coursely-components.css
- Added gradient blobs (coral, violet) and accent circles (teal, coral)
- Added responsive scaling (0.7x on mobile via max-sm:scale-[0.7])

**Input States**
- Fixed focus state conflict: error inputs now keep red border on focus
- Error focus ring uses error-bg (#FDECEC) instead of coral-100
- Verified all states match coursely-components.css spec

**Branding**
- Renamed package.json name to "coursely"
- Updated index.html title to "Coursely"
- Created Coursely favicon (coral rounded square, white ring, teal dot)

**SVG Extraction**
- Installed vite-plugin-svgr for typed React component imports
- Created src/assets/icons/ with error-circle.svg, eye.svg, eye-off.svg
- Added TypeScript declaration for *.svg?react imports in env.d.ts
- Updated Input.tsx and PasswordInput.tsx to import icons instead of inline SVGs

### 2026-06-04 (Diagnosis Pass)

**Prompt**

> Diagnose two visual bugs against the design reference — (1) decorative shapes rendering as blurry blobs instead of crisp geometric shapes, and (2) input error states showing coral/orange border on focus instead of red. Report root causes and proposed fixes; do not modify any code yet.

**Outcome** *(diagnosis only — no code changes)*

**Issue 1: Shapes are blobs, not geometric shapes**

- **Root cause:** `AuthShapes.tsx` was built with CSS gradient blobs using `blur-2xl`, `bg-gradient-to-br`, and organic `rounded-[40%_60%_...]` shapes instead of the crisp geometric shapes specified in the design reference (quarter-circles, ring outlines, triangles, dot clusters).
- **Evidence:** Every shape div in `AuthShapes.tsx` includes `blur-*` classes and gradient fills. The design reference `.cl-shape` class expects absolutely-positioned elements with solid colors, borders, and clip-paths — no blur.
- **Proposed fix:** Rewrite `AuthShapes.tsx` with actual geometric shapes: semi-circles via `clip-path`, ring outlines via `border` (no fill), triangles via SVG or `clip-path: polygon()`, dot clusters via multiple small circles. Remove all `blur-*` and gradient classes.

**Issue 2: Error border turns coral on focus**

- **Root cause:** The Tailwind flat utility approach lacks the CSS specificity of the design reference. In `coursely-components.css`, `.cl-field.is-error .cl-input` (2 classes) beats `.cl-input:focus` (1 class), so error border persists on focus. In the current implementation, `focus:border-error` competes with other utilities at the same specificity level, and Tailwind's generated CSS ordering may not guarantee the error color wins.
- **Evidence:** `Input.tsx` line 38 uses `${error ? 'border-error focus:border-error ...' : 'focus:border-coral-500 ...'}`. Despite including `focus:border-error`, the user observes coral borders on focused error fields.
- **Proposed fix:** Either (a) wrap inputs in a container with an `is-error` class and use `group-*` variants for higher specificity, or (b) remove `focus:border-*` from the error branch entirely — let the base `border-error` persist since `focus:border-coral-500` only appears in the else branch.

**Status:** Diagnosis complete. Awaiting approval before implementing fixes.

### 2026-06-04 (Fix Pass #2)

**Prompt**

> Implement the fixes for both diagnosed issues.

**Outcome**

**Issue 1 fix — AuthShapes.tsx rewritten with crisp geometric shapes:**
- Coral semi-circle (top-left) using `clip-path: inset()`
- Coral ring outline (top-left of center) using `border` + `rounded-full`
- Rotated rounded-square outline (top-right) using `border` + `rotate(15deg)`
- Small teal dot cluster (top-right) using nested flex containers
- Teal ring (right side) using `border` + `rounded-full`
- Small violet circle (right, below center)
- Violet triangle (bottom-right) using inline SVG `<polygon>`
- Coral dot cluster (bottom-left) using multiple `rounded-full` circles
- Small teal circle (mid-left)
- Small rotated square outline (bottom-left) using `border` + `rotate(-12deg)`
- Coral quarter-circle (bottom-right corner) using `clip-path`
- Teal semi-circle (bottom-left corner) using `clip-path`
- All `blur-*` and gradient classes removed — shapes are now crisp

**Issue 2 fix — Input.tsx error border now persists on focus:**
- Changed from `border-error focus:border-error` to `!border-error` (important modifier)
- The `!` ensures error border wins over `hover:border-border-strong` and any focus states
- Focus ring still uses `focus:ring-error-bg` for light red ring on error

Build verified: `npm run build` succeeds.

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
