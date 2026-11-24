# 0030: Commit type says what changes in the app

- **Status:** accepted
- **Date:** 2026-11-25

## Context

The [commit rules](../../.agents/skills/suggest-commit/SKILL.md) said to "reserve `fix` for bugs that affect users", and listed only `chore` and `fix`. They didn't say which users. So a bug in a workflow, which only affects Masa, looked like it counted, and with no other type listed, `fix` was the nearest fit. A bug in the skill update workflow was committed as `fix(skills): …` in [#73](https://github.com/masakudamatsu/tood-scheduler/pull/73), and an earlier backup workflow bug as `fix(backup): …`. Skills and workflows were also committed as `chore(agents)` ([#71](https://github.com/masakudamatsu/tood-scheduler/pull/71)) and `chore(workflows)` ([#78](https://github.com/masakudamatsu/tood-scheduler/pull/78)) ([#74](https://github.com/masakudamatsu/tood-scheduler/issues/74)).

## Decision

Pick the type by what changes for people using the app. `feat` and `fix` are only for changes they can see. Everything else uses another type from [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `ci` for workflows and their scripts, `test` for tests only, `docs` for the README, `docs/`, `AGENTS.md` and skills, and `chore` for the rest.

We decided against `chore` for skills, `AGENTS.md` and workflows, as #71 and #78 used. These are standard types, and with them the history shows at a glance which commits change the app and which change only how it's built.

## Consequences

- Commits made before 2026-11-25 keep their old types, so two workflow changes among them are typed `fix`: `27e526d fix(backup): …` and `348bd44 fix(skills): …`. From that date on, `feat` and `fix` are only for changes people using the app notice.

**Revisit if:** picking between `docs`, `ci` and `chore` often takes thought, or a change doesn't fit any of them.
