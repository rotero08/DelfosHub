# DelfosT hub

The home of everything DelfosT makes: one fast static page, in English and Spanish, that links
out to the projects.

## Run it

```
corepack pnpm install
corepack pnpm dev        # local site with live reload
corepack pnpm check      # type check, build, safety checks
```

Node 22.12 or newer.

## Change what it says

Everything a visitor reads is in `content/`. Each file starts with a comment explaining its
fields, and the build tells you if one is missing or wrong.

| To… | Edit |
| --- | --- |
| add a project with its own site | `content/projects.yaml` |
| add a mini project | `content/minis.yaml` |
| add, pin or summarise a post | `content/writing.yaml` |
| refresh posts from the project sites | run `corepack pnpm sync` |
| update experience and skills | `content/experience.yaml` |
| update the About text | `content/about/en.md`, `content/about/es.md` |
| change the public address or a switch | `site.config.mjs` |

Every text needs an English and a Spanish version.

## How it is built

[Astro](https://astro.build) renders static HTML. There is no UI framework: the page is HTML
with its styles inline, four self-hosted font files and one small script. A strict Content
Security Policy is generated at build time. `CLAUDE.md` has the conventions in full.

Fonts are Barlow Condensed and Alegreya, both under the SIL Open Font License
(see `src/assets/fonts/README.md`).
