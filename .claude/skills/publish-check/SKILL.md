---
name: publish-check
description: Run before the hub is committed, pushed or deployed, or when asked whether the site is safe or ready to publish. Covers the privacy scan, image metadata, the security policy, page weight, and what to look at by hand.
---

# Before publishing

## 1. Run the checks

```
corepack pnpm check
```

It type-checks, builds, and then runs `scripts/check.mjs`. What a failure means:

| Message | What to do |
| --- | --- |
| `contains private term N` | Something identifying got in. Open the file, remove it, and do not repeat the term in your reply. If it is in git history, stop and tell the owner: history needs rewriting before anything is pushed. |
| `private terms: SKIPPED` | The private list is missing on this machine. Tell the owner; do not create it from guesses. |
| `carries exif/xmp/iptc metadata` | Re-encode the image with sharp (as `scripts/make-images.mjs` does) or export it again without metadata. |
| `has a style attribute` / `inline event handler` | Move the styling to a class, or draw a content colour as an SVG `fill`. |
| `loads … from another site` | Self-host the resource, or justify it and allow it in `security.csp`. |
| `dist/_headers … not written` | Build with `pnpm build`, not `astro build` alone. |
| a weight warning | Find what grew before accepting it. |

## 2. Check what a script cannot

- `git config user.name` and `user.email` are the pseudonymous identity, not a personal one.
- `site.config.mjs`: `url` is the real public address. Canonical links, the sitemap and social
  previews are built from it.
- New text: does any sentence narrow down who the owner is (an employer, a school, a city, an
  exact date range, a rare combination of facts)? When unsure, make it vaguer and say so.
- New links: follow each one. A page the hub links to can reveal what the hub does not, for
  example a profile page with a name on it.
- New images: screenshots can show names in browser tabs, avatars, file paths or terminal
  prompts.

## 3. Look at the built site

`corepack pnpm preview`, then `/`, `/es/` and an address that does not exist (the 404 page), in
both themes. Open the browser console: a line mentioning "Content Security Policy" means
something is being blocked and must be fixed, not allowed away.

## 4. Report

Say what passed, what you fixed, and anything you could not verify. Never describe a check as
passing if it was skipped.
