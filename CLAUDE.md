# To Do Scheduler

To Do Scheduler is a web application to help the user plan and remember what to do each day **without overloading themselves with too many tasks**. 

## Features

Specifically, the app has the following features:
1. The user sees the list of "what to do" each day by scrolling down, just like Google Calendar mobile app's "Schedule" view.
2. Each "what to do" has a checkbox. The user ticks it when the "what to do" is done.
3. The user can tap each "what to do" to see a note associated with it. If the user pastes an URL onto the note, the URL automatically become a link so that the user can later click it to see the associated pieces of information on the task on an external webpage.
4. The user can add a date to each "what to do". The user can also add an estimated number of hours to complete it. The user sets the maximum number of hours for "what to do" each day (8 hours by default). If the total number of hours of "what to do" on a date exceeds the maximum number of hours, the list of "what to do" on that date is bordered with a red rectangle. This way, the user can notice his/her schedule overloaded with what to do on some dates. **This is the core feature of To Do Scheduler that we can never compromise on.**
5. The user can drag and drop "what to do" (represented as a card) to a different date so that the change of a date will be easy.

## Rules for every task

Decisions that the code doesn't explain are in @docs/decisions.md. Read it before changing behavior, and add an entry when a task involves a choice like that. **Don't add an entry if the code already says it.** If a short code comment can hold the reason, write the comment instead.

- **Tests first.** For a new feature or a bug fix, write a Playwright test that fails (or update the existing tests so they fail with the current codebase), then write the code to make it pass. Finish only when `npm test`, `npm run lint` and `npx tsc --noEmit` all pass. Tests must never need Supabase or a network connection.
- **Adding a field to a task** means updating all of these together:
  1. `src/lib/types.ts`
  2. `src/lib/store/local.ts`, with a default for data saved before the field existed
  3. `COLUMNS` and `normalize()` in `src/lib/store/supabase.ts`
  4. `supabase/schema.sql`: the `create table`, plus an `alter table ... add column if not exists` line for existing databases
- **Keep `supabase/schema.sql` safe to run again** (`if not exists`, `drop policy if exists`, …). A new table needs RLS turned on, policies, and a `grant ... to authenticated` line.
- **Tell Masa when the database must be updated.** If `schema.sql` changes, he needs to run it again in Supabase's SQL Editor.
- **Plain English** in the README, docs, UI text and explanations: everyday words, short sentences. Define a technical term once when you need it.
- **Update the README** when a feature changes what the user sees.

## Git

- One branch per task.
- Don't commit or push unless Masa asks. When a task is done, suggest a commit message instead.
- If the task comes from a GitHub issue, include `Fixes #<number>` in the commit message or pull request. Use `gh` to read and create issues.
