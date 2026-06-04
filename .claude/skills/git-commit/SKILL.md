# Git Commit Skill

Create commits with conventional-commits format, always waiting for approval.

## Workflow

1. **Inspect changes**: Run `git status` and `git diff --staged` to see what's ready to commit

2. **Compose message**: Write a conventional-commits message:
   - Subject line: `type: short description` (max ~50 chars)
   - Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`
   - Body: Add details/rationale only for non-trivial changes

3. **Show and wait**: Display the proposed commit:
   ```
   Proposed commit:
   ----------------
   <subject line>

   <body if any>
   ----------------
   Files to commit:
   - file1.ts
   - file2.md
   ```
   Then ask: "Approve this commit? (yes/no/edit)"

4. **Execute only on approval**: Do NOT run `git commit` until explicit approval

## Rules

- **No AI attribution**: Never add "Co-Authored-By: Claude", "Generated with Claude Code", or any AI-related text
- **Clear subjects**: Be specific about what changed
- **Short body**: Only when the diff needs explanation
