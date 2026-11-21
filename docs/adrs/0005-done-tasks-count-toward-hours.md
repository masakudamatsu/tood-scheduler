# 0005: Done tasks still count toward a day's hours

- **Status:** accepted
- **Date:** 2026-11-03

## Context

Each day shows the total hours of its tasks, and a red border when the total is over the daily limit. When the user ticks a task as done, the total could either drop or stay the same. See `total` in [DaySection.tsx](../../src/components/DaySection.tsx).

## Decision

Done tasks still count. The hours show how much was planned for that day. Finishing a task doesn't make the day lighter.

## Consequences

- An overloaded day stays red after its tasks are done, so the user can look back and see they planned too much.
- The total doesn't show how much work is left for the day.

**Revisit if:** the user wants to see the hours left in a day, not the hours planned.
