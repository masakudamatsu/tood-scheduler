# 0002: No server code: the browser talks to Supabase directly

- **Status:** accepted
- **Date:** 2026-11-03

## Context

The app needs to save tasks for each signed-in user. One way is to add API routes in Next.js that sit between the browser and the database. The other is to let the browser call Supabase directly. See [supabase.ts](../../src/lib/store/supabase.ts) and [schema.sql](../../supabase/schema.sql).

## Decision

There's no server code. The browser talks to Supabase directly, and Row Level Security (RLS: database rules that decide which rows each user can see and change) keeps each user to their own rows.

## Consequences

- This is the simplest setup that's still safe: no API routes to write, test or deploy.
- All the safety lives in the RLS policies in `schema.sql`. A new table without RLS would be open to every user.
- Don't add API routes unless a feature really needs one.

**Revisit if:** a feature needs a secret the browser mustn't see, or work that can't run in the browser (for example sending emails or calling another paid service).
