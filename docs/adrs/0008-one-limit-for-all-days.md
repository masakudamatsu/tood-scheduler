# 0008: One daily limit for all days

- **Status:** accepted
- **Date:** 2026-11-03

## Context

The user sets a maximum number of hours per day (8 by default). Some days have less free time than others, such as weekends or days with meetings, so a different limit for each day was an option.

## Decision

We won't build a limit for each day. One limit applies to every day.

## Consequences

- The app stays small: one setting, one number to store.
- On a busy day, the user has to keep in mind that the real limit is lower than the one shown.

**Revisit if:** the user often has days with much less free time and the single limit stops warning them in time.
