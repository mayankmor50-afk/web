# design-sync notes

## Scope

This repo is a one-off Next.js marketing site, not a design system — most components
(3D/GSAP/canvas/audio effects, page-assembly components) are page-specific and can't
render as static preview cards. Scoped to 5 reusable components with real prop APIs
(user decision, 2026-07-08): `SkipLink`, `MagneticNavLink`, `PhaseSlider`, `BookingLink`,
`MobileNav`. `BookingHoverMenu`/`ScheduleLink` are bundled transitively (BookingLink and
PhaseSlider both wrap BookingHoverMenu) but not registered as separate DS components —
they're the same component under different default props.

## No build / no dist — synth entry via `cfg.entry`

This repo has no package build (`private: true`, no `main`/`module`/`exports`). Rather
than let the converter's synth-entry fallback scan the whole `srcDir` (which would pull
in every file under `components/`, including the unscoped effects), `.design-sync/entry.mjs`
hand-picks exactly the 5 scoped components via `@/` alias re-exports, and `cfg.entry`
points the converter at it directly. `cfg.componentSrcMap` pins each name to its real
source path (used for JSDoc/grouping enrichment only, independent of the entry file).

## Next.js coupling — forked `lib/bundle.mjs`

3 of the 5 components (`PhaseSlider` via `SceneImage`/`ScheduleLink`, `BookingLink` via
`BookingHoverMenu`, `MobileNav` via `BookingLink`) import `next/link`, `next/navigation`
(`usePathname`), and `next/image`. These only work inside a mounted Next.js app-router
tree, which the preview bundle doesn't have — `usePathname()` throws outside it. Forked
`.design-sync/overrides/bundle.mjs` (declared in `cfg.libOverrides`) extends the existing
`reactShim` esbuild plugin to stub all three with plain DOM equivalents (`<a>`, a no-op
`usePathname`/`useRouter`/`useSearchParams`, and `<img>`). Same fork also `define`s
`process.env.NEXT_PUBLIC_CONTACT_EMAIL`/`LINKEDIN_URL`/`BOOKING_URL` as empty strings —
`lib/contact.ts` and `lib/booking.ts` read these at module scope, and `process` isn't a
browser global, so without the define the whole bundle throws on load. Empty string is
correct here — real contact/booking targets shouldn't be baked into a shared DS bundle
anyway. Net effect: `BookingHoverMenu`'s menu renders with just the "View audit details"
link (email/LinkedIn/Cal.com items depend on those env vars being live).

## Compiled CSS — no Tailwind JIT available to the converter

`app/globals.css` uses Tailwind v4 (`@import 'tailwindcss'`, `@theme inline`,
`@custom-variant`) — a plain esbuild CSS loader can't JIT-compile the utility classes
or reliably parse those at-rules. Instead, `cfg.cssEntry` points at a **compiled** CSS
chunk captured from a real `pnpm run build`, mirrored (with its `../media/*.woff2` font
files) into `.design-sync/.cache/next-css/` so the path is stable across rebuilds
(Next content-hashes the real chunk filename). `cfg.buildCmd` documents the full
capture command — re-run it before re-syncing whenever component styles change.

**Re-sync risk**: `.design-sync/.cache/` is gitignored (regenerated, per the durable-set
rule), so a fresh clone must run `cfg.buildCmd` before the converter, not just `pnpm run
build`. If `next build`'s CSS chunking strategy ever changes (e.g. splits into multiple
chunks), the `ls -t .next/static/chunks/*.css | head -1` in `buildCmd` may grab the wrong
file — verify with `grep phase-slider__picker` on the copied file after re-running.

## Known render warns (accepted)

- `[FONT_MISSING]`: "Instrument Sans", "JetBrains Mono", "Instrument Serif" — these are
  unused theme leftovers (`@theme inline`'s `--font-sans`/`--font-mono`/`--font-display`
  tokens, distinct from the actual `.font-display`/`.font-body` custom classes our
  components use, which resolve to `--font-playfair`/`--font-dm-sans` and ARE shipped).
  Verified: no selector reachable from the 5 scoped components references the unused
  tokens. User accepted as a non-issue, 2026-07-08.
- `[RENDER_SKIPPED]` (resolved 2026-07-09): the 2026-07-08 sync skipped Playwright and
  reviewed `.review.html` manually instead. This re-sync installed playwright + chromium
  into `.ds-sync/node_modules` (gitignored — reinstall on a fresh clone: `pnpm add
  playwright` inside `.ds-sync/`, then `node node_modules/playwright/cli.js install
  chromium`) and ran the full automated render check for the first time: 5/5 previews
  render cleanly, contact sheet confirms all 5 look correct. Treat this as the verified
  baseline going forward, not a one-off.

## Previews (authored 2026-07-08, all 5 components)

- `SkipLink`: 1 cell — real hidden-until-focus resting state (can't statically show
  `:focus-visible`).
- `MagneticNavLink`: 1 cell — real header nav content ("Results"/"Process"/"The offer",
  ported from `components/landing/home-page.tsx`).
- `PhaseSlider`: 1 cell — phase content is internal data (`lib/audit-content.ts`), not a
  prop, so there's no variant axis to sweep and no way to advance past the initial tab
  statically. `cardMode: column` override (wide component). Photos are absolute
  `/images/*.jpg` site assets, not part of this bundle — expect broken images in the
  card; layout/copy/CTA are still real and correct.
- `BookingLink`: 4 cells sweeping `variant` (link/primary/outline/ghost), matching real
  usage in `home-page.tsx`. The hover-opened contact panel has no `open` prop, so only
  the resting trigger is shown for each variant (same limitation as any `:hover` state).
- `MobileNav`: 1 cell — forced `open`, `cardMode: single` + fixed viewport override
  (renders `null` when closed, so that's the only meaningful static state).

Grading: user chose to eyeball `ds-bundle/.review.html` directly in a browser rather
than install Playwright for automated screenshot grading (2026-07-08) — approved for
upload after manual review. No `.grade.json` files exist; a future re-sync that installs
Playwright will grade these for the first time then, not carry forward a prior grade.

## Re-sync risks

- **`.design-sync/.cache/next-css/`** is gitignored and machine-generated by
  `cfg.buildCmd` — a fresh clone MUST run `cfg.buildCmd` (not just `pnpm run build`)
  before the converter, or `cfg.cssEntry` points at a missing file. If Next's build ever
  changes its CSS chunking (currently one chunk under `.next/static/chunks/*.css`), the
  `ls -t ... | head -1` in `buildCmd` may grab the wrong file — verify by grepping the
  copied file for `phase-slider__picker` after rebuilding.
- **Playwright/chromium live only in `.ds-sync/node_modules`**, which is gitignored —
  every fresh clone needs `pnpm add playwright` (inside `.ds-sync/`) + `node
  node_modules/playwright/cli.js install chromium` before the render check can run for
  real again, otherwise it silently falls back to `[RENDER_SKIPPED]`.
- **`PhaseSlider` is content-coupled**: `PARTNERSHIP_PHASES` (headlines/copy/images) is
  hardcoded in `lib/audit-content.ts`, not passed as a prop. Every design built with this
  component will show the same fixed Chetna-specific phase content — it's not a generic
  reusable slider despite the generic name. If this ever changes upstream (data becomes
  a prop), `dtsPropsFor.PhaseSlider` and the preview need updating together.
- **Next.js stubs are permanent, not a workaround to remove later**: `next/link`,
  `next/navigation`, `next/image` are stubbed in the forked `bundle.mjs` because the
  preview/build environment has no app-router context — this isn't specific to today's
  Playwright-less run, it's true for any future sync of these components too.
