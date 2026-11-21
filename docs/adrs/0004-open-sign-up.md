# 0004: Sign-up is open

- **Status:** accepted
- **Date:** 2026-11-03

## Context

The app is for Masa, but it's on a public address. Supabase can either let anyone make an account or allow only invited users. This is a setting in the Supabase dashboard, not in this repo.

## Decision

Sign-up is open. Anyone with an email address can make an account. RLS keeps their data apart from Masa's (see [0002](0002-no-server-code.md)).

## Consequences

- No invite step: signing in for the first time makes the account.
- Strangers can make accounts. They can't see anyone else's tasks, but each sign-up uses one of the few emails Supabase sends per hour.

**Revisit if:** strangers start signing up, or their sign-ups use up the email limit. Sign-ups can be turned off in the dashboard.
