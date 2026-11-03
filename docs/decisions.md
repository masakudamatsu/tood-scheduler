# Decisions

Choices that aren't obvious from reading the code. Each entry says what we decided and why.

## Saving

- **If a save fails, the app shows an error and reloads everything from the store.** There's no undo for one change at a time. Why: one person uses the app, so saves rarely fail, and a reload is simple and always correct.
- **No server code. The browser talks to Supabase directly**, and Row Level Security (RLS) keeps each user to their own rows. Why: the simplest setup that's still safe. Don't add API routes unless a feature really needs one.

## Supabase settings (in the dashboard, not in this repo)

- **Magic-link sign-in uses the "implicit" flow.** Why: the link then works even when opened in a different browser or device. The default "PKCE" flow needs the same browser.
- **Sign-up is open.** Anyone with an email address can make an account, but RLS keeps their data apart from Masa's. Sign-ups can be turned off in the dashboard.
- **Allowed sign-in link addresses.** Supabase only sends users back to addresses listed under Authentication → URL Configuration: `http://localhost:3000` and the Vercel link. A new domain must be added there, or sign-in breaks.
- **"Automatically expose new tables" is off.** That's why `schema.sql` needs a `grant` line for each table.
- **Supabase's built-in email service sends only a few emails per hour.** Fine for one user. Set up custom SMTP (a separate email-sending service) if more people use the app.

## Hours and the daily limit

- **Done tasks still count toward a day's hours.** Why: the hours show how much was planned for that day. Finishing a task doesn't make the day lighter.

## Drag and drop

- **A copy of the card follows the pointer (`DragOverlay`).** Why: without it, a dragged card could slide underneath other days on screen.

## Testing

- **Tests check class names (for example `border-red-500`), not colors.** Why: Tailwind 4 outputs colors in `oklch()`, which makes color values awkward to compare.

## Left out on purpose

- **A different limit for each day.** One limit for all days keeps the app small.
- **Link previews in notes.**