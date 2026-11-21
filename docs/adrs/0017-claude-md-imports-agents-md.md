# 0017: CLAUDE.md only imports AGENTS.md

- **Status:** accepted
- **Date:** 2026-11-21

## Context

The rules for coding agents lived in `CLAUDE.md`. Issue #33 added an `AGENTS.md` next to it, as a map that pointed to `CLAUDE.md`. Masa didn't want two files of rules to keep up to date.

Other coding agents read `AGENTS.md`. Claude Code reads `CLAUDE.md`. It reads `AGENTS.md` only when there is no `CLAUDE.md` or `CLAUDE.local.md` in the working folder or any folder above it, and only in v2.1.277 or later. The **Project instructions** setting in `/config` can also change which file it reads.

## Decision

All the rules live in `AGENTS.md`. `CLAUDE.md` holds one line, `@AGENTS.md`, which makes Claude Code read `AGENTS.md` at the start of every session. `AGENTS.md` says to keep `CLAUDE.md` that way.

We decided against having no `CLAUDE.md` at all. Then a `CLAUDE.md` added later would quietly stop Claude Code from reading the rules. A rule against adding one isn't enough: Claude Code's `/init` command, or a person, can add one without reading the rules. With the import in place, anything added to `CLAUDE.md` sits next to it, and the rules are still read.

## Consequences

- One file of rules, read by Claude Code and by other coding agents.
- Claude Code reads the rules whatever its version or its `/config` setting.
- One more file in the repo, but it has nothing to keep up to date.
- If someone rewrites `CLAUDE.md` and drops the `@AGENTS.md` line, Claude Code stops reading the rules.

**Revisit if:** we need instructions only Claude Code should read. They could go in `CLAUDE.md` under the import line.
