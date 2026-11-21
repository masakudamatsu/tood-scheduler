# 0013: A pre-commit hook runs lint and the type check

- **Status:** accepted
- **Date:** 2026-11-21

## Context

CI runs `npm run verify` (lint, the type check and the tests) on every pull request, but its result takes minutes. A lint or type error is quick to find locally. See [.githooks/pre-commit](../../.githooks/pre-commit).

## Decision

A pre-commit hook runs lint and the type check before each commit. It doesn't run the tests: they're too slow for every commit, and CI runs them.

## Consequences

- Lint and type errors show up in seconds instead of minutes later on CI.
- Each commit takes about 5 seconds longer (measured on 2026-11-21).
- To skip it once: `git commit --no-verify`.

**Revisit if:** a commit takes more than 10 seconds.
