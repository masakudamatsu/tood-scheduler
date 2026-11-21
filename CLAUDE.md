# To Do Scheduler

To Do Scheduler is a web app that helps the user plan what to do each day **without overloading themselves with too many tasks**. The [README](README.md) lists what the user can do with it.

## Rules for every task

Decisions are recorded in `docs/adrs/`, one file per decision. Before a task, list `docs/adrs/` and read the records that matter for the task. Also read [docs/primitives.md](docs/primitives.md): it lists the app's building blocks, and says how to use and update the list. **When a task involves a decision, write a record** by copying `docs/adrs/0000-template.md`.

- **Tests first.** For a new feature or a bug fix, write a Playwright test that fails (or update the existing tests so they fail with the current codebase), then write the code to make it pass. Finish only when `npm run verify` passes.
- **Adding a field to a task** means updating all of these together:
  1. `src/lib/types.ts`
  2. `src/lib/store/local.ts`, with a default for data saved before the field existed
  3. `COLUMNS` and `normalize()` in `src/lib/store/supabase.ts`
  4. `supabase/schema.sql`: the `create table`, plus an `alter table ... add column if not exists` line for existing databases
- **A new table in `supabase/schema.sql`** needs RLS turned on, policies, and a `grant ... to authenticated` line ([0012](docs/adrs/0012-new-tables-not-exposed.md)).
- **Tell Masa when the database must be updated.** If `schema.sql` changes, he needs to run it again in Supabase's SQL Editor.
- **Plain English** in the README, docs, UI text and explanations: everyday words, short sentences. Define a technical term once when you need it.
- **Update the README** when a feature changes what the user sees.
- **README or `docs/`?** The README is for someone who wants to use or run the project. `docs/` is for someone changing the code: decision records (`docs/adrs/`), building blocks and guides.
- **Don't write in docs what the code already says.** Function names, file contents, how the code works step by step: anyone can find these by reading the code, and a copy goes out of date when the code changes. Docs hold what the code can't say: why, what we decided against, how to run things, and where to look ([0016](docs/adrs/0016-docs-not-what-code-says.md)).

## Never do

These were decided already. Don't propose them again.

- **Never touch the real Supabase database, or the settings in the Supabase, Vercel or GitHub dashboards.** No SQL against the real database. Masa does those by hand, so a mistake can't reach real users' data.
- **Never remove or rename anything in `supabase/schema.sql`.** No dropping columns or tables, no deleting data. Only add, and keep the file safe to run again (`if not exists`, `drop policy if exists`, …). Masa runs the whole file again on a database that already has users' data.
- **Never weaken the red border for overloaded days.** It's the core feature of the app: it's how the user notices a day with too much to do.
- **Never add server code or put secret keys in the browser.** No API routes, no `service_role` key, never commit `.env.local`. Row Level Security is what keeps each user's data safe, and a secret key in the browser gets past it ([0002](docs/adrs/0002-no-server-code.md)).
- **`npm test` never needs Supabase or the network.** Tests must run anywhere, offline, without risk to real data. Tests that need Supabase use a throwaway Supabase on the same machine, never the real database.

## Git

- One branch per task.
- Don't commit or push unless Masa asks, or a skill he runs says to. When a task is done, suggest a commit message instead.
- If the task comes from a GitHub issue, include `Fixes #<number>` in the commit message or pull request. Use `gh` to read and create issues.
- To work on a GitHub issue, use the `work-on-issue` skill. To handle review comments on a pull request, use `address-review`. Never merge a pull request: Masa does that.
