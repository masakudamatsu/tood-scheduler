# AGENTS.md

A map for coding agents. The rules live in [CLAUDE.md](CLAUDE.md). Read it first.

## Where things are

- [CLAUDE.md](CLAUDE.md): what the app does and the rules for every task (tests first, adding a field, Git).
- [docs/decisions.md](docs/decisions.md): choices the code doesn't explain. Read it before changing behavior.
- [README.md](README.md): how to run the app and the tests, and the project layout.
- [supabase/schema.sql](supabase/schema.sql): database tables and access rules.
- [tests/](tests/): Playwright tests, one per feature.

## Skills

Step-by-step guides in [.claude/skills/](.claude/skills/):

- [work-on-issue](.claude/skills/work-on-issue/SKILL.md): from a GitHub issue to a pull request.
- [address-review](.claude/skills/address-review/SKILL.md): fix a pull request after review.
- [commit](.claude/skills/commit/SKILL.md) and [suggest-commit](.claude/skills/suggest-commit/SKILL.md): commit message rules.
- [trim-decisions](.claude/skills/trim-decisions/SKILL.md): keep `docs/decisions.md` short.

## The one check

```bash
npm run verify
```

It runs lint, the type check and the tests. CI runs the same command ([.github/workflows/ci.yml](.github/workflows/ci.yml)). A task is done only when it passes.
