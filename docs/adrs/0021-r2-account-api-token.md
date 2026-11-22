# 0021: The R2 token is an Account API token

- **Status:** accepted
- **Date:** 2026-11-22

## Context

The backup workflow needs a token to upload files to the R2 bucket ([0020](0020-backups-in-cloudflare-r2.md)). Cloudflare offers two kinds. A User API token belongs to a person. An Account API token belongs to the Cloudflare account.

## Decision

The workflow uses an **Account API token**, with **Object Read & Write** on the backups bucket only, and no expiry date.

The token is for the workflow, not for a person. A User API token stops working if its owner leaves the Cloudflare organisation, which would stop the backups. Cloudflare recommends Account API tokens for this kind of use.

## Consequences

- Backups keep running whoever joins or leaves the Cloudflare account.
- The token can only touch the backups bucket, so a leaked token can't reach anything else in the account.
- The token never expires. If it leaks, someone has to notice and make a new one by hand.

**Revisit if:** Cloudflare changes how the two kinds of token work, or more people join the Cloudflare account.
