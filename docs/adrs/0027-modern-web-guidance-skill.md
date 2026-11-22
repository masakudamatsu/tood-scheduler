# 0027: Agents use Google Chrome's modern-web-guidance skill for web code

- **Status:** accepted
- **Date:** 2026-11-22

## Context

Many of our UI problems, like focus escaping a popup or faint grey text, are not special to this app (#12). Any app has them, and there are standard fixes for them. But coding agents don't use those fixes unless they are told about them. Google Chrome publishes a skill, `modern-web-guidance`, that looks up current best practice for HTML, CSS and browser JavaScript. Its first review of the app became issues #16 to #24.

The skill sends anonymous usage data to Google by default: which guides an agent looks up, and its search words.

## Decision

The skill is copied into the repo with the `skills` tool (`npx skills add GoogleChrome/modern-web-guidance`), in `.agents/skills/` with a symlink in `.claude/skills/` ([0019](0019-skills-in-agents-folder.md)). `skills-lock.json` records which version we have. A workflow updates it every week ([0028](0028-weekly-skill-updates.md)).

- **No rule in `AGENTS.md`.** The rule applies only to web code, so it doesn't belong there ([0018](0018-rules-for-some-tasks-in-skills.md)). The skill's own description already tells agents to use it first for HTML, CSS and browser JavaScript.
- **No usage data.** `.claude/settings.json` sets `DISABLE_TELEMETRY=1` for this project. The skill's tool reads it and stops sending data. Claude Code reads it too, and stops sending its own usage data here.
- **We don't edit the skill's files,** so an update can replace them. CodeRabbit skips them in reviews (`path_filters` in [.coderabbit.yaml](../../.coderabbit.yaml)). It still reads the skill's `SKILL.md` as a rule for web code.

## Consequences

- Agents get current best practice for web code without us writing it down.
- The skill runs `npx modern-web-guidance` to search its guides, so it needs the network. That's fine for coding, but `npm test` must never use it.
- An agent without `DISABLE_TELEMETRY` set, such as one not run by Claude Code, still sends usage data.
- The guides say which features are safe in which browsers. We have no rule yet for which browsers must work, so some fixes add fallbacks we might not need.

**Revisit if:** the skill's advice keeps clashing with what we decided for the app, or we set a rule for which browsers must work (then add it to `AGENTS.md`).
