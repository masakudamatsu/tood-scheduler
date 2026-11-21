# 0018: Rules for only some tasks live in skills

- **Status:** accepted
- **Date:** 2026-11-21

## Context

The rules file for agents kept growing. It held rules for every task, and also rules that matter only now and then: the four files to update when adding a field to a task, the rules for a new table, and how to write docs. A long rules file costs every task, and the rules that matter get lost among the ones that don't.

At first, `AGENTS.md` was planned as a short map that points to the rules (issue #33). But a linked file isn't read at the start of a session the way `AGENTS.md` is, so an agent might skip the rules it points to.

## Decision

`AGENTS.md` holds only the rules for every task. Rules for only some tasks live in skills in `.claude/skills/`, such as `change-database` and `write-docs`. An agent reads a skill when the skill's description matches the task, so each description says plainly when to use it.

`AGENTS.md` holds rules, not a map. It has no list of skills, because agents already read every skill's name and description at the start of a session. It has no list of where things are, because an agent finds those by listing the repo.

We decided against:

- **Guides in `docs/guides/`.** Nothing makes an agent open a linked file.
- **Rules tied to file paths, like `.claude/rules/`.** Each coding agent does these in its own way.

## Consequences

- `AGENTS.md` stays short, and every line in it applies to every task.
- A rule for some tasks is read only if its skill's description matches the task. A vague description means the rule is skipped.
- An agent that doesn't support skills won't find these rules.

**Revisit if:** agents keep skipping a skill when they should use it, or we start using a coding agent that doesn't read skills.
