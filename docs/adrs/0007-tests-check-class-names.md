# 0007: Tests check class names, not colors

- **Status:** accepted
- **Date:** 2026-11-03

## Context

Some tests check that the app shows a color, for example the red border on an overloaded day. Tailwind 4 outputs colors in `oklch()`, so the color the browser reports is awkward to compare with an expected value. See [4-overload.spec.ts](../../tests/4-overload.spec.ts).

## Decision

Tests check class names (for example `border-red-500`), not color values.

## Consequences

- The tests are short and easy to read.
- A test passes even if the class no longer gives the right color, for example after a Tailwind theme change. Renaming the class breaks the test.

**Revisit if:** we move away from Tailwind, or a color bug gets past the tests.
