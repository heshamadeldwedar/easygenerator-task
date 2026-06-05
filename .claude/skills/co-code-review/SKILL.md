---
name: co-code-review
description: >
  Collaborative code review skill. Triggers on: "review this code", "co-review",
  "code review", "check my code quality", "review my code", "pair review".
---

# Co-Code-Review Skill

A collaborative, interactive code review — like a senior engineer pairing with you. Not a one-shot report dump; we work through findings together. Code is held to a senior bar: spotless, simple, no shortcuts.

## 1. Intake — always ask first

Before reviewing anything, ask these two questions and **wait for answers**:

1. **What kind of review?**
   - `Full review` — review all relevant files in scope.
   - `Latest changes only` — review what changed. Use `git diff` (uncommitted), or ask which branch/commit range to diff against (e.g. `git diff main...HEAD`). Review only the changed hunks plus the code they directly touch.

2. **What scope?**
   - `Whole project`, or
   - `A specific folder/file` — let the user give a path.

**Do not start until you have both answers.**

## 2. Auto-detect the stack

Read `package.json` / config files to detect the stack, then load the matching ruleset below. If it's something else, tell the user and use the generic rules only. If you have web access and you're unsure about a current best practice, you may quickly verify it online — but don't block the review on it.

## 3. Review dimensions (apply to every file)

Score each finding under one of these four. Every finding needs: **file:line → what's wrong → why it matters → concrete fix**.

### Dimension 1: Code quality & simplicity

- No magic values. **Any** raw number or string used as a meaningful value must be a named constant, enum, or config — no exceptions. Flag every one.
- Functions do one thing. Flag long functions, deep nesting (>2-3 levels), and high cyclomatic complexity.
- Clear, intention-revealing names. No `data`, `temp`, `handle2`, etc.
- No dead code, commented-out blocks, unused imports/vars, or leftover `console.log`/debug.
- No duplication — extract shared logic.
- Prefer early returns over nested `if/else`.
- Proper typing (no `any` unless justified and commented).
- Errors handled explicitly; no silently swallowed catches.

### Dimension 2: Performance

- No N+1 queries; batch/join instead. Watch for queries inside loops.
- Indexes implied by query patterns; bounded result sets (pagination, date ranges) instead of unbounded reads.
- No unnecessary work in hot paths; cache where it clearly helps.
- Async used correctly — no accidental sequential `await` in a loop that could be `Promise.all`.
- No memory leaks (unclosed connections, growing in-memory maps, leftover listeners/timers).

### Dimension 3: Security

- All external input validated and sanitized (DTOs/schemas at boundaries).
- No injection (SQL/NoSQL/command/HTML). Flag any string-built query or unescaped output.
- No secrets, tokens, or credentials in code; they come from env/config.
- AuthN/AuthZ enforced on every protected route/action — no missing guards.
- No sensitive data in logs or error responses.
- Safe error handling — don't leak stack traces or internals to clients.

### Dimension 4: Consistency

- Matches the patterns already used in this codebase (folder layout, naming, error shape, response shape, logging).
- Same approach for the same problem everywhere — don't introduce a second way of doing an existing thing.
- Consistent formatting/lint rules; consistent import ordering and module boundaries.

## 4. Stack-specific rules

### If NestJS (backend)

**Architecture & Patterns**
- **Modular by feature, not by layer.** Each feature is a module owning its controllers, services, repositories, DTOs, entities. No tight coupling between modules; communicate through clear service boundaries.
- **Repository pattern for data access.** Services should NOT inject Mongoose models directly. Use a dedicated repository class (`*.repository.ts`) that encapsulates all database operations. This separates data access from business logic, improves testability, and allows swapping data sources.
  ```
  Controller → Service (business logic) → Repository (data access) → Model
  ```
- **Thin controllers, fat services.** Controllers only handle HTTP and delegate; business logic lives in services. No DB/business logic in controllers.
- **Dependency injection everywhere.** No manual `new` for things that should be injected; keep providers loosely coupled and testable.
- **Types in dedicated folder.** Put interfaces and types in `<module>/types/*.types.ts`, not inline in service files.

**Validation & Security**
- **Validation via DTOs + `class-validator` + global `ValidationPipe`** (`whitelist: true`, `forbidNonWhitelisted: true`). No unvalidated request bodies/params/queries.
- **Guards for authz, interceptors for cross-cutting concerns, pipes for transform/validation, filters for exceptions** — use the right primitive, don't reimplement them inline.
- **Centralized exception handling** with a global filter; consistent error response shape; use Nest's built-in HTTP exceptions.

**Configuration**
- **Config via `ConfigModule`/typed config**, never `process.env.X` scattered through the code, never hardcoded values.
- Use `configService.getOrThrow()` for required values — no fallback defaults that hide missing config.

**Data Layer**
- **DB:** explicit transactions where multiple writes must be atomic; no N+1 (use proper joins/`relations`/`populate`); pagination on list endpoints; sensible indexes.
- **Async messaging / queues (Bull/RabbitMQ) for slow or background work**, not inline in the request path.

**Testing**
- **Testability:** services should be unit-testable with mocked providers.
- Repositories enable clean mocking — mock the repository, not the database.

### If React + Vite + Tailwind (frontend)

- **Function components + hooks only.** Follow the rules of hooks. Extract custom hooks for reused logic.
- **Component responsibility is single and clear.** Split large components; lift state only as far as needed; avoid prop-drilling (context or composition where it helps).
- **Performance:** route-based code splitting with lazy loading; `memo`/`useMemo`/`useCallback` only where there's a real re-render cost (don't over-memoize); stable keys in lists (never index when items reorder); avoid creating new objects/functions inline in hot render paths.
- **State management fits the need** — local state for local concerns, a store only when genuinely shared; no overuse of global state.
- **Data fetching:** loading/error/empty states handled; no waterfalls; cancel/cleanup effects; correct dependency arrays.
- **Tailwind:** utility-first, but extract repeated class strings into components or shared constants instead of copy-pasting long class lists. No magic inline style values that should be theme tokens. Keep `tailwind.config` content paths correct so unused CSS is purged. Use design tokens (theme spacing/colors) over arbitrary `[...]` values unless justified.
- **Vite:** sensible `manualChunks`/splitting for large vendors; env via `import.meta.env` (typed), never hardcoded; assets handled through Vite, not hardcoded paths.
- **Accessibility basics:** semantic elements, labels on inputs, keyboard focus not broken.
- **TypeScript:** typed props, no `any`, discriminated unions for variant props.

#### Atomic Design (React)

When reviewing frontend React code, check adherence to the project's atomic-design structure:

- **Tier placement**: Components live in the correct tier:
  - `atoms/` — primitives (Button, Input, Label, Icon, Avatar)
  - `molecules/` — small compositions (FormField, PasswordChecklist, MenuItem)
  - `organisms/` — composed sections (forms, AppHeader, AccountMenu)
  - `layouts/` — page-level scaffolds

  Flag a component in the wrong tier (e.g., a composed form in atoms).

- **Import direction**: Dependencies only flow **upward**. Atoms must not import molecules/organisms/layouts; molecules must not import organisms/layouts. Flag any downward or lateral import that breaks the hierarchy, and flag circular imports.

- **Single responsibility / dumb lower tiers**: Atoms and molecules stay presentational and reusable — no feature-specific logic, no data fetching, no auth/business logic baked in. Feature logic belongs in `features/`, not in shared UI tiers.

- **No duplication across tiers**: Flag reimplemented primitives (e.g., a one-off styled input inside an organism instead of reusing the Input atom / FormField molecule).

- **Hybrid boundary**: Shared, reusable UI goes in atomic tiers; feature-bound composition stays under the feature folder. Flag shared primitives buried inside a feature, or feature logic leaking into shared tiers.

- **Consistency**: Components use design tokens / Tailwind theme rather than hardcoded values; new components follow established tier + naming conventions.

When flagging, name the specific tier-rule violated and suggest the correct placement/fix.

### If generic / other stack

Apply the four dimensions plus: SOLID, DRY, clear module boundaries, no magic values, explicit error handling.

## 5. How to run the review

Work through the in-scope files in logical order.

**Don't fix anything silently.** Present findings in small, digestible batches grouped by file or by dimension.

For each finding use this format:

```
[SEVERITY] file/path.ts:42  (dimension)
Problem: <one line>
Why: <why it matters>
Fix: <concrete suggested change, with a short code snippet if useful>
```

Severity levels:
- `BLOCKER` — Must fix before shipping
- `MAJOR` — Should fix, real impact
- `MINOR` — Worth fixing, low impact
- `NIT` — Style/preference, optional

After each batch, pause and ask: **which findings do you want to fix now, discuss, or skip?** Let the user drive. Only edit files after explicit approval.

Be honest and direct — push back if something is wrong, but explain plainly (keep explanations simple and clear).

**End with a summary:** counts by severity + dimension, and the top 3 things worth fixing first.
