# 0011: Use Supabase's built-in email service for now

- **Status:** accepted
- **Date:** 2026-11-03

## Context

Sign-in works by email: Supabase sends a magic link (see [0003](0003-implicit-sign-in-flow.md)). Supabase's built-in email service sends only two emails per hour. The other option is custom SMTP: a separate email-sending service that Supabase hands the emails to. This is a setting in the Supabase dashboard, not in this repo.

## Decision

We use the built-in email service and don't set up custom SMTP.

## Consequences

- Nothing extra to sign up for, set up or pay for. Two emails per hour is fine for one user.
- After two sign-in emails in an hour, no more arrive until the hour is up. Testing sign-in many times in a row hits the limit.

**Revisit if:** more people use the app, or the limit gets in the way of signing in.
