---
name: add-content
description: Add or change what the hub shows - a main project, a mini project, a post in Writing, an experience entry, a skill, or the About text. Use for requests like "add my new project", "list this tool", "feature this post", "update my experience" or "change my bio".
---

# Adding or changing hub content

Content lives in `content/`. A content change should not touch `src/`. If it seems to need
to, a field is missing from the schema in `src/content.config.ts`: add the field there and
render it, rather than hard-coding anything in a component.

## Which file

| The owner wants to… | Edit |
| --- | --- |
| Add a site of its own (a blog, a guide) | `content/projects.yaml` |
| Add a small tool or experiment | `content/minis.yaml` |
| Add a post by hand, pin one, or give one an English/Spanish summary | `content/writing.yaml` |
| Pull the newest posts from a project site | give the project a `feed` in `projects.yaml`, then `pnpm sync` |
| Change the path, focus, skills or languages | `content/experience.yaml` |
| Change the About text or the contact line | `content/about/en.md` and `content/about/es.md` |
| Change a fixed word of the interface | `src/i18n/ui.ts` |

Each file starts with a comment that explains its fields. Read it before editing.

## Rules

1. **Both languages.** Every visible text needs `en` and `es`. If the owner gives one, write the
   other yourself and tell them so they can adjust it. Keep Spanish neutral, without regional
   words. Post titles are the exception: they stay in the language of the post.
2. **The pseudonym rule** (see CLAUDE.md). No real names, employers, schools, cities, countries
   or personal handles. Describe experience by kind ("a fintech startup"), never by name. If the
   owner pastes identifying detail, anonymise it and say what you left out and why.
3. **No source-code links** on mini projects unless the owner has turned `showRepoLinks` on
   themselves. Link a tile through `url` only when there is a public page that is safe to show
   (a store listing, a live demo). A tile without a link is fine.
4. **A new project needs a colour and a glyph.** Pick a bright colour that no other project
   uses; it is only ever a fill under dark text. The build stops if it is too dark. The glyph is
   one to three characters drawn large on the card (a kanji, a number, initials).
5. **Keep it short.** A project description is two sentences at most, facts are a few words,
   a mini project is one sentence. The page has to stay scannable.
6. Order in the file is order on the page.

## Verify

1. `corepack pnpm build`. Schema problems stop the build and say which field is wrong.
2. Open `/` and `/es/` (`corepack pnpm dev`) and look at the section you changed, on a phone
   width as well. Spanish is usually longer; check that nothing wraps badly.
3. `corepack pnpm check` before calling it done.
