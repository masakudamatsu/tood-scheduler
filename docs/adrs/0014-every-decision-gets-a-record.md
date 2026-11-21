# 0014: Every decision gets a record

- **Status:** accepted
- **Date:** 2026-11-21

## Context

Until now, decisions lived in one file, `docs/decisions.md`. Its rule said: don't add an entry if the code already says it, and if a short code comment can hold the reason, write the comment instead. So some reasons ended up only in code comments, like the pre-commit hook's "revisit if a commit takes more than 10 seconds". Those were hard to find, because you had to know which file to open. And the code shows *what* we chose, like a library, but rarely *why*.

## Decision

Every decision gets its own record in `docs/adrs/`, even when a code comment could hold the reason. A code comment can point to the record instead (see [.githooks/pre-commit](../../.githooks/pre-commit)).

## Consequences

- One place to look: listing `docs/adrs/` shows every decision, each with a Revisit if line.
- Code comments stay short.
- More files to write and keep up to date. When the code changes a decision, its record has to be updated or superseded too.

**Revisit if:** `docs/adrs/` grows so long that reading the list before each task gets slow, or records pile up for choices nobody would ask "why?" about.
