# 0016: Docs don't repeat what the code says

- **Status:** accepted
- **Date:** 2026-11-21

## Context

The first draft of [docs/primitives.md](../primitives.md) named the functions inside each file, such as the date helpers and the popup buttons. An agent can find those by reading the code, and each name is one more thing that goes out of date when the code changes. No rule in `CLAUDE.md` (now [AGENTS.md](../../AGENTS.md)) said to leave them out.

## Decision

Docs and the README don't write down what anyone can learn by reading the code. They hold what the code can't say: why, what we decided against, how to run things, and where to look.

Code comments are different: their job is to explain the code in plain words.

## Consequences

- Docs stay short, and fewer of them go out of date when the code changes.
- To learn the details, you have to open the code. Docs only point to where to look.

**Revisit if:** agents keep missing something that's in the code, and a line in the docs would have helped them find it.
