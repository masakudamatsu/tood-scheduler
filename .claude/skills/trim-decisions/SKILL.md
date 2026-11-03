---
name: trim-decisions
description: Remove entries from docs/decisions.md that the code already explains, and keep only choices the code can't show. Use when asked to simplify, trim, tidy or review docs/decisions.md; when a task has added or changed several entries in it; or when a change has moved a decision's reason into a code comment, so the entry now repeats the code.
---

Simplify `docs/decisions.md`. It should hold only choices that you can't see by reading the code.

For each entry, find the code it talks about and read it. Then decide:

**Remove** the entry if the code already says it: the behavior can be seen in the code, and the reason is either plain or given in a nearby comment (or in `schema.sql`, `playwright.config.ts`, `next.config.ts`). Also remove entries that are only history and no longer guide future work.

**Keep** the entry if any of these is true:
- The code shows *what* but not *why*, and without the reason someone might "fix" it. Example: done tasks still count toward a day's hours.
- It's about a setting outside the repo, such as the Supabase dashboard.
- It's something left out on purpose. Code can't show what isn't there.
- It's a rule for future work that the code can't enforce.

**Shorten** kept entries to the decision and its reason. Use plain English: everyday words, short sentences.

Don't change any code. If a reason would fit better as a one-line comment next to the code, suggest that instead of making the change.

Before editing, show a table: each entry, keep or remove, and for a removal, the file and line that already explains it. Then edit the file and suggest a commit message. Don't commit.
