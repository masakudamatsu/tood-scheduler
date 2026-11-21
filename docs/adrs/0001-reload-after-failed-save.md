# 0001: Reload everything after a failed save

- **Status:** accepted
- **Date:** 2026-11-03

## Context

The screen updates as soon as the user makes a change, and the save to the store happens after that. A save can fail, for example when the network drops. Then the screen and the store no longer match. See `save()` in [Scheduler.tsx](../../src/components/Scheduler.tsx).

## Decision

If a save fails, the app shows an error and reloads all tasks and the daily limit from the store. There's no undo for one change at a time.

## Consequences

- One person uses the app, so saves rarely fail. A reload is simple and always leaves the screen correct.
- The user loses the change that failed and has to make it again.

**Revisit if:** saves start failing often enough that losing the change annoys the user, or several people edit the same tasks.
