---
name: write-docs
description: Rules for writing docs - the README, anything in docs/, or a skill in .claude/skills/. Use before adding or changing any of these, including when you add a new skill.
---

CLAUDE.md's rules for every task still apply: plain English, and update the README when what the user sees changes.

## README or `docs/`?

The README is for someone who wants to use or run the project. `docs/` is for someone changing the code: decision records (`docs/adrs/`) and the list of building blocks (`docs/primitives.md`).

## Don't write in docs what the code already says

Function names, file contents, how the code works step by step: anyone can find these by reading the code, and a copy goes out of date when the code changes. Docs hold what the code can't say: why, what we decided against, how to run things, and where to look ([0016](../../../docs/adrs/0016-docs-not-what-code-says.md)).

## Adding a skill

A skill holds rules that matter for only some tasks. An agent reads a skill when its description matches the task, so:

- Write a description that says plainly when to use the skill. Name the files or the kind of task it covers.
- Add a line for the skill to the skills list in AGENTS.md.
