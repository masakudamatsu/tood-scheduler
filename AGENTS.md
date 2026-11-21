# AGENTS.md

A map for coding agents. The rules live in [CLAUDE.md](CLAUDE.md). Read it first.

## Where things are

- [CLAUDE.md](CLAUDE.md): what the app does and the rules for every task (tests first, Never do, Git).
- [docs/adrs/](docs/adrs/): one record per decision, with why we made it and when to revisit it.
- [docs/primitives.md](docs/primitives.md): the app's building blocks, where each lives, and the records that shape it.
- [README.md](README.md): how to run the app and the tests, and the project layout.
- [supabase/schema.sql](supabase/schema.sql): database tables and access rules.
- [tests/](tests/): Playwright tests, one per feature.

## Skills

Step-by-step guides in [.claude/skills/](.claude/skills/):

- [work-on-issue](.claude/skills/work-on-issue/SKILL.md): from a GitHub issue to a pull request.
- [address-review](.claude/skills/address-review/SKILL.md): fix a pull request after review.
- [change-database](.claude/skills/change-database/SKILL.md): adding a field to a task, adding a table, or changing `supabase/schema.sql`.
- [commit](.claude/skills/commit/SKILL.md) and [suggest-commit](.claude/skills/suggest-commit/SKILL.md): commit message rules.

## The one check

```bash
npm run verify
```

It runs lint, the type check and the tests. CI runs the same command ([.github/workflows/ci.yml](.github/workflows/ci.yml)). A task is done only when it passes.
