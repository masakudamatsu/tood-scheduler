# 0015: A list connects each building block to its records

- **Status:** accepted
- **Date:** 2026-11-21

## Context

Agents had two problems. They couldn't see which parts the app already has, so they could write a new component or function that does the same job as an existing one. And decisions live in `docs/adrs/`, one record each (see [0014](0014-every-decision-gets-a-record.md)), but the records don't say which parts of the code they shape. So an agent changing `DaySection`, for example, couldn't tell that it should read the record on done tasks and hours first. This came up while putting the repo on autopilot (issue #48).

## Decision

[docs/primitives.md](../primitives.md) lists the app's building blocks, where each lives, and the records that shape it. Agents read it before every task. A pull request that adds or reshapes a building block, or adds or changes a record, updates the list in the same pull request.

## Consequences

- An agent can see what already exists before writing something new.
- Before changing a part, an agent can find the records it must read in one place.
- Records that shape no part of the code (for example [0010](0010-main-is-protected.md)) aren't in the list. Agents find them by listing `docs/adrs/`.
- One more file to keep up to date. If a pull request forgets it, the list goes stale and points to the wrong records.

**Revisit if:** the list often goes stale, or the app grows so many parts that the list stops being short.
