# 0022: Backups are encrypted with age

- **Status:** accepted
- **Date:** 2026-11-22

## Context

The backups hold users' email addresses and tasks ([0024](0024-backup-includes-auth-users.md)). The R2 bucket is private ([0020](0020-backups-in-cloudflare-r2.md)), but a leaked file or a bucket made public by mistake mustn't expose them.

## Decision

The workflow encrypts each backup with `age` (a small encryption tool) before upload, using Masa's public key. Only the private key can read a file. It lives in Masa's password manager, and later in a GitHub secret for the monthly restore test (#39).

## Consequences

- A leaked file is useless without the private key.
- The public key isn't a secret, so the workflow only needs a key that can lock files, not one that can open them.
- A restore needs the private key ([restore-backup.md](../restore-backup.md)). Losing it makes every backup useless.

**Revisit if:** the key is lost, or R2 offers encryption with a key only Masa holds.
