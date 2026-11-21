# 0012: New tables aren't exposed automatically

- **Status:** accepted
- **Date:** 2026-11-03

## Context

Supabase has a setting, "Automatically expose new tables", that lets the browser reach every new table straight away. In this project it's off. We don't know whether it was turned off on purpose or was the default when the project was created. Either way, keeping it off is a choice. This is a setting in the Supabase dashboard, not in this repo.

## Decision

We keep it off. Each table is opened to signed-in users with its own `grant ... to authenticated` line in [schema.sql](../../supabase/schema.sql).

## Consequences

- A new table can't be reached from the browser until we grant access, so a table without RLS policies isn't left open by mistake (see [0002](0002-no-server-code.md)).
- Every new table needs a `grant` line. If it's missing, the app gets a "permission denied" error for that table.

**Revisit if:** we often forget the `grant` line, or Supabase changes how it exposes tables.
