# Codebase Audit: Current State vs. Claude's Plan

## Executive Summary

Your website has **strong foundations** but significant **feature creep** and **interaction debt**. The actual site has drifted from the design constraints Claude outlined. There are also **UX gaps** that block users from engaging smoothly.

---

## What's Working Well ✓

### 1. **Color System (Perfect)**
- Brand palette is locked: `--brand-bg` (#0c0b09), `--brand-cream`, `--brand-amber`
- Semantic tokens defined throughout
- Dark mode native, no light mode bloat
- Selection color tuned (amber tint)

### 2. **Typography Foundation (Good)**
- Playfair (display/verdicts) + DM Sans (body/findings) locked
- 3 fonts total: Geist, Geist Mono, Playfair Display
- `clamp()` used for responsive sizing
- Focus states properly styled (amber outline)

### 3. **Responsive Architecture (Decent)**
- Mobile breakpoint at 900px
- Section padding uses clamps: `--section-y: clamp(72px, 11vw, 120px)`
- Grid layouts defined for desktop (`.gap-layout`, `.method-layout`, `.about-layout`)
- Mobile nav exists

### 4. **Motion Policy Guards (Exists)**
- `shouldInstantReveal()` prevents animations on touch devices
- `isFigmaCaptureMode()` disables scroll animations for design capture
- Motion is respecting `prefers-reduced-motion` in CSS

---

## What's Broken / Drifted ✗

### **CRITICAL: Animation Budget Exploded**

Claude's spec: **3 motion moments max**
Actual implementation: **15+ animations** including:
- Sakura thread (decorative particle system)
- Film grain overlay with animation
- Bioluminescence (atmospheric effect)
- Forensic grid (animated bg)
- Scroll progress indicator
- Section wipe transitions
- GsapSplitHeadline (text reveal)
- SplitLinesReveal (text animations)
- Text reveal effects
- Magnetic nav links (hover tracking)
- Data stream curtain
- Hero scroll parallax
- FAQ graph pulsing glows (`faq-glow-pulse` animation)

**Impact:** Over-engineered, slow first paint, distracting from message

**Status:** NEEDS PRUNING (identify actual 3 motion moments, remove rest)

---

### **2. Mobile Experience Incomplete**

**What exists:**
- Mobile nav component ✓
- Touch device detection ✓
- Responsive type scale ✓

**What's missing:**
- No mobile grid layouts defined (only desktop `.gap-layout`, `.method-layout`, `.about-layout`)
- Stacked vertical layout isn't documented in CSS
- Touch feedback states missing (`:active`, `:focus-visible` on mobile)
- No explicit mobile spacing rules (padding/gaps may not scale well)

**Status:** PARTIALLY DONE — Desktop-first, mobile as afterthought

---

### **3. Interaction States Missing**

**Hover states:** ✓ (buttons have shine effect)

**Missing:**
- Form focus states (are there form fields? No evidence in codebase)
- Loading states (no skeleton, spinner, or state machine)
- Error states (validation feedback?)
- Active/pressed states for CTAs
- Mobile touch feedback (visual tap feedback)
- Link underlines on `:focus-visible`

**Status:** INCOMPLETE — Only button hover done

---

### **4. Keyboard Navigation Path Unclear**

**What's there:**
- Focus outline defined: `outline: 2px solid var(--brand-amber); outline-offset: 3px;`
- Buttons and links have focus styling

**Missing:**
- No logical tab order documentation
- CTA terminal cursor interaction not keyboard-accessible
- No skip-to-content link
- Menu keyboard close (ESC) not evident
- Form field focus states

**Status:** PARTIAL — Visual focus there, but interactive flow unmapped

---

### **5. Accessibility (AA, but not AAA)**

**What works:**
- Dark mode only (no WCAG contrast issues if properly tested)
- Focus states defined
- Semantic HTML likely in place

**Missing:**
- No alt text strategy documented
- Screen reader navigation path unknown
- No ARIA labels visible in code snippets
- Proof section table structure unknown
- Form field labels unknown

**Status:** FOUNDATIONAL — Likely AA, but not verified or hardened

---

### **6. Code Organization Issues**

**Imports in layout.tsx:**
```
SakuraThread, FilmGrain, SmoothScroll, ForensicAtmosphere, 
AmbientSoundProvider, ScrollProgress, TouchDeviceMark
```

These are all **global provider wraps**. Each adds overhead.

**Impacts:**
- No tree-shaking (all included)
- Harder to disable individual features
- Font loading strategy unclear

**Status:** NEEDS REFACTORING — Too many providers at once

---

## What Needs Immediate Attention 🎯

### **Phase 1: Foundation (Do First)**

1. **Motion Audit & Pruning**
   - [ ] Identify the actual 3 motion moments (hero entrance? proof scroll reveal? final CTA?)
   - [ ] Remove: Sakura, Film Grain, Bioluminescence, Forensic Grid, ScrollProgress
   - [ ] Keep only essential animations
   - [ ] Test LCP stays under 2.5s

2. **Mobile Layout System**
   - [ ] Define mobile grid layouts (stack columns vertically)
   - [ ] Mobile spacing rules (different padding/gap for narrow)
   - [ ] Test at common breakpoints (320px, 540px, 750px, 1200px)
   - [ ] Verify proof section stacks cleanly

3. **Keyboard Navigation Map**
   - [ ] Tab order: Nav → Hero CTA → Section headers → FAQ toggles → Booking CTA
   - [ ] ESC to close nav/modals
   - [ ] No keyboard traps
   - [ ] Focus order follows visual reading order

### **Phase 2: Polish (Then)**

4. **Interaction States**
   - [ ] Mobile touch feedback (`:active` states)
   - [ ] Loading state (while booking link fetches)
   - [ ] Form validation states (if forms exist)

5. **Accessibility Hardening**
   - [ ] Alt text for all images (portraits, charts)
   - [ ] Proof section table structure + labels
   - [ ] Screen reader test of FAQ section
   - [ ] Link text passes WCAG (no "click here")

### **Phase 3: Optional (Only if time)**

6. **Performance Profiling**
   - [ ] LCP < 2.5s (measure with hero video)
   - [ ] INP < 200ms
   - [ ] CLS < 0.1
   - [ ] Run lighthouse audit

---

## Design Gaps (Beyond the Spec)

Even if we follow Claude's spec exactly, there are **creative opportunities**:

1. **Proof section interaction** — Currently static tables/data. Could have:
   - Micro-interactions on row hover (reveal insight)
   - Animated metric counters (60.2% animates from 0 → 60.2)
   - Comparison before/after (subtle visual)

2. **FAQ section** — Currently collapsible text. Could have:
   - Icon rotations on expand (⊕ → ⊖)
   - Staggered animations on FAQ rows appearing
   - Visual indicator of open section

3. **CTA button states** — Currently has shine effect. Could have:
   - Ripple effect on click (material design inspired but premium)
   - Loading spinner inside button
   - Success state (✓ confirmation)

4. **Navigation context** — Could show:
   - Current section indicator
   - Scroll progress bar
   - Mobile section breadcrumb

---

## Recommendations: Priority Order

### **If you have 4-8 hours:**
1. Trim animations to 3 (biggest impact on perceived performance)
2. Define mobile layouts explicitly
3. Keyboard nav map + testing
4. Touch feedback states

### **If you have 2-4 hours:**
1. Just trim animations
2. Mobile stacking only

### **If you have <2 hours:**
1. Only remove unnecessary animations (Sakura, Film Grain, Bioluminescence)

---

## Questions for You

Before we build:

1. **Which 3 animations are non-negotiable?** (Hero entrance? Proof section reveal? FAQ open?)
2. **Is this mobile revenue driver?** (Matters for mobile UX investment)
3. **Booking flow exists?** (Need to understand form states)
4. **Do you want micro-interactions?** (Proof section counters, FAQ icons, etc.?)
5. **Lighthouse score target?** (90+? 95+?)
