---
name: commit
description: Commit the current changes with a message that follows the project's commit rules, without asking first. Use when Masa types /commit or explicitly asks to commit, or when another skill's instructions say to commit. Never use it on your own initiative.
---

Masa has already said yes, either by asking or by running a skill that commits. Commit without asking him to confirm.

1. Run `git status` and `git diff`. Commit only the changes for the current task. If something is staged, commit what's staged. Don't add files that belong to other work. If you can't tell what's part of the task, ask.
2. If you're on `main`, make a branch for the task first (CLAUDE.md asks for one branch per task).
3. Write the message by following the rules in `.claude/skills/suggest-commit/SKILL.md`. Ignore its rule against attribution. Instead, end each message with the `Co-Authored-By` line Claude Code is told to use, for example `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, so the history shows Claude made the commit. If the changes would be better as more than one commit, make each commit separately.
4. Commit. Pass the message with a heredoc so the blank lines and one-line paragraphs stay as written.
5. Don't push. Show the result with `git log -1 --stat` (once for each commit).
