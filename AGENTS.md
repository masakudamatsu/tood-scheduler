# AGENTS.md

A map for coding agents. The rules live in [CLAUDE.md](CLAUDE.md). Read it first.

## Where things are

- [CLAUDE.md](CLAUDE.md): what the app does and the rules for every task (tests first, Never do, Git), and the skills list.
- [docs/adrs/](docs/adrs/): one record per decision, with why we made it and when to revisit it.
- [docs/primitives.md](docs/primitives.md): the app's building blocks, where each lives, and the records that shape it.
- [README.md](README.md): how to run the app and the tests, and the project layout.
- [supabase/schema.sql](supabase/schema.sql): database tables and access rules.
- [tests/](tests/): Playwright tests, one per feature.

## The one check

```bash
npm run verify
```

It runs lint, the type check and the tests. CI runs the same command ([.github/workflows/ci.yml](.github/workflows/ci.yml)). A task is done only when it passes.
