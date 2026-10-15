# To Do Scheduler

Plan what to do each day without overloading yourself.

- Days are listed top to bottom, like Google Calendar's Schedule view.
- Tick a task's checkbox when it's done.
- Tap a task to see its note. Any `https://…` you paste becomes a clickable link.
- Give each task a date and estimated hours. If a day's hours go over your daily limit (8 by default, set in the top bar), that day gets a red border.
- Drag a task card to another day to move it. On a phone, press and hold the card for a moment, then drag.

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
2. When the project is ready, open **SQL Editor → New query**, paste everything in `supabase/schema.sql`, and click **Run**. This creates the `tasks` and `settings` tables. It also turns on Row Level Security, a database rule that lets each signed-in person see only their own rows.
3. Open **Authentication → URL Configuration**:
   - **Site URL:** `http://localhost:3000` for now (change it to your Vercel link after step 4).
   - **Redirect URLs:** add `http://localhost:3000`. Add your Vercel link later too.
4. Click **Connect** at the top of the project (or go to **Project Settings → API**). Copy the **Project URL** and the **anon public** key.
5. In this folder, copy `.env.local.example` to `.env.local` and paste in the two values.
6. Restart `npm run dev`. You'll now see a sign-in screen. Enter your email, open the link Supabase emails you, and you're in.

> Supabase's built-in email service only sends a few emails per hour. That's fine for one person. If you hit the limit, wait an hour.

> Optional: after your first sign-in, you can stop strangers from making accounts. Go to **Authentication → Sign In / Providers** and turn off **Allow new users to sign up**. Even if you leave it on, nobody can see your tasks.

## 3. Run the tests

```bash
npx playwright install chromium   # first time only
npm test
```

There's one Playwright test per feature, in `tests/`. Tests start their own server in local mode on port 3100, so they never touch your real tasks and don't need Supabase.

## 4. Deploy to Vercel (about 5 minutes)

1. Create an empty repository on GitHub, then push this folder:
   ```bash
   git remote add origin https://github.com/YOUR-NAME/todo-scheduler.git
   git push -u origin main
   ```
2. On https://vercel.com, click **Add New → Project** and import the repository.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the same values as in `.env.local`. Click **Deploy**.
4. Copy your new link (for example `https://todo-scheduler-xyz.vercel.app`). Back in Supabase **Authentication → URL Configuration**, set it as the **Site URL** and add it to **Redirect URLs**.

## Project layout

| Path | What's in it |
| --- | --- |
| `src/components/Scheduler.tsx` | The main screen: loads tasks, handles drag and drop |
| `src/components/DaySection.tsx` | One day: total hours and the red border |
| `src/components/TaskCard.tsx` | One task card: checkbox and drag handle |
| `src/components/TaskSheet.tsx` | Task details: date, hours and note |
| `src/lib/linkify.tsx` | Turns URLs in notes into links |
| `src/lib/store/` | Saving data: `supabase.ts` (real) and `local.ts` (browser only) |
| `supabase/schema.sql` | Database tables and access rules |
| `tests/` | Playwright tests, one per feature |

## Not built yet

Repeating tasks, reminders, undo, a different limit for each day, and link previews.
