# Building blocks

The main parts of the app, where each one lives, and the decision records (in [adrs/](adrs/)) that shape it.

- **Use an existing block** instead of writing a new one that does the same job.
- **Before you change a block, read the records listed under it.**
- **Keep this list up to date.** A pull request that adds or reshapes a building block, or adds or changes a record in [adrs/](adrs/), updates this list in the same pull request.

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
- **Popups**: [Popup.tsx](../src/components/Popup.tsx) (`Modal`, the native dialog under every popup, and `Popup`, the shared popup form), [AddTaskPopup.tsx](../src/components/AddTaskPopup.tsx) (the new task popup), [TaskSheet.tsx](../src/components/TaskSheet.tsx) (edit or delete a task) and [TaskFields.tsx](../src/components/TaskFields.tsx) (the fields both popups share).
  - adrs: [0031](adrs/0031-baseline-widely-available.md), [0033](adrs/0033-popups-use-native-dialog.md)
- **Links in notes**: [src/lib/linkify.tsx](../src/lib/linkify.tsx). Turns URLs in a note into links.
  - adrs: [0009](adrs/0009-no-link-previews.md)

## Checks

- **Tests**: [tests/](../tests/). Playwright tests, one per feature. [playwright.config.ts](../playwright.config.ts) picks the browsers they run in.
  - adrs: [0007](adrs/0007-tests-check-class-names.md), [0032](adrs/0032-test-in-chrome-and-iphone-webkit.md)
- **Pre-commit hook**: [.githooks/pre-commit](../.githooks/pre-commit). Runs lint and the type check before each commit.
  - adrs: [0013](adrs/0013-pre-commit-hook.md)
- **CodeRabbit review**: [.coderabbit.yaml](../.coderabbit.yaml). An AI reviewer that comments on every pull request into `main` and checks it against the rules for agents.
  - adrs: [0026](adrs/0026-coderabbit-reviews-pull-requests.md), [0027](adrs/0027-modern-web-guidance-skill.md)
- **Skill updates**: [.github/workflows/update-skills.yml](../.github/workflows/update-skills.yml) and [scripts/update-skills.sh](../scripts/update-skills.sh). Once a week, updates the skills from other people that the workflow names, and opens a pull request.
  - adrs: [0027](adrs/0027-modern-web-guidance-skill.md), [0028](adrs/0028-weekly-skill-updates.md), [0029](adrs/0029-schedules-avoid-minute-zero.md)

## Backups

- **Backup workflow**: [.github/workflows/backup.yml](../.github/workflows/backup.yml) and [scripts/backup-dump.sh](../scripts/backup-dump.sh). Saves the whole database, encrypted, to Cloudflare R2.
  - adrs: [0020](adrs/0020-backups-in-cloudflare-r2.md), [0021](adrs/0021-r2-account-api-token.md), [0022](adrs/0022-backups-encrypted-with-age.md), [0023](adrs/0023-backups-kept-90-days.md), [0024](adrs/0024-backup-includes-auth-users.md), [0025](adrs/0025-backup-times-in-japan-time.md), [0029](adrs/0029-schedules-avoid-minute-zero.md)
- **Restore script**: [scripts/restore-backup.sh](../scripts/restore-backup.sh). Loads a backup file into an empty database. How to use it: [restore-backup.md](restore-backup.md).
  - adrs: [0022](adrs/0022-backups-encrypted-with-age.md), [0024](adrs/0024-backup-includes-auth-users.md)

## Rules for agents

- **Agent rules**: [AGENTS.md](../AGENTS.md) (rules for every task), [CLAUDE.md](../CLAUDE.md) (only imports AGENTS.md) and [.agents/skills/](../.agents/skills/) (rules and steps for only some tasks, with a symlink to each in `.claude/skills/`). One skill, `modern-web-guidance`, comes from Google Chrome and isn't edited here.
  - adrs: [0014](adrs/0014-every-decision-gets-a-record.md), [0016](adrs/0016-docs-not-what-code-says.md), [0017](adrs/0017-claude-md-imports-agents-md.md), [0018](adrs/0018-rules-for-some-tasks-in-skills.md), [0019](adrs/0019-skills-in-agents-folder.md), [0027](adrs/0027-modern-web-guidance-skill.md), [0030](adrs/0030-commit-type-by-what-changes-in-the-app.md), [0031](adrs/0031-baseline-widely-available.md)
