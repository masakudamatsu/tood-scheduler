# 0006: A copy of the card follows the pointer when dragging

- **Status:** accepted
- **Date:** 2026-11-03

## Context

The user drags a task card to another day to change its date. Without extra work, the card moves inside its own day's section, and it could slide underneath other days on screen. See the `DragOverlay` in [Scheduler.tsx](../../src/components/Scheduler.tsx).

## Decision

While dragging, a copy of the card (dnd-kit's `DragOverlay`) follows the pointer above everything else.

## Consequences

- The dragged card is always visible, whichever day it passes over.
- The overlay draws the same `TaskCardView` as the card, so the copy looks the same without extra styling.
- While dragging, the original card stays in the list as well, so there are two cards on screen.

**Revisit if:** we replace dnd-kit, or the copy causes a bug that the plain dragged card wouldn't.
