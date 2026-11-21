# To Do Scheduler

To Do Scheduler is a web app that helps the user plan what to do each day **without overloading themselves with too many tasks**. The [README](README.md) lists what the user can do with it.

## Rules for every task

Decisions are recorded in `docs/adrs/`, one file per decision. Before a task, list `docs/adrs/` and read the records that matter for the task. Also read [docs/primitives.md](docs/primitives.md): it lists the app's building blocks, and says how to use and update the list. **When a task involves a decision, write a record** by copying `docs/adrs/0000-template.md`.

- **Tests first.** For a new feature or a bug fix, write a Playwright test that fails (or update the existing tests so they fail with the current codebase), then write the code to make it pass.
- **A task is done only when `npm run verify` passes.** CI runs the same command ([.github/workflows/ci.yml](.github/workflows/ci.yml)).
- **Plain English** in the README, docs, UI text and explanations: everyday words, short sentences. Define a technical term once when you need it.
- **Update the README** when a feature changes what the user sees.

## Never do

These were decided already. Don't propose them again.

- **Never touch the real Supabase database, or the settings in the Supabase, Vercel or GitHub dashboards.** No SQL against the real database. Masa does those by hand, so a mistake can't reach real users' data.
- **Never remove or rename anything in `supabase/schema.sql`.** No dropping columns or tables, no deleting data. Only add, and keep the file safe to run again (`if not exists`, `drop policy if exists`, …). Masa runs the whole file again on a database that already has users' data.
- **Never weaken the red border for overloaded days.** It's the core feature of the app: it's how the user notices a day with too much to do.
- **Never add server code or put secret keys in the browser.** No API routes, no `service_role` key, never commit `.env.local`. Row Level Security is what keeps each user's data safe, and a secret key in the browser gets past it ([0002](docs/adrs/0002-no-server-code.md)).
- **`npm test` never needs Supabase or the network.** Tests must run anywhere, offline, without risk to real data. Tests that need Supabase use a throwaway Supabase on the same machine, never the real database.
- **Keep `CLAUDE.md` as only `@AGENTS.md`.** Put rules in this file, so every agent reads them. Claude Code reads `CLAUDE.md`, and that line makes it read this file too ([0017](docs/adrs/0017-claude-md-imports-agents-md.md)).

## Git

- One branch per task.
- Don't commit or push unless Masa asks, or a skill he runs says to. When a task is done, suggest a commit message instead.
- Never merge a pull request: Masa does that.
