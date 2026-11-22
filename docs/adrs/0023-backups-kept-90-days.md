# 0023: Old backups are deleted after 90 days

- **Status:** accepted
- **Date:** 2026-11-22

## Context

Backups pile up: one a day, plus one after each merge ([0020](0020-backups-in-cloudflare-r2.md)). They also hold users' data, so a user who asks for their data to be deleted needs it gone from the backups too, within a known time. A rule on the R2 bucket deletes each file a set number of days after upload. Masa set it up in the Cloudflare dashboard, not in this repo.

## Decision

Each backup is deleted 90 days after upload.

Why not 30 days: a bug that quietly damages old tasks may go unnoticed for weeks. And the rule removes old files even when no new backups arrive, so if backups stop without anyone noticing, a short limit can leave the bucket empty.

## Consequences

- A problem found up to about three months later can still be undone.
- A user's deleted data stays in the backups for up to 90 days.
- The rule lives in the Cloudflare dashboard, so changing it means changing the dashboard and this record together.

**Revisit if:** #57 (daily backups for 30 days, monthly for a year) is done.
