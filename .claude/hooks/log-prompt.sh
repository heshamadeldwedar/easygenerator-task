#!/bin/bash

# Prompt-capture hook for Claude Code
# Appends submitted prompts to AI.md with phase and timestamp

# Find repo root (where AI.md lives)
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
AI_FILE="$REPO_ROOT/AI.md"
PHASE_FILE="$REPO_ROOT/.claude/state/current-phase"

# Read hook JSON from stdin
INPUT=$(cat)

# Extract prompt using jq
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty')

# Exit if no prompt
if [ -z "$PROMPT" ]; then
    exit 0
fi

# Skip if prompt contains "don't record" (case-insensitive)
if echo "$PROMPT" | grep -qi "don't record"; then
    exit 0
fi

# Get current phase (default to 0)
PHASE="0"
if [ -f "$PHASE_FILE" ]; then
    PHASE=$(cat "$PHASE_FILE" | tr -d '[:space:]')
fi

# Get current timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

# Escape prompt for safe insertion (replace newlines, escape special chars)
ESCAPED_PROMPT=$(echo "$PROMPT" | sed 's/^/> /' | sed ':a;N;$!ba;s/\n/\n> /g')

# Append entry to AI.md
cat >> "$AI_FILE" << EOF

#### [Phase $PHASE] $TIMESTAMP

**Prompt**

$ESCAPED_PROMPT

**Outcome** — _to be written_

EOF
