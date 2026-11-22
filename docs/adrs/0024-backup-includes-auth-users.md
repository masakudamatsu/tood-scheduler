# 0024: The backup includes Supabase's user list

- **Status:** accepted
- **Date:** 2026-11-22

## Context

`tasks` and `settings` both point to `auth.users`, Supabase's list of users ([supabase/schema.sql](../../supabase/schema.sql)). So a backup of only those two tables can't be loaded into a new Supabase project: every row points to a user who isn't there.

The backup follows Supabase's own backup steps ([scripts/backup-dump.sh](../../scripts/backup-dump.sh)): the roles, the tables and access rules, then the data.

## Decision

The data in the backup comes from two schemas (groups of tables): `public` (`tasks` and `settings`) and `auth` (`auth.users`, and the tables Supabase's sign-in needs, like `auth.identities`). The backup fails if `auth.users`, `tasks` or `settings` is missing from it.

We leave out the data of Supabase's other schemas, such as `storage` (uploaded files). The app doesn't use them, so they're empty. And loading `storage` rows into a new project fails, because only Supabase's own storage role may write to some of those tables.

## Consequences

- A restore into a new Supabase project brings back the users, so they can sign in with the same email and see their tasks. A practice restore on a local Supabase showed this works.
- The backups hold users' email addresses, and Supabase's sign-in records (for example sessions). That's why they're encrypted ([0022](0022-backups-encrypted-with-age.md)).
- If the app starts using another Supabase feature that saves data, like file uploads, the backup leaves it out until someone adds its schema.

**Revisit if:** the tables stop pointing to `auth.users`, the app starts saving data outside `public`, or Supabase offers its own downloadable backups on the free plan.
