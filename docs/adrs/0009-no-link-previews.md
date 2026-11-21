# 0009: No link previews in notes

- **Status:** accepted
- **Date:** 2026-11-03

## Context

URLs in a task's note become clickable links (see [linkify.tsx](../../src/lib/linkify.tsx)). Some apps also show a preview of the linked page, with its title and image.

## Decision

We won't show link previews. A link stays plain text the user can click.

## Consequences

- No server code is needed to fetch other web pages (see [0002](0002-no-server-code.md)).
- The user sees only the URL, not what the page is about.

**Revisit if:** the user can't tell links in a note apart and wants titles to show.
