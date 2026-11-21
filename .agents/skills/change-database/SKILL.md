---
name: change-database
description: Rules for changing what the app saves - adding a field to a task, adding a table, or any change to supabase/schema.sql, src/lib/types.ts or src/lib/store/. Use before editing any of these files.
---

The "Never do" rules in AGENTS.md still apply: never touch the real database, and never remove or rename anything in `supabase/schema.sql`.

## Adding a field to a task

Update all of these together:

1. `src/lib/types.ts`
2. `src/lib/store/local.ts`, with a default for data saved before the field existed
3. `COLUMNS` and `normalize()` in `src/lib/store/supabase.ts`
4. `supabase/schema.sql`: the `create table`, plus an `alter table ... add column if not exists` line for existing databases

## Adding a table

A new table in `supabase/schema.sql` needs RLS (Row Level Security) turned on, policies, and a `grant ... to authenticated` line ([0012](../../../docs/adrs/0012-new-tables-not-exposed.md)).

## When `schema.sql` changes

Tell Masa that the database must be updated. He needs to run the whole file again in Supabase's SQL Editor. Say this in your reply when the task is done, and in the pull request if there is one.
