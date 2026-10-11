---
name: change-design
description: Change how the hub looks or behaves - colours, type, spacing, layout, the hero scene, hover and focus effects, animation, a new section or component. Use for any visual or interaction request on the hub.
---

# Changing the design

Read the "Conventions" section of CLAUDE.md first. The direction is a game command menu under a
painted sky, and its first rule is that clarity wins over decoration.

## Before writing CSS

- **Colour:** use a token from the top of `src/styles/global.css`. If a new one is needed, add
  it to both the night block and the day block and check its contrast (4.5:1 for text, 3:1 for
  large display type and for shapes that carry meaning).
- **Type:** Barlow Condensed for names, headings and labels (`.display`, `.label`), Alegreya for
  anything read as a sentence. Do not add a third family or a new weight file without a strong
  reason: each one is a download.
- **Selection:** hover and keyboard focus use the slab (a `--slab` block with a slanted edge,
  text switching to `--on-slab`), as in `Menu.astro` and `Writing.astro`. Cards lift off a hard
  shadow. Reuse these before inventing another effect.
- **A new section** gets an entry in `sections` and both `nav` and `hint` texts in
  `src/i18n/ui.ts`, a component in `src/components/` that starts with `<SectionHead>`, and a
  line in `Home.astro`. The header, hero menu and overlay menu pick it up from `sections`.

## Constraints that will bite

- No `style="…"` attributes and no inline event handlers: the security policy blocks them and
  `pnpm check` fails. Colours that come from content are SVG `fill` attributes.
- The policy is not active in `pnpm dev`. Anything involving scripts, inline styles or outside
  resources must be tested on the built site (`pnpm build`, `pnpm preview`).
- Keep `animation-timeline` in its own rule, apart from the `animation` shorthand.
- Decorative graphics are `aria-hidden` and must never sit behind text they could weaken.
- Motion belongs inside `@media (prefers-reduced-motion: no-preference)`.
- Component styles are scoped. To style something from a theme selector on `<html>`, use
  `:global(...)` for that part, as `Header.astro` does.

## Verify by looking

A design change is not done until it has been seen. Check each of these on the built site:

1. `/` and `/es/`.
2. Night and day (the switch in the bar).
3. 360px, 390px, 768px and 1440px wide. No horizontal scrolling at any of them.
4. Keyboard: tab through the change; focus must always be visible. Arrow keys move inside the
   command menus.
5. Reduced motion on: nothing essential may depend on an animation.
6. `corepack pnpm check`, and read the weight line it prints.

If the change affects the name, the colours or the scene, run `corepack pnpm images` so the
social card and icons match (`scripts/og/template.html` mirrors the hero by hand).
