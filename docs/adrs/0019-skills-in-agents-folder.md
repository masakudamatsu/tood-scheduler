# 0019: Skills live in .agents/skills/, with a symlink for Claude Code

- **Status:** accepted
- **Date:** 2026-11-21

## Context

The skills lived in `.claude/skills/`, which only Claude Code reads. Other coding agents look for skills in `.agents/skills/`. We already keep the rules in `AGENTS.md` so every agent reads them ([0017](0017-claude-md-imports-agents-md.md)), and rules for only some tasks live in skills ([0018](0018-rules-for-some-tasks-in-skills.md)). So with the skills in `.claude/skills/`, other agents would miss those rules.

## Decision

Each skill lives in `.agents/skills/<name>/`. For Claude Code, `.claude/skills/<name>` is a symlink (a file that points to another folder) to `../../.agents/skills/<name>`, one per skill.

We decided against a single symlink for the whole `.claude/skills/` folder. With one symlink per skill, `.claude/skills/` can still hold a skill only Claude Code should use.

## Consequences

- Every coding agent finds the same skills, and each skill has one copy.
- A new skill needs a symlink too, or Claude Code won't see it. The `write-docs` skill says so.
- Symlinks may not work on Windows unless Git is set up for them.

**Revisit if:** Claude Code starts reading `.agents/skills/` itself (then drop the symlinks), or someone needs to work on this repo on Windows.
