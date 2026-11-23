# 0028: A workflow updates named skills every week

- **Status:** accepted
- **Date:** 2026-11-22

## Context

Google updates the `modern-web-guidance` skill often ([0027](0027-modern-web-guidance-skill.md)). Running `npx skills update` by hand is easy to forget. Dependabot and Renovate (tools that open update pull requests) don't know about `skills-lock.json`.

The `skills` tool has some surprises when nobody is there to answer its questions:

- With no skill names, it updates every skill in `skills-lock.json`, including ones we may want to keep at a fixed version.
- With a name it doesn't know, it does nothing and still reports success.
- If it can't tell which coding agent is used, as on a fresh GitHub runner, it writes a copy of each skill for every agent it knows, for example in `agent/skills/`.

## Decision

Every Monday at 03:17 Japan time (Sunday 18:17 UTC; why minute 17: [0029](0029-schedules-avoid-minute-zero.md)), [.github/workflows/update-skills.yml](../../.github/workflows/update-skills.yml) runs [scripts/update-skills.sh](../../scripts/update-skills.sh). If a skill changed, the workflow opens a pull request from the branch `chore/update-skills` into `main`, or updates the one already open. Masa reads the link to what changed and merges it. Nothing is merged on its own.

It runs at night so the skill doesn't change while Masa may be working on the app and using it. Like the backup ([0025](0025-backup-times-in-japan-time.md)), the time is in Japan time.

- **Only the skills named in the workflow are updated.** It starts with `modern-web-guidance`. Whoever adds a skill from someone else decides whether to add its name.
- **The script stops** if a named skill isn't in `skills-lock.json`, or if the update changes any file other than the named skills and the lock file.
- **It tells the `skills` tool we use Claude Code** (`AI_AGENT=claude`), so no copies are made for other agents. It turns off the tool's usage data too.
- **It pins the `skills` tool's version** (`skills@1.9.0`), so a new release can't change what the job does. Raise it by hand.
- **The workflow starts CI itself.** A pull request opened with a workflow's own token doesn't start other workflows, so `ci.yml` can also be started by hand, and the workflow does that.

We decided against a scheduled Claude agent. It would use Claude usage every week to run one command.

## Consequences

- Skills stay current without anyone remembering to update them.
- Masa has to turn on "Allow GitHub Actions to create and approve pull requests" in the repo settings, or the workflow fails when it opens the pull request.
- The update branch is made again from `main` each week, so a commit added to it by hand is lost.
- GitHub turns off scheduled workflows in a public repo after 60 days with no activity. Running it from the Actions tab still works.

**Revisit if:** the `skills` tool gets a way to choose agents for `update`, or Dependabot or Renovate start to support `skills-lock.json`.
