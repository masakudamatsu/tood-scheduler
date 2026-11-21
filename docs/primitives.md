# Building blocks

The main parts of the app, where each one lives, and the decision records (in [adrs/](adrs/)) that shape it. [CLAUDE.md](../CLAUDE.md) says how to use and update this list.

## Data

- **Types**: [src/lib/types.ts](../src/lib/types.ts). What a task looks like, what every store must do, and the default daily limit.
  - adrs: [0008](adrs/0008-one-limit-for-all-days.md)
- **Task store**: [src/lib/store/](../src/lib/store/). Saves tasks and the daily limit. [index.ts](../src/lib/store/index.ts) picks one of two stores: [local.ts](../src/lib/store/local.ts) (this browser only, used by the tests) or [supabase.ts](../src/lib/store/supabase.ts).
  - adrs: [0002](adrs/0002-no-server-code.md)
- **Supabase client**: [src/lib/supabaseClient.ts](../src/lib/supabaseClient.ts). Connects to Supabase and decides whether the app runs in local mode.
  - adrs: [0002](adrs/0002-no-server-code.md), [0003](adrs/0003-implicit-sign-in-flow.md)
- **Database tables and access rules**: [supabase/schema.sql](../supabase/schema.sql).
  - adrs: [0002](adrs/0002-no-server-code.md), [0012](adrs/0012-new-tables-not-exposed.md)
- **Dates**: [src/lib/dates.ts](../src/lib/dates.ts). Working with dates, and which days to show.
  - adrs: []

## Screens and parts of the screen

- **App**: [src/components/App.tsx](../src/components/App.tsx). Shows the sign-in screen or the scheduler.
  - adrs: []
- **Sign-in screen**: [src/components/Login.tsx](../src/components/Login.tsx). Asks for an email and sends a magic link.
  - adrs: [0003](adrs/0003-implicit-sign-in-flow.md), [0004](adrs/0004-open-sign-up.md), [0011](adrs/0011-built-in-email-service.md)
- **Scheduler**: [src/components/Scheduler.tsx](../src/components/Scheduler.tsx). The main screen: loads and saves tasks, lists the days, and handles drag and drop.
  - adrs: [0001](adrs/0001-reload-after-failed-save.md), [0006](adrs/0006-drag-overlay.md)
- **DaySection**: [src/components/DaySection.tsx](../src/components/DaySection.tsx). One day's tasks, their total hours, and the red border when the day is overloaded.
  - adrs: [0005](adrs/0005-done-tasks-count-toward-hours.md), [0008](adrs/0008-one-limit-for-all-days.md)
- **TaskCard**: [src/components/TaskCard.tsx](../src/components/TaskCard.tsx). One task with its checkbox.
  - adrs: [0006](adrs/0006-drag-overlay.md)
- **Daily limit input**: [src/components/MaxHoursInput.tsx](../src/components/MaxHoursInput.tsx). Where the user sets the maximum hours per day.
  - adrs: [0008](adrs/0008-one-limit-for-all-days.md)
- **Popups**: [Popup.tsx](../src/components/Popup.tsx) (the shared popup), [AddTaskPopup.tsx](../src/components/AddTaskPopup.tsx) (the new task popup), [TaskSheet.tsx](../src/components/TaskSheet.tsx) (edit or delete a task) and [TaskFields.tsx](../src/components/TaskFields.tsx) (the fields both popups share).
  - adrs: []
- **Links in notes**: [src/lib/linkify.tsx](../src/lib/linkify.tsx). Turns URLs in a note into links.
  - adrs: [0009](adrs/0009-no-link-previews.md)

## Checks

- **Tests**: [tests/](../tests/). Playwright tests, one per feature.
  - adrs: [0007](adrs/0007-tests-check-class-names.md)
- **Pre-commit hook**: [.githooks/pre-commit](../.githooks/pre-commit). Runs lint and the type check before each commit.
  - adrs: [0013](adrs/0013-pre-commit-hook.md)
