# To Do Scheduler

Plan what to do each day without overloading yourself.

- Days are listed top to bottom, like Google Calendar's Schedule view.
- To add a task, press the round **+** button at the bottom right. Fill in the pop-up and press **Save**. Press **Cancel** or tap outside the pop-up to stop.
- Tick a task's checkbox when it's done.
- Add a note when you create a task, or tap a task later to see or change its note. Any `https://…` you paste becomes a clickable link.
- To delete a task, tap it and press **Delete**. The app asks first, so a stray tap won't lose anything.
- Give each task a date and estimated hours. If a day's hours go over your daily limit (8 by default, set in the top bar), that day gets a red border.
- Drag a task card to another day to move it. On a phone, press and hold the card for a moment, then drag.
- Drag a task card up or down within a day to change its order. Drop it onto a card in another day to put it at that exact spot.

Built with Next.js, Tailwind CSS and Supabase. Deployed on Vercel.

---

## 1. Try it right away (no setup)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase keys the app runs in **local mode**: tasks are saved in this browser only, and there is no sign-in. It's handy for a first look.

## 2. Connect Supabase (about 5 minutes)

1. Go to https://supabase.com, sign up, and click **New project**. Pick any name, set a database password, and pick the region closest to you.
2. When the project is ready, open **SQL Editor → New query**, paste everything in `supabase/schema.sql`, and click **Run**. (If you ran an older copy of this file before, run it again. It's safe to re-run, and it adds the column that stores each task's order.) This creates the `tasks` and `settings` tables. It also turns on Row Level Security, a database rule that lets each signed-in person see only their own rows.
3. Open **Authentication → URL Configuration**:
   - **Site URL:** `http://localhost:3000` for now (change it to your Vercel link at Step 4 Item 4 below).
   - **Redirect URLs:** add `http://localhost:3000`. Later, add your Vercel links at Step 4 Items 4 and 5 below.

   Supabase only sends a sign-in link back to an address on this list. If an address is missing, there's no error: the link quietly sends you to the Site URL instead. So whenever you use a new address, add it here.
4. Click **Connect** at the top of the project. Copy the two lines it shows: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. (The publishable key is safe to use in the browser. It replaces what Supabase used to call the "anon" key.)
5. In this folder, copy `.env.local.example` to `.env.local` and paste in the two values.
6. Restart `npm run dev`. You'll now see a sign-in screen. Enter your email, open the link Supabase emails you (on any device), and you're in. See [docs/adrs/0003](docs/adrs/0003-implicit-sign-in-flow.md).

> Supabase's built-in email service sends only two emails per hour. That's fine for one person. If you hit the limit, wait an hour. For more people, set up custom SMTP (a separate email-sending service). See [docs/adrs/0011](docs/adrs/0011-built-in-email-service.md).

> Supabase's **Automatically expose new tables** setting is off in this project. So the browser can only reach a table after a `grant` line opens it to signed-in users. That's why `supabase/schema.sql` has one for each table. If you add a table, add its `grant` line too. See [docs/adrs/0012](docs/adrs/0012-new-tables-not-exposed.md).

> Optional: after your first sign-in, you can stop strangers from making accounts. Go to **Authentication → Sign In / Providers** and turn off **Allow new users to sign up**. Even if you leave it on, nobody can see your tasks. See [docs/adrs/0004](docs/adrs/0004-open-sign-up.md).

## 3. Run the tests

```bash
npx playwright install chromium   # first time only
npm test
```

There's one Playwright test per feature, in `tests/`. Tests start their own server in local mode on port 3100, so they never touch your real tasks and don't need Supabase.

`npm run verify` runs every check in one go: lint (a style and mistake checker), the type check and the tests. GitHub runs the same command on every pull request and every push to `main`.

Before each commit, a hook (a script Git runs for you) checks lint and types. `npm install` turns it on. To skip it once, use `git commit --no-verify`.

## 4. Deploy to Vercel (about 5 minutes)

1. Push this folder to GitHub:
   1. On GitHub, create a new repository named `todo-scheduler`. Leave it **empty**: don't add a README, license or .gitignore, or they'll clash with this folder.
   2. Pick the address that matches how your computer signs in to GitHub. In the commands below, replace `<your-username>` (including the angle brackets) with your GitHub username.
      - **You've set up an SSH key with GitHub** (a key pair: one half on your computer, the other half saved in GitHub's settings). Use the SSH address:
        ```bash
        git remote add origin git@github.com:<your-username>/todo-scheduler.git
        ```
      - **You haven't, or you aren't sure.** Use the HTTPS address:
        ```bash
        git remote add origin https://github.com/<your-username>/todo-scheduler.git
        ```
        GitHub doesn't accept your account password here, so set up a sign-in first. The easiest way is GitHub's command-line tool: install it from https://cli.github.com, run `gh auth login`, and choose **HTTPS** when it asks. Alternatively, when `git push` asks for a password, paste a personal access token (a password-like code you create on GitHub under **Settings → Developer settings → Personal access tokens**).
   3. Push:
      ```bash
      git push -u origin main
      ```
   If you typed the wrong address, fix it with `git remote set-url origin <correct-address>`, then check it with `git remote -v`.

   After this first push, protect `main`: this project expects every change to reach `main` through a pull request. On GitHub, open your repository's **Settings → Branches**, add a rule for `main`, and turn on **Require a pull request before merging**. From then on, pushing straight to `main` fails. See [docs/adrs/0010](docs/adrs/0010-main-is-protected.md).
2. On https://vercel.com, click **Add New → Project** and import the repository.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the same values as in `.env.local`. Click **Deploy**.
4. Copy your new link (for example `https://todo-scheduler-xyz.vercel.app`). Back in Supabase **Authentication → URL Configuration**, set it as the **Site URL** and add it to **Redirect URLs**.
5. To sign in on preview deployments too (the test links Vercel makes for each branch), also add `https://<project-name>-*-<your-vercel-account>.vercel.app/**` to **Redirect URLs**. The `*` matches any branch name. Without this, the sign-in link sends you to the Site URL instead.

## 5. Backups

The free Supabase plan has no backups you can download. So a GitHub workflow saves the whole database after every merge to `main` and once a day. It encrypts the file and uploads it to a private Cloudflare R2 bucket (Cloudflare's file storage). Each file is deleted 90 days after upload.

GitHub turns off scheduled workflows in a public repo after 60 days with no activity. The backup after each merge still runs.

The workflow runs only in the original repo, not in copies of it. To get the data back from a backup, see [docs/restore-backup.md](docs/restore-backup.md).

## Project layout

| Path | What's in it |
| --- | --- |
| `src/components/Scheduler.tsx` | The main screen: loads tasks, handles drag and drop |
| `src/components/DaySection.tsx` | One day: total hours and the red border |
| `src/components/TaskCard.tsx` | One task card: checkbox and drag handle |
| `src/components/TaskSheet.tsx` | Task details pop-up, with Save, Cancel and Delete |
| `src/components/AddTaskPopup.tsx` | The **+** button and the new task pop-up it opens |
| `src/components/Popup.tsx` | The pop-up frame shared by the two pop-ups above |
| `src/components/TaskFields.tsx` | Title, date, hours and note: shared by the two pop-ups above |
| `src/lib/linkify.tsx` | Turns URLs in notes into links |
| `src/lib/store/` | Saving data: `supabase.ts` (real) and `local.ts` (browser only) |
| `supabase/schema.sql` | Database tables and access rules |
| `tests/` | Playwright tests, one per feature |
| `.githooks/pre-commit` | Checks lint and types before each commit |
| `.github/workflows/ci.yml` | Runs `npm run verify` on GitHub |
| `.github/workflows/backup.yml` | Backs up the database to Cloudflare R2 |
| `scripts/backup-dump.sh` | Dumps the database for the backup |

## Not built yet

Repeating tasks, reminders, undo, a different limit for each day, and link previews.
