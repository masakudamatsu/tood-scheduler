# 0020: Backups go to Cloudflare R2

- **Status:** accepted
- **Date:** 2026-11-22

## Context

The free Supabase plan has no backups you can download. So if a bad change or a mistake damages users' data, there's nothing to get it back from. We wanted a backup after every merge to `main` (before the new code can change any data) and once a day ([.github/workflows/backup.yml](../../.github/workflows/backup.yml)). An earlier plan saved them to a private GitHub repo. This repo is public, so the backups can't live here, in its workflow artifacts (files a workflow run keeps) or in its logs.

Options we compared:

- **Private GitHub repo:** keeps every copy forever in git history. A user's deleted data can't be removed without rewriting history.
- **Workflow artifacts:** deleted after 90 days at most, and anyone signed in to GitHub can download them from a public repo.
- **Backblaze B2:** much the same service as R2, free and with no card needed, but a smaller company than Cloudflare.
- **AWS S3:** not free after the first months, and harder to set up.
- **Cloudflare R2:** 10 GB free, free downloads, and a bucket rule deletes old copies by itself.

## Decision

Backups go to a private Cloudflare R2 bucket.

## Consequences

- No cost at this size, and downloading a backup to restore it is free too.
- A rule on the bucket deletes old backups, so a user's deleted data is gone from the backups after a while ([0023](0023-backups-kept-90-days.md)).
- R2 works with the AWS command-line tool, so the workflow needs nothing extra to upload.
- One more account (Cloudflare) to look after, and its token lives in GitHub's secrets ([0021](0021-r2-account-api-token.md)).

**Revisit if:** the backups grow past 10 GB, Cloudflare stops the free R2 usage, or Supabase offers downloadable backups on the free plan.
