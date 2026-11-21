# 0003: Magic-link sign-in uses the implicit flow

- **Status:** accepted
- **Date:** 2026-11-03

## Context

Users sign in with a magic link: Supabase emails a link, and opening it signs the user in. Supabase's default flow, PKCE, only works if the link is opened in the same browser that asked for it. People often ask for the link on one device and open the email on another. The setting is `flowType` in [supabaseClient.ts](../../src/lib/supabaseClient.ts).

## Decision

Magic-link sign-in uses the "implicit" flow, so the link works in any browser or device.

## Consequences

- Sign-in works wherever the user opens the email.
- The implicit flow puts the sign-in token in the address bar for a moment. That's a little less safe than PKCE.

**Revisit if:** Supabase drops the implicit flow, or PKCE starts working across browsers and devices.
