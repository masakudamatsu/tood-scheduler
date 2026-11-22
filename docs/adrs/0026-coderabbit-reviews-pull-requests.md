# 0026: CodeRabbit reviews every pull request

- **Status:** accepted
- **Date:** 2026-11-22

## Context

The repo is moving to autopilot: agents ship most changes, and Masa makes the product decisions. Before agents may merge anything on their own (#62), each pull request needs a review by someone other than the agent that wrote it. Until now, Masa was the only reviewer. CI checks that the tests pass, but it can't tell if a test was changed just to make it pass, or if a change breaks a rule in [AGENTS.md](../../AGENTS.md).

## Decision

CodeRabbit (an AI code reviewer, installed as a GitHub app) reviews every pull request. Its settings are in [.coderabbit.yaml](../../.coderabbit.yaml), so a change to them goes through a pull request like any other change. It reads AGENTS.md and the skills as rules to check. And it looks closely when a test's expected result changes in the same pull request as the code it tests.

## Consequences

- Each pull request gets a second review, and Masa doesn't have to write it.
- CodeRabbit's review is advice. It doesn't block merging. Masa still merges, until #62 sets which pull requests an agent may merge.
- Agents have to read CodeRabbit's comments and act on them, and some of the comments will be wrong.
- CodeRabbit is free for public repos. If the repo becomes private, it would need a paid plan.

**Revisit if:** CodeRabbit's comments are mostly noise that agents and Masa ignore, or the repo becomes private.
