## Setup

No provider or theme wrapper is required. Just include the bundled `styles.css` (or
whatever your host renders through) — every component's look is baked into its own
class rules, not injected by context.

`BookingLink` and `MobileNav` render plain `<a>`/`<button>` elements internally (not a
router-aware `<Link>`) and `PhaseSlider`'s images render as plain `<img>` (not an
optimized image component) — this bundle has no app-router/image-optimizer runtime to
attach to, so build around them as ordinary anchors/images, not Next.js primitives.

## Styling idiom

No CSS custom properties and no utility classes here — every component ships its own
hand-authored BEM-style class rules with the brand colors hardcoded directly (not
theme-driven). Don't try to retheme a component via props or CSS variables; instead
match its palette when building the surrounding layout:

| Color | Hex |
|---|---|
| Background (darkest) | `#0C0B09` |
| Cream (primary text) | `#E8E2D9` |
| Amber (accent/CTA) | `#B8873A` |
| Muted text | `#9A9590` |
| Dim text | `#6B6560` |

Two shared utility classes carry the two brand typefaces and are safe to reuse on your
own layout text: `.font-display` (Playfair Display, serif — headlines) and `.font-body`
(DM Sans, sans-serif — everything else). `.btn-primary` is the shared CTA button look
used site-wide beyond these 5 components.

Each component's own classes (`.phase-slider__*`, `.booking-hover-menu__*`, `.skip-link`)
are internal to that component — compose the component as a whole via its props, don't
reach into its class names from outside.

## Where the truth lives

Read the bound `styles.css` and its `@import` chain (`_ds_bundle.css`) before styling —
it's the real compiled CSS, not a summary. Each component's `<Name>.prompt.md` has its
real prop signature and a working usage example.

## Example

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 24, background: '#0C0B09', padding: 24 }}>
  <MagneticNavLink href="#results">Results</MagneticNavLink>
  <MagneticNavLink href="#process">Process</MagneticNavLink>
  <BookingLink variant="outline" label="Book a call" showPlus={false} placement="bottom-end" />
</div>
```

## Known gaps

- `PhaseSlider`'s content (headlines, copy, images) is hardcoded internal data, not a
  prop — every use of it shows the same fixed phase content.
- `PhaseSlider`'s images and `BookingLink`'s hover-opened contact panel aren't part of
  this bundle / aren't force-openable via props — see `.design-sync/NOTES.md`.
