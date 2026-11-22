# Restore a backup

The [Backup workflow](../.github/workflows/backup.yml) saves the whole database to a Cloudflare R2 bucket (Cloudflare's file storage). It runs after every merge to `main`, once a day at 03:00 Japan time, and whenever you start it by hand from the **Actions** tab. Each file is encrypted with `age` (a small encryption tool) and named by the time in Japan when it was made: for example `2026-11-22T03-00-00JST.sql.age`. The bucket deletes each file 90 days after upload.

Why it works this way: [0020](adrs/0020-backups-in-cloudflare-r2.md) (R2), [0021](adrs/0021-r2-account-api-token.md) (the token), [0022](adrs/0022-backups-encrypted-with-age.md) (encryption), [0023](adrs/0023-backups-kept-90-days.md) (90 days), [0024](adrs/0024-backup-includes-auth-users.md) (what's in the file), [0025](adrs/0025-backup-times-in-japan-time.md) (Japan time).

> **Scheduled runs can stop.** GitHub turns off scheduled workflows in a public repo after 60 days with no activity in the repo. The backup after each merge still runs. To turn the daily run back on, open **Actions → Backup** and click **Enable workflow**.

## What you need

- The `age` private key, in your password manager.
- `age` and `psql` (the Postgres command-line tool) on your Mac: `brew install age libpq`.
- Somewhere to load the backup: a new, empty Supabase project, or a throwaway Supabase on your Mac (see [Practise first](#practise-first)). The script refuses to load into a database that already has the app's tables, so it can't mix the backup into the project the app uses now.

## Steps

1. **Find the file.** On https://dash.cloudflare.com, open **R2 → your backups bucket**. Pick the newest file from before the problem started.
2. **Download it.** Click the file, then **Download**.
3. **Get the address of the database to load into.** For a new Supabase project: **Connect → Session pooler**, with your database password in it. For a throwaway Supabase on your Mac, `npx supabase status` shows it as **DB URL**.
4. **Run the restore script** from this folder. Put the address in quotes:
   ```bash
   scripts/restore-backup.sh ~/Downloads/2026-11-22T03-00-00JST.sql.age "<database address>"
   ```
   When it asks, paste the private key from your password manager and press Enter. The key isn't shown or saved.

   The script decrypts the file into a private folder, loads it, and deletes the decrypted copy, even if something fails. If the load fails, nothing is changed, so you can fix the problem and run it again. Don't run `supabase/schema.sql` first: the backup already creates the tables and their access rules.
5. **Check the numbers.** The script ends by showing how many users, tasks and settings the database now has. Check they look right.
6. **Delete the download** when you're done. It's encrypted, but you don't need a second copy.

If you loaded it into a new Supabase project to replace the old one, point the app at it: follow [README](../README.md) step 2, items 3 to 5, and change the two values in Vercel.

## Practise first

Try a restore on a throwaway Supabase on your Mac before you need one. It needs [Docker](https://www.docker.com/products/docker-desktop/) running.

```bash
mkdir /tmp/restore-practice && cd /tmp/restore-practice
npx supabase init
npx supabase start
```

Then follow the steps above, with `postgresql://postgres:postgres@127.0.0.1:54322/postgres` as the address. When you're done, run `npx supabase stop --no-backup` to throw it away.

You can also make a backup file from a local Supabase, to test changes to the backup itself: `scripts/backup-dump.sh <database address> backup.sql` (it needs the Supabase CLI on your `PATH`).
