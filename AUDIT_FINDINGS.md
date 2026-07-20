# Website Audit & Foundations Layer — v0

## What Claude Built Right

The brief is disciplined and locked:
- **3-motion budget** (proof reveal, spine draw, CTA cursor) — sacred, not expandable
- **Single gradient descent** in background — creates certainty, not decorative noise
- **ICP clarity** — founders at $100k–$4M/month, DTC retention focus
- **Performance target** — ≤2.5s LCP with video-first hero
- **No UI cosplay** — progress indicators, section markers rejected
- **Accessibility bar** — WCAG AA + 7:1 body contrast (not AAA for its own sake)

## The Invisible Half: Foundations That Are Missing or Incomplete

This is where the site gets "actually finished" without adding surface decoration.

### 1. **Mobile-First Layout Architecture** (High Priority)
**What's locked:** Desktop composition at 1440px is primary.  
**What's missing:**
- No documented mobile breakpoints strategy
- Desktop grid layouts may not collapse cleanly ≤900px
- Hero video fades up on desktop — what's the mobile equivalent? Static image? Instant reveal?
- Proof section "collapses to stack" is mentioned but not implemented
- No mobile CTA strategy (sticky? section-level? hamburger changes?)

**Specifics to verify:**
- Gap layout (1440 design: 0.92fr | 1.08fr) — does it become single column mobile?
- Method layout (1.2fr | 0.8fr) — same question
- About layout (1fr | 1fr) — how does portrait scale on mobile?
- Hero video dimensions — what fallback for ≤375px?

**Action:** Audit all layouts at 375px, 667px, 900px, 1200px, 1440px. Document breakpoint strategy in a layout system.

---

### 2. **Type System & Scale** (High Priority)
**What exists:** Playfair Display (display), DM Sans (body), JetBrains Mono (code).  
**What's missing:**
- No documented type scale (is h1=38px? h2=26px? body=16px?)
- `clamp()` used ad-hoc, not systematic
- `font-display`, `font-body`, `font-mono` classes exist but not applied everywhere
- No guidance on when to use Instrument Sans vs DM Sans (both appear in CSS)
- Line-height not consistent (1.2 seen in `.method-intro__headline`, 1.55 in `.scene-note__meaning`)
- Letter-spacing varies (0.04em, 0.18em, 0.22em) — no scale

**What should exist:**
```
Type Scale (Tailwind clamp pattern):
- h1: clamp(32px, 6vw, 48px) / lh-tight (1.1)
- h2: clamp(24px, 4vw, 36px) / lh-tight (1.2)
- h3: clamp(18px, 3vw, 28px) / lh-snug (1.3)
- body: 16px / lh-relaxed (1.55)
- sm: 14px / lh-relaxed (1.5)
- xs: 12px / lh-normal (1.4)

Letter-spacing scale:
- headings: 0.02em
- ui/labels: 0.06em (section eyebrow)
- legal/small-caps: 0.18em
```

**Action:** Create `lib/typography.ts` with type scale tokens, apply to all text elements, verify mobile ≤16px doesn't feel cramped.

---

### 3. **Interaction States & Focus Indicators** (High Priority)
**What exists:**
- `.btn-primary:hover` with shine effect ✓
- `a:focus-visible` and `button:focus-visible` with amber outline ✓
- `.btn-primary::after` for shimmer on hover ✓

**What's missing:**
- No `:active` state for buttons (mouse-down feedback)
- No `:focus` state (vs `:focus-visible` — keyboard vs mouse)
- No indication of "currently selected" state (e.g., if FAQ items are expanded)
- Form states undefined (input focus, placeholder, error, disabled)
- Link hover states not documented (underline? color shift? both?)
- Touch/tap feedback on mobile (pseudo-hover, or disabled entirely?)

**What should exist:**
```
Button states:
- :hover → background-amber-hover ✓
- :active → background-amber with slight inset (depth feedback)
- :focus-visible → outline + offset ✓
- :disabled → opacity-50, cursor-not-allowed

Link states:
- :hover → underline + color shift
- :focus-visible → same outline as buttons
- :active → opacity-75

Form states (input):
- :focus → border-amber, ring with offset
- :placeholder-shown → color-muted-foreground
- :invalid → border-destructive, aria-invalid
- :disabled → bg-muted, cursor-not-allowed
```

**Action:** Create `components/ui/interactive-states.css`, test all states on both desktop and mobile touch.

---

### 4. **Keyboard Navigation Path** (High Priority)
**What's locked:** No drag-to-interact, no dashboard paradigms on marketing page.  
**What's missing:**
- No tab order documentation
- No skip-to-main-content link visible
- CTA buttons are clickable but unclear if focusable via keyboard
- Hero section — is the "See how it works" button reachable without scrolling? Tab order critical for founders on mobile
- No `aria-current` or `aria-label` for navigation context
- FAQ expand/collapse — how does keyboard user trigger? Enter? Space?

**What should exist:**
```
Tab order:
1. Meta header (logo, nav links)
2. Hero CTA ("See how it works")
3. Hero stats (non-interactive or navigation?)
4. Process section CTAs
5. Case studies (if clickable)
6. FAQ items (each expandable)
7. Final CTA ("Schedule audit")
8. Footer links

Skip link:
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

ARIA labels:
- FAQ buttons: aria-expanded, aria-controls
- Current section: aria-label="Section: Method"
```

**Action:** Map tab order, implement skip link, add ARIA to interactive elements, test keyboard navigation end-to-end.

---

### 5. **Screen Reader & Accessible Narrative** (Medium Priority)
**What exists:** `selection` styling (amber highlight).  
**What's missing:**
- Hero video — described or alt text?
- Case study images (whale, tree) — are they decorative or meaningful?
- Numbers like "$502k" — narrative context missing for non-visual users
- Section headings — are they `<h1>`, `<h2>`, etc., or just styled divs?
- Proof annotations — the visual pins and labels, how do they translate to text?

**What should exist:**
```
Hero section:
<h1>Your second sale is where margin lives.</h1>
<p>Forensic read of your Shopify file — 5–8 levers ranked by gross profit, not open rates.</p>
<!-- Hidden narrative for screen readers -->
<p className="sr-only">
  Chetna Bhadkare helps DTC brands at $100k–$4M/month improve retention margins through forensic Shopify audits.
</p>

Proof section:
<h2>$502k identified across six ranked levers. One audit.</h2>
<p className="sr-only">
  These results come from an actual premium skincare DTC case study. The numbers represent gross profit opportunity ranked by impact.
</p>

Case studies:
<figure>
  <figcaption>Lily.mk case study: repeat revenue share improved from 3.7% to 36% in 90 days</figcaption>
  <p className="sr-only">
    This represents a 10x improvement in repeat customer percentage, with 70% of that revenue on autopilot systems.
  </p>
</figure>
```

**Action:** Add semantic HTML (`<h1>`, `<figure>`, etc.), create sr-only narrative for complex visuals, test with screen reader (NVDA/JAWS).

---

### 6. **Motion Policy & Reduced-Motion Support** (Medium Priority)
**What exists:** `lib/motion-policy.ts` mentioned in brief.  
**What's missing:**
- File exists but location/implementation unclear
- Reduced motion preference — is it respected globally?
- Hero video — does it still play under `prefers-reduced-motion`?
- The 3 motion moments — are they disabled or simplified?
- Scroll-triggered animations (spine draw, proof reveal) — behavior under `prefers-reduced-motion`?

**What should exist:**
```
// lib/motion-policy.ts (if missing)
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Apply globally:
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

// Conditionally in components:
const shouldAnimate = !prefersReducedMotion();
return shouldAnimate ? <AnimatedSpine /> : <StaticSpine />;
```

**Action:** Verify `motion-policy.ts` is implemented, test all animations under `prefers-reduced-motion: reduce`.

---

## What to NOT Add (To Avoid the Failures Claude Rejected)

- **Progress indicators, section markers** — UI cosplay, not needed
- **Hover reveals (hiding proof)** — doesn't work on touch, proof must be readable at a glance
- **Color zone shifts per section** — reintroduces banding issues already rejected
- **Before/after micro-charts** — dashboard UI on a marketing page, forbidden
- **Draggable timeline** — same category as above
- **State persistence across sessions** — over-engineering a single-page lead-gen site
- **Haptics on web** — not meaningfully available to JavaScript
- **WCAG AAA chasing** — AA + 7:1 body is the right bar; AAA forces compromises

---

## Implementation Order (Don't Parallelize)

1. **Layout architecture** — Mobile breakpoints, grid collapsing, hero fallback (unblocks all sections)
2. **Type system** — Consistent scale, line-height, letter-spacing (makes everything more readable immediately)
3. **Interaction states** — Hover, active, focus, disabled (makes the site feel polished and responsive)
4. **Keyboard navigation** — Tab order, skip link, ARIA (unlocks accessibility, often catches bugs)
5. **Screen reader narrative** — sr-only text, semantic HTML (completes the accessibility story)
6. **Motion policy verification** — Reduced-motion support, hero video fallback (respects user preferences)

---

## Verification Checklist

- [ ] Mobile layouts tested at 375px, 667px, 900px, 1440px
- [ ] Type scale applied to all text elements and verified at all breakpoints
- [ ] Button/link states tested on desktop (hover, active, focus, disabled)
- [ ] Touch states tested on mobile device (if available)
- [ ] Tab order follows logical flow, no traps, skip link present
- [ ] Screen reader tested (NVDA or VoiceOver) for all sections
- [ ] `prefers-reduced-motion: reduce` tested — animations disabled or gracefully degraded
- [ ] Hero video fallback works on mobile or low-memory
- [ ] LCP remains ≤2.5s across all breakpoints
- [ ] No new motion moments added beyond the locked 3
- [ ] No UI cosplay elements introduced

---

## Success Definition

A site is "finished" when:
1. It works identically well at 375px and 1440px (not "responsive," but intentional)
2. Keyboard users and screen reader users have the same conviction as mouse users
3. Every interaction has a clear state (hover, active, focus, disabled)
4. Performance is unconstrained (LCP, type rendering, no layout thrash)
5. Reduced-motion preference is respected
6. No scaffolding remains (all copy is real, all CTAs route somewhere)

This is NOT about adding more. It's about making what's there actually work.
