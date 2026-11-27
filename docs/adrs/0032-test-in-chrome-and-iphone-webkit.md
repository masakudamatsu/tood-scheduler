# 0032: Tests run in desktop Chrome and in WebKit as an iPhone SE

- **Status:** accepted
- **Date:** 2026-11-27

## Context

The tests ran only in Chrome, on a laptop-sized screen. Masa uses the app on an iPhone SE (3rd generation), where every browser runs on WebKit, the engine behind Safari. So bugs that show up only in Safari, or only on a small touch screen, could get past the tests. One such bug is in #82: in Safari, Escape doesn't put focus back on the button that opened the popup (#83).

Playwright can run WebKit as a desktop browser, or make it act like a phone: a phone's screen size, touch, and user agent (the text a browser sends to say what it is).

## Decision

Every test runs twice: in desktop Chrome, and in WebKit set up as Playwright's `iPhone SE (3rd gen)`. This happens both in `npm run verify` on your own computer and on CI.

We decided against:

- **Desktop WebKit.** The app is used on a phone, not in Safari on a Mac. A phone in WebKit checks Safari and the phone layout in one go, so the tests stay as fast as they would be with two browsers.
- **A newer iPhone, such as the iPhone 15.** Masa's phone is an iPhone SE. Its screen is smaller (375 × 667), so layout problems show up there first.
- **Only Chrome locally, both browsers on CI.** On Masa's Mac, both browsers together take about as long as Chrome alone (around 30 seconds), because most of the time goes to starting the server. Running different tests locally and on CI would also break the rule that `npm run verify` and CI run the same thing. Then an agent could call a task done and only find out on CI that it isn't.

## Consequences

- A test that works only on a wide screen, or only with a mouse wheel, now fails. Two checks in `tests/1-schedule-list.spec.ts` had to change for this reason.
- Each computer that runs the tests needs WebKit installed (a few hundred MB). CI takes about a minute longer, to install it.
- WebKit acting as an iPhone is still not real iOS Safari. Some iOS behaviour isn't copied.
- The drag tests drag with the mouse, so they still don't check dragging with a finger (#85).

**Revisit if:** Masa changes phones, the tests get too slow to run on every check, or a bug gets past these tests and turns up only on a real iPhone.
