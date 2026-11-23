# Restore a backup

The [Backup workflow](../.github/workflows/backup.yml) saves the whole database to a Cloudflare R2 bucket (Cloudflare's file storage). It runs after every merge to `main`, once a day at about 03:17 Japan time, and whenever you start it by hand from the **Actions** tab. Each file is encrypted with `age` (a small encryption tool) and named by the time in Japan when it was made: for example `2026-11-22T03-00-00JST.sql.age`. The bucket deletes each file 90 days after upload.

Why it works this way: [0020](adrs/0020-backups-in-cloudflare-r2.md) (R2), [0021](adrs/0021-r2-account-api-token.md) (the token), [0022](adrs/0022-backups-encrypted-with-age.md) (encryption), [0023](adrs/0023-backups-kept-90-days.md) (90 days), [0024](adrs/0024-backup-includes-auth-users.md) (what's in the file), [0025](adrs/0025-backup-times-in-japan-time.md) (Japan time).

> **Scheduled runs can stop.** GitHub turns off scheduled workflows in a public repo after 60 days with no activity in the repo. The backup after each merge still runs. To turn the daily run back on, open **Actions → Backup** and click **Enable workflow**.

## How a restore works

The restore never changes the database the app uses now. The script refuses any database that already has the app's tables, and the live one always has them. Instead, you load the backup into a **new, empty Supabase project**, check it, and then switch the app over to it. The old project stays as it was until you pause or delete it.

We do it this way because restoring in place would mean deleting the live rows first. If the load then failed, or you picked the wrong file, the live data would be gone. With a new project, a mistake changes nothing.

> **The free plan allows only two active Supabase projects.** Paused projects don't count, and you can unpause them later. So if you already have two active projects, pause one before you make the new project (**Project Settings → General → Pause project**). If the live project is the one that's broken, you can pause it. To practise, use a throwaway Supabase on your Mac instead: it needs no project at all (see [Practise first](#practise-first)).

## What you need

- The `age` private key, in your password manager.
- `age` and `psql` (the Postgres command-line tool) on your Mac: `brew install age libpq`.

## Get production back from a backup

### Load the backup into a new project

1. **Make a new Supabase project.** On https://supabase.com, click **New project**. Pick the same region as the old one, and note the database password. Don't run `supabase/schema.sql`: the backup already creates the tables and their access rules.
2. **Find the backup file.** On https://dash.cloudflare.com, open **R2 → your backups bucket**. Pick the newest file from before the problem started.
3. **Download it.** Click the file, then **Download**.
4. **Get the new project's database address.** In the new project, click **Connect → Session pooler**, and put your database password in it.
5. **Run the restore script** from this repository's folder (the one with `README.md` and `scripts/`), so that `scripts/restore-backup.sh` points to the script. Put the address in quotes:
   ```bash
   scripts/restore-backup.sh ~/Downloads/2026-11-22T03-00-00JST.sql.age "<database address>"
   ```
   When it asks, paste the private key from your password manager and press Enter. The key isn't shown or saved.

   The script decrypts the file into a private folder, loads it, and deletes the decrypted copy, even if something fails. If the load fails, nothing is changed, so you can fix the problem and run it again.
6. **Check the numbers.** The script ends by showing how many users, tasks and settings the database now has. Check they look right. You can also look in the new project's **Table Editor**.

### Switch the app to the new project

7. **Set up sign-in.** In the new project, open **Authentication → URL Configuration**. Set the **Site URL** to the app's Vercel link, and add the same **Redirect URLs** as the old project: `http://localhost:3000`, the Vercel link, and the preview pattern (see [README](../README.md) step 2, item 3, and step 4, items 4 and 5). Then make the other settings match the old project:
   - **Automatically expose new tables** must be off ([0012](adrs/0012-new-tables-not-exposed.md)). A new project may have it on. Supabase may ask about it when you make the project; if not, search the dashboard for "expose".
   - **Allow new users to sign up** (**Authentication → Sign In / Providers**): the same as in the old project ([0004](adrs/0004-open-sign-up.md)).
   - Anything else you changed by hand in the old project, such as email templates.
8. **Copy the new keys.** Click **Connect** and copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Put them in `.env.local`, and in Vercel under **Settings → Environment Variables**.
9. **Redeploy.** In Vercel, open **Deployments**, and on the latest one choose **Redeploy**. The app only picks up new values when it's built again.
10. **Point the backups at the new project.** On GitHub, open this repo's **Settings → Secrets and variables → Actions**, and update `SUPABASE_DB_URL` to the new project's **Session pooler** address (from step 4). Then open **Actions → Backup** and click **Run workflow**, and check it succeeds. Until you do this, the backups keep copying the old project, and once you pause the old project they fail.
11. **Tell users to sign in again.** Their accounts and tasks are back, but the app now talks to a new project, so everyone is signed out. They sign in with the same email, as before.
12. **Tidy up.** Once the app works and a backup of the new project has succeeded, pause the old project, so it doesn't use one of your two free active projects. Delete the downloaded backup file too: it's encrypted, but you don't need a second copy.

## Practise first

Try a restore on a throwaway Supabase on your Mac before you need one. It needs [Docker](https://www.docker.com/products/docker-desktop/) running.

```bash
mkdir /tmp/restore-practice && cd /tmp/restore-practice
npx supabase init
npx supabase start
```

Then follow steps 2 to 6 above, with two changes:

- **Step 4:** the address is usually `postgresql://postgres:postgres@127.0.0.1:54322/postgres`. To make sure, run `npx supabase status` in `/tmp/restore-practice` and use the **DB URL** it shows.
- **Step 5:** go back to this repository's folder first (`cd` to it), because you're still in `/tmp/restore-practice`.
- **Step 6:** for a closer look, open Supabase Studio (the local Supabase's dashboard) in your browser: usually http://127.0.0.1:54323, or the **Studio URL** that `npx supabase status` shows. It needs no sign-in. Check that **Authentication → Users** lists the right email addresses, and that **Table Editor → tasks** has task titles you recognise.

When you're done, go back to `/tmp/restore-practice` and run `npx supabase stop --no-backup` to throw the practice Supabase away.

If `npx supabase start` fails:

- **"docker: command not found":** the `docker` command isn't where your terminal looks for it. Run `docker --version` to check. To fix it, open Docker Desktop → **Settings → Advanced**, choose **User** and click **Apply & restart**, then choose **System (requires password)** and click **Apply & restart** again. Switching back and forth makes Docker Desktop put the `docker` command in `/usr/local/bin` again, even if **System** was already chosen.
- **"port is already allocated":** another project's local Supabase is running and using the same ports. Stop it with `npx supabase stop` in that project's folder. Its data is kept, and `npx supabase start` there brings it back. Don't use the stop button in Docker Desktop: it can spin forever on a Supabase project. If you don't know the folder, stop its containers by name instead, replacing `<project>` with the name Docker Desktop shows:
  ```bash
  docker stop $(docker ps -q --filter name=_<project>)
  ```

You can also make a backup file from a local Supabase, to test changes to the backup itself: `scripts/backup-dump.sh <database address> backup.sql` (it needs the Supabase CLI on your `PATH`).
