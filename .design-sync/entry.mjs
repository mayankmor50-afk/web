// Curated design-system entry: only the components approved for this sync
// (base SKILL.md scope decision, 2026-07-08). Not a real package entry —
// this repo has no build/dist; the converter takes this via `cfg.entry` /
// `--entry` instead of scanning src/, so nothing else in components/
// (3D/GSAP/canvas/audio effects, page-assembly components) gets pulled in.
export { SkipLink } from '@/components/skip-link';
export { MagneticNavLink } from '@/components/landing/magnetic-nav-link';
export { PhaseSlider } from '@/components/landing/phase-slider';
export { BookingLink } from '@/components/landing/booking-link';
export { MobileNav } from '@/components/landing/mobile-nav';
