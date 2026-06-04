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

### 2026-06-04

**Prompt**

> Build the NestJS backend auth API in /backend with Fastify adapter, MongoDB/Mongoose, JWT access tokens + rotating refresh tokens in httpOnly cookies, and PBAC. Follow the detailed spec including: response envelope, request ID tracing, validation mirroring frontend Zod schemas, and class-validator for env validation.

**Outcome**

Claude built the complete backend auth API:

**Architecture Decisions**

- **Fastify adapter** (not Express) — better performance, native async support, cleaner plugin system
- **Response envelope pattern** — all responses wrapped in `{ success, data, requestId }` via global interceptor; errors wrapped in `{ success: false, error: {...}, requestId }` via global exception filter
- **API versioning** — global prefix `/api/v{major}` read dynamically from package.json (e.g., `/api/v1/auth/signup`)
- **Request tracing** — middleware honors inbound `X-Request-Id` or generates ULID; included in response body, header, and all log lines

**Project Structure**

```
backend/
├── src/
│   ├── main.ts                  # Fastify bootstrap + plugins
│   ├── app.module.ts            # Root module with global guards
│   ├── config/
│   │   └── env.validation.ts    # class-validator env schema
│   ├── common/
│   │   ├── middleware/          # request-id.middleware.ts
│   │   ├── interceptors/        # response + logging
│   │   ├── filters/             # all-exceptions.filter.ts
│   │   ├── decorators/          # @CurrentUser, @RequirePermissions, @Public
│   │   ├── guards/              # jwt-auth.guard.ts, permissions.guard.ts
│   │   └── constants/           # permissions.ts (PBAC)
│   ├── users/                   # User schema + service
│   └── auth/                    # Controller, service, DTOs, JWT strategy
└── test/                        # E2E tests (mongodb-memory-server)
```

**Authentication Model**

- **Access token** — JWT signed with `JWT_ACCESS_SECRET`, 15m expiry, payload: `{ sub, email, permissions[] }`
- **Refresh token** — opaque random string (64 hex chars), hashed with SHA-256 before storage, 7d expiry, delivered only via httpOnly cookie (`secure` in prod, `sameSite: lax`)
- **Token rotation** — on `/auth/refresh`, old token revoked, new token issued in same family; if a revoked token is reused, entire family revoked (theft detection)

**PBAC (Permission-Based Access Control)**

- Permissions stored in JWT claim and user document
- `@RequirePermissions('user:read:self')` decorator + `PermissionsGuard`
- Default permission on signup: `user:read:self`
- Single permission demonstrates the pattern; documented scaling path to CASL/ABAC for complex scenarios

**Endpoints**

| Endpoint | Method | Auth | Response |
|----------|--------|------|----------|
| `/api/v1/auth/signup` | POST | Public | 201 `{ user, accessToken }` + Set-Cookie |
| `/api/v1/auth/signin` | POST | Public | 200 `{ user, accessToken }` + Set-Cookie |
| `/api/v1/auth/refresh` | POST | Public | 200 `{ accessToken }` + rotated cookie |
| `/api/v1/auth/logout` | POST | Public | 200 + clear cookie |
| `/api/v1/auth/me` | GET | JWT + perm | 200 `{ user }` |

**Security Decisions**

- **No user enumeration** — signin returns generic "Invalid credentials" for both wrong email and wrong password
- **Password hashing** — bcrypt with configurable rounds (default 12)
- **Validation** — class-validator DTOs mirror frontend Zod schemas exactly (email, name min 3, password min 8 + letter + number + special char)
- **Environment validation** — fails fast at boot if required vars missing or invalid

**Technical Highlights**

- Mongoose schemas with `toJSON` transform (drops `password`, `__v`; maps `_id` → `id`)
- Pre-save hook for password hashing (only when modified)
- TTL index on refresh tokens for auto-cleanup
- Swagger UI at `/api/v1/docs` with full API documentation
- Logging interceptor with method, URL, status, duration, requestId

**Frontend Compatibility Note**

The response envelope (`{ success, data, requestId }`) differs from what the frontend currently expects (`{ user, accessToken }`). Frontend will need updating in a future phase to unwrap `response.data.data` instead of `response.data`.

**Build Status**

- `npm run build` succeeds
- E2E tests scaffolded with mongodb-memory-server (require test-time config adjustments to run)

---

## Phase 3 — Dockerization

### 2026-06-04

**Prompt**

> Wire the whole stack together to run locally with Docker Compose — frontend, backend, and MongoDB. Create dev Dockerfiles (with bind mounts and in-container node_modules) and production Dockerfiles (multi-stage, optimized). Only ship a dev compose file; production images run directly.

**Outcome**

Claude created the complete Docker infrastructure:

**Dev vs Prod Dockerfile Split**

Each app has two Dockerfiles:
- `Dockerfile.dev` — Development with hot reload (NestJS `--watch`, Vite HMR)
- `Dockerfile` — Production multi-stage build

**In-Container node_modules Model**

The dev setup uses a key pattern to avoid host/container architecture mismatches:

```yaml
volumes:
  - ./backend:/app           # Bind mount for live editing
  - /app/node_modules        # Anonymous volume shadows host's node_modules
```

**Why this matters:**
- Native modules like **bcrypt** compile platform-specific binaries (Linux in container, macOS/Windows on host)
- Vite's **esbuild/rollup** also have native binaries
- With anonymous volume, `npm ci` runs inside the container, building native modules for Linux
- Host source is live-mounted for editing, but container uses its own node_modules
- Result: `docker compose up --build` works without any host `npm install`

**Service-Name vs Host-Port Wiring**

Docker networking requires different URLs for different contexts:
- **Service-to-service** (backend → mongo): Use Docker service names (`mongodb://mongo:27017/coursely`)
- **Browser-origin** (frontend-in-browser → backend): Use host-published ports (`http://localhost:3000`) since the browser is outside Docker

This is configured in compose environment variables with comments explaining why.

**Production Dockerfiles**

**Backend:**
- Stage 1: Install deps + `nest build`
- Stage 2: `node:24-alpine`, production deps only (`npm ci --omit=dev`), copy dist
- Runs as non-root user (`nestjs:nodejs`)
- CMD: `node dist/main`

**Frontend:**
- Stage 1: Install deps + `vite build`
- Stage 2: `nginx:alpine` serving static `/dist`
- Custom `nginx.conf` with SPA history-API fallback (all routes → `index.html`)
- Security headers, gzip, cache control for assets

**No Production Compose**

Production images are built/run directly without compose:
```bash
docker build -f backend/Dockerfile -t coursely-backend ./backend
docker run -p 3000:3000 --env-file .env coursely-backend
```

This keeps the deployment model simple and explicit.

**Additional Changes**

- Added `/api/v1/health` endpoint (public, for compose healthcheck)
- Backend healthcheck in compose uses `wget` to hit `/health`
- MongoDB healthcheck with `mongosh --eval "db.adminCommand('ping')"`
- Backend `depends_on: mongo` with `condition: service_healthy`
- Created `.dockerignore` files excluding node_modules, dist, .env, tests, .git
- Updated `.env.example` files with Docker-specific notes
- Updated README with Docker architecture diagram, commands, and env var tables

---

## Phase 4 — Bonus & Hardening

*Coming soon...*

---

## Phase 5 — Finish

*Coming soon...*
