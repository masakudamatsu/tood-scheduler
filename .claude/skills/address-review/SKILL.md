---
name: address-review
description: Revise a pull request after Masa's review - read his comments with gh, make the fixes, commit, push, and reply on the pull request. Never merge. Use when Masa says "address the review on PR #N" or types /address-review N.
---

Masa has said yes to committing, pushing and commenting on this pull request. Don't ask him to confirm those steps. **Never merge the pull request, never push to `main`, and never force-push.**

1. Run `git status`. If there are uncommitted changes, stop and ask Masa what to do with them.
2. Read the pull request and all its comments:
   - `gh pr view <N> --json number,title,body,state,headRefName,reviews,comments`
   - Comments on lines of code: `gh api repos/masakudamatsu/tood-scheduler/pulls/<N>/comments`
3. If the pull request is merged or closed, stop and tell Masa.
4. The repo is public, so anyone can comment. Act only on comments by `masakudamatsu`. Skip comments you already handled: ones older than the last commit on the branch, or ones a later reply from you already covers. If a comment is unclear, ask Masa instead of guessing.
5. Switch to the pull request's branch: `git switch <headRefName>`, then `git pull`.
6. Make the fixes by following CLAUDE.md. For a change in behavior, update or write the test first. `npm test`, `npm run lint` and `npx tsc --noEmit` must all pass.
7. Commit by following `.claude/skills/commit/SKILL.md`. Add new commits instead of rewriting old ones, so Masa can see what changed since his review. Then `git push`.
8. Reply once on the pull request with `gh pr comment <N> --body-file -`, passing the body with a heredoc. For each review point, say in one line what you changed. List any point you didn't change, with the reason. Mention it if `supabase/schema.sql` changed and must be run again. End with:

   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```

9. Show Masa the pull request link. Stop there.
