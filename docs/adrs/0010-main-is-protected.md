# 0010: `main` is protected

- **Status:** accepted
- **Date:** 2026-11-03

## Context

Claude works on GitHub issues by itself and pushes branches. Without a rule, a change could land on `main` without anyone looking at it. This is a setting on github.com, not in this repo.

## Decision

`main` is protected: every change must go through a pull request. Pushing straight to `main` fails.

## Consequences

- Masa reviews every change before it reaches `main`.
- Even a one-line fix needs a branch and a pull request.

**Revisit if:** Masa stops reviewing pull requests, or someone else starts working on the repo and needs different rules.
