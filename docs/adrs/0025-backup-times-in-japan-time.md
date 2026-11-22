# 0025: Backup times are in Japan time

- **Status:** accepted
- **Date:** 2026-11-22

## Context

The daily backup first ran at 03:00 UTC, and each file was named by the time in UTC ([.github/workflows/backup.yml](../../.github/workflows/backup.yml)). The app's main user, Masa, lives in Japan. 03:00 UTC is noon in Japan, when he may be using the app. And a UTC file name makes him work out the Japan time before he can tell which backup to restore.

## Decision

The daily backup runs at 03:00 Japan time (18:00 UTC). Each file is named by the time in Japan, ending in `JST`: for example `2026-11-22T03-00-00JST.sql.age`.

## Consequences

- The daily backup runs when nobody is likely to be changing tasks.
- Picking a file to restore needs no time-zone sums ([restore-backup.md](../restore-backup.md)).
- GitHub's schedules use UTC, so the workflow has to say 18:00 to mean 03:00 in Japan. Japan has no summer time, so this never shifts.

**Revisit if:** the main users live somewhere else.
