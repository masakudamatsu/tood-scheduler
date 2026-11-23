# 0029: Scheduled workflows start at minute 17

- **Status:** accepted
- **Date:** 2026-11-24

## Context

The [backup](../../.github/workflows/backup.yml) and [skill update](../../.github/workflows/update-skills.yml) workflows were set to start at 03:00 Japan time ([0025](0025-backup-times-in-japan-time.md), [0028](0028-weekly-skill-updates.md)). On November 23, both started at about 08:25 instead: more than 5 hours late ([#76](https://github.com/masakudamatsu/tood-scheduler/issues/76)).

GitHub starts a scheduled workflow only when it has room, and promises no time. Its docs say the start of every hour is the busiest time, that runs can be late or even dropped then, and that a different minute makes this less likely ([Events that trigger workflows → schedule](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)).

## Decision

Both workflows start at minute 17 of the hour: 03:17 Japan time (18:17 UTC). Any minute other than 0 would do.

We decided against two other fixes for now:

- **Starting earlier**, for example at 01:17, so a delay of a few hours still ends before morning. It still promises nothing, and it runs closer to when Masa may be using the app.
- **Starting the workflows from a timer outside GitHub**, such as a Cloudflare Worker that asks GitHub to run them at 03:00. It is the only fix that comes close to a promise, but it needs a GitHub token kept in Cloudflare and one more service to set up by hand.

## Consequences

- One line in each workflow changes. Nothing new to set up or look after.
- Runs should start within minutes most nights, but GitHub can still start them late. A late backup is still a full copy of the database, and its file name shows the time it really ran.

**Revisit if:** runs still often start hours late, or GitHub drops them.
