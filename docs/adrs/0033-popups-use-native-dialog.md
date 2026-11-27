# 0033: Popups use the native dialog element

- **Status:** accepted
- **Date:** 2026-11-26

## Context

The new task popup, the task details popup and the "Delete this task?" question were plain `<div>`s with `role="dialog"`. A review with the `modern-web-guidance` skill found the problems that come with that (#16):

- Tab moved past the popup to the page behind it.
- After closing, focus went to the top of the page, not back to the + button or the task card.
- Keyboards and screen readers could still reach the page behind.
- Android's back gesture didn't close the popup.

We had our own Escape handler too, with extra logic so Escape closed the delete question before the task details.

## Decision

Every popup is a native `<dialog>`, opened with `showModal()`. They all use the `Modal` component in [Popup.tsx](../../src/components/Popup.tsx). The browser then keeps focus inside, makes the page behind unreachable, closes the popup on Escape or the back gesture, and puts focus back where it was.

A popup opened over another one, like the delete question, is a separate `<dialog>` next to it, not a part of it. The browser closes only the top dialog on Escape, so we need no Escape code of our own.

We decided against:

- **Keeping the `<div>`s and adding a focus trap.** It's more code, and still misses the back gesture and the unreachable page behind.
- **`window.confirm()` for the delete question.** The browser decides where that box goes.

## Consequences

- No focus trap, Escape handler or `aria-modal` of our own. Don't add them: they would fight the browser's.
- The browser puts focus back on whatever had focus when the popup opened. Safari doesn't focus a button when you click it, so every button that opens a popup focuses itself first, with `focusOpener` in [Popup.tsx](../../src/components/Popup.tsx). A new button that opens a popup needs it too.
- A popup closes when its parent removes it from the page. `Modal` calls `close()` just before that happens, because removing an open dialog doesn't put focus back.
- Safari doesn't support `closedby="any"` (tap outside to close) yet, so `Modal` has a small fallback for it ([0031](0031-baseline-widely-available.md)). In Safari, the page behind can also still scroll. And with the delete question open, Tab can stop on the task details box behind it (but on nothing inside that box).

**Revisit if:** `closedby` becomes Baseline Widely available. Then remove the fallback.
