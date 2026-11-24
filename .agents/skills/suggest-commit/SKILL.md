---
name: suggest-commit
description: Write a commit message for the current changes and show it, without committing. Use when asked to suggest or draft a commit message, and when a task is done (AGENTS.md asks for a suggested message then).
---

Write a commit message for the changes, following the rules below. Show it in a code block. Never run `git commit`: Masa runs the commit himself. If the changes would be better as more than one commit, say which files go in each and give a message for each.

Read the diff first (`git diff --staged`, or `git diff` and `git status` if nothing is staged).

## Rules

As the baseline, follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/#specification):

```
<type>[scope]: <description>

[body]

[optional footer(s)]
```

### Type

Pick the type by what changes for people using the app, not by whether the change corrects a mistake ([0030](../../../docs/adrs/0030-commit-type-by-what-changes-in-the-app.md)).

- `feat`: something new that people using the app can see or do.
- `fix`: a bug that people using the app run into.
- Anything else is not `feat` or `fix`, even when it corrects a mistake:
  - `ci`: GitHub workflows (`.github/workflows/`) and the scripts they run.
  - `test`: only tests change.
  - `docs`: only docs change: the README, `docs/`, `AGENTS.md` or a skill.
  - `chore`: other maintenance, such as dependency updates, `npm audit fix` and settings, even if it patches a security vulnerability.

Before you write `feat` or `fix`, name the screen or behavior in the app that changes. If you can't name one, use another type.

### Scope

- Use a single word (or a phrase in kebab-case) that describes the area of the codebase affected by the change so that related commits can be grouped together.

### Description

- Describe what changed. Don't repeat what is obvious from git diff. Treat it as a "comment" that applies to all the changes across files.

### Body

- Always describe why it changed. For user-facing changes, for example, mention what kind of user experience will be achieved as a result. For a bug fix, explain the bug.
- Optionally explain the detail of what changed, if the short description in the commit message header needs clarification. But do not include what is obvious from git diff.
- Write each body paragraph as a single line, with no line breaks inside it. Separate paragraphs with a blank line.

### Footers

- `Fixes #<number>` when the task comes from a GitHub issue.
- No `Co-Authored-By` or other attribution line. Masa makes this commit himself.
