/**
 * Brand image registry + per-asset luminance tuning.
 *
 * Luminance profiles (creative rule of thumb):
 * - bright  — color/signal must read (payoff, data, life)
 * - dark    — mood is void, weight, or faint trace
 * - neutral — noir anchor; moderate brightness, story carries in copy
 */
export const IMAGE_QUALITY = 92;

export type ImageLuminance = 'bright' | 'dark' | 'neutral';

export const IMAGE_LUMINANCE: Record<
  | 'cherryTree'
  | 'bridge'
  | 'whale'
  | 'shield'
  | 'aboutConnection'
  | 'faqDataGraph'
  | 'ctaStaircase'
  | 'realTimeGraph'
  | 'wildflowerHill'
  | 'phaseAudit'
  | 'phaseBuild'
  | 'phaseCompound',
  ImageLuminance
> = {
  /** Hero + Method — noir anchor; blossoms catch light but scene stays forensic */
  cherryTree: 'neutral',
  /** The gap — darkness between shores IS the story */
  bridge: 'dark',
  /** Proof — underwater lift / spotlight; hidden value surfacing */
  whale: 'bright',
  /** Offer — heavy protection; recedes behind cards */
  shield: 'dark',
  /** Audit intro — partnership thread; neutral-dark, slightly open (orientation beat) */
  aboutConnection: 'neutral',
  /** FAQ — graph lines must read as texture on the right */
  faqDataGraph: 'bright',
  /** Final CTA — stone steps as subtle texture, not a lit stage */
  ctaStaircase: 'neutral',
  /** Audit final — live moss/signal waveform */
  realTimeGraph: 'bright',
  /** About — emotional color payoff after the forensic arc */
  wildflowerHill: 'bright',
  phaseAudit: 'neutral',
  phaseBuild: 'neutral',
  phaseCompound: 'neutral',
};

export const BRAND_IMAGES = {
  cherryTree: '/images/cherry-tree.png',
  bridge: '/images/bridge.png',
  whale: '/images/whale.png',
  shield: '/images/shield.png',
  audit: '/images/audit.jpg',
  encrypted: '/images/encrypted.jpg',
  permissions: '/images/permissions.jpg',
  aboutConnection: '/images/about-connection.png',
  chetnaPortrait: '/images/chetna.jpg',
  faqDataGraph: '/images/faq-data-graph.png',
  ctaStaircase: '/images/cta-staircase.png',
  realTimeGraph: '/images/real-time-graph.png',
  wildflowerHill: '/images/wildflower-hill.png',
} as const;

export const IMAGE_FRAMES = {
  heroVideo: {
    objectFit: 'cover' as const,
    objectPosition: '72% 38%',
    opacity: 0.82,
  },
  cherryTree: {
    objectFit: 'cover' as const,
    objectPosition: '50% 38%',
    filter: 'brightness(0.8) contrast(1.05) saturate(1.04)',
    parallaxScaleMax: 1.04,
    parallaxTranslateMax: 10,
    baseScale: 1,
  },
  bridge: {
    objectFit: 'cover' as const,
    objectPosition: '42% 48%',
    filter: 'brightness(0.68) contrast(1.1) saturate(0.96)',
    parallaxScaleMax: 1.07,
    parallaxTranslateMax: 18,
    baseScale: 1.05,
  },
  whale: {
    objectFit: 'cover' as const,
    objectPosition: '50% 46%',
    filter: 'brightness(0.94) contrast(1.06) saturate(1.02)',
    parallaxScale: 0.94,
    parallaxTranslateMax: 16,
    preRevealOverlay: 'rgba(6,6,5,0.62)',
    spotlight: 'ellipse 108% 88% at 50% 44%',
  },
  shield: {
    objectFit: 'cover' as const,
    objectPosition: '74% 50%',
    filter: 'brightness(0.5) contrast(1.06) saturate(0.86)',
    mediaOpacity: 0.42,
    parallaxScaleMax: 1.04,
    parallaxTranslateMax: 10,
    baseScale: 1.02,
  },
  phaseHeader: {
    audit: {
      objectFit: 'cover' as const,
      objectPosition: '50% 42%',
      filter: 'brightness(0.78) contrast(1.08) saturate(1.02)',
    },
    encrypted: {
      objectFit: 'cover' as const,
      objectPosition: '50% 46%',
      filter: 'brightness(0.8) contrast(1.08) saturate(1.04)',
    },
    permissions: {
      objectFit: 'cover' as const,
      objectPosition: '50% 44%',
      filter: 'brightness(0.8) contrast(1.08) saturate(1.04)',
    },
  },
  ctaStaircase: {
    objectFit: 'cover' as const,
    objectPosition: '48% 72%',
    filter: 'brightness(0.72) contrast(1.08) saturate(0.96)',
    mediaOpacity: 0.62,
    overscanScale: 1.14,
    parallaxScaleMax: 1.04,
    parallaxTranslateMax: 12,
    baseScale: 1.02,
  },
  aboutConnection: {
    objectFit: 'cover' as const,
    objectPosition: '50% 44%',
    filter: 'brightness(0.8) contrast(1.1) saturate(0.98)',
    mediaOpacity: 0.82,
    parallaxScaleMax: 1.03,
    parallaxTranslateMax: 8,
    baseScale: 1.01,
  },
  faqDataGraph: {
    objectFit: 'cover' as const,
    objectPosition: '74% 48%',
    filter: 'brightness(0.74) contrast(1.12) saturate(1.02)',
    mediaOpacity: 0.64,
    overscanScale: 1.1,
    parallaxScaleMax: 1.03,
    parallaxTranslateMax: 10,
    baseScale: 1.02,
  },
  realTimeGraph: {
    objectFit: 'cover' as const,
    objectPosition: '50% 84%',
    filter: 'brightness(0.8) contrast(1.12) saturate(1.06)',
    mediaOpacity: 0.7,
    parallaxScaleMax: 1.04,
    parallaxTranslateMax: 10,
    baseScale: 1.02,
  },
  wildflowerHill: {
    objectFit: 'cover' as const,
    objectPosition: '50% 68%',
    filter: 'brightness(0.84) contrast(1.08) saturate(1.12)',
    mediaOpacity: 0.74,
    parallaxScaleMax: 1.02,
    parallaxTranslateMax: 6,
    baseScale: 1,
  },
} as const;

export function phaseFrame(image: string) {
  if (image.includes('audit')) return IMAGE_FRAMES.phaseHeader.audit;
  if (image.includes('encrypted')) return IMAGE_FRAMES.phaseHeader.encrypted;
  return IMAGE_FRAMES.phaseHeader.permissions;
}
