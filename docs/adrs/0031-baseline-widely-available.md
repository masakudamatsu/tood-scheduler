# 0031: The app supports browsers at Baseline Widely available

- **Status:** accepted
- **Date:** 2026-11-26

## Context

Some fixes planned after the review for #12 use browser features that Safari doesn't have yet, such as `closedby` on `<dialog>` (#16, #19) and `overscroll-behavior` on the popup background (#16). Without a rule for which browsers must work, each task had to guess how much fallback code to write (#27, raised in #25).

[Baseline](https://web.dev/baseline) is a label for web features. A feature is **Widely available** once it has worked in Chrome, Edge, Firefox and Safari, on desktop and mobile, for 30 months.

## Decision

Web code may use any feature that is Baseline Widely available, with no fallback. A feature that isn't needs a fallback, so the app still works without it.

The rule is not in `AGENTS.md`, because it matters only for HTML, CSS and browser JavaScript, not for every task ([0018](0018-rules-for-some-tasks-in-skills.md)). The `modern-web-guidance` skill ([0027](0027-modern-web-guidance-skill.md)) already uses this rule by default: its guides treat Widely available features as safe and give a fallback for the rest. Agents read that skill for web code, and CodeRabbit reviews with it.

We decided against:

- **A rule in `AGENTS.md`.** Most tasks, like changing a workflow or a script, don't need it.
- **A skill of our own.** It would repeat what `modern-web-guidance` already says.
- **A lint check for Baseline.** Most of our CSS is Tailwind class names, and features like `closedby` sit in JSX. Current Baseline checkers don't look at either.

## Consequences

- Agents and reviewers don't need a new rule to read. They get it from the skill they already use for web code.
- Fixes like #16 and #19 keep their fallbacks until `closedby` and `overscroll-behavior` on the popup background are Widely available.
- Web code written without the skill, such as a small change an agent doesn't see as web work, won't see the rule.

**Revisit if:** web code that isn't Widely available gets in without a fallback (then add a check that catches it), or the skill changes its default.
