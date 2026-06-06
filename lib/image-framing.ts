/**
 * All 8 brand images — one clear role each, tuned to composition.
 */
export const IMAGE_QUALITY = 92;

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
} as const;

/** Where each image lives — retention narrative, not decoration */
export const ASSET_MAP = {
  cherryTree: 'Hero + Method — repeat revenue compounds (second-sale margin)',
  bridge: 'The gap — acquisition shore ↔ retention shore infrastructure span',
  whale: 'Proof — hidden repeat revenue below the surface (iceberg)',
  shield: 'Offer — full-section backdrop; margin protected, fixed scope',
  audit: 'Phase 01 — forensic read of every revenue lever',
  encrypted: 'Phase 02 — locked-scope build, no scope creep',
  permissions: 'Phase 03 — compounding layer on live retention systems',
  ctaStaircase: 'Start here — first step; audit is where the climb begins',
  aboutConnection: 'Who does this — connection backdrop behind portrait',
  chetnaPortrait: 'Who does this — reserved portrait slot (add public/images/chetna.jpg)',
  faqDataGraph: 'Questions — customer graph panel, separate from copy',
} as const;

export const IMAGE_FRAMES = {
  heroVideo: {
    objectFit: 'cover' as const,
    objectPosition: '72% 38%',
    opacity: 0.82,
  },
  /** Cherry-tree still — hero fallback + method panel */
  cherryTree: {
    objectFit: 'cover' as const,
    objectPosition: '50% 38%',
    filter: 'brightness(0.82) contrast(1.04) saturate(1.05)',
    parallaxScaleMax: 1.04,
    parallaxTranslateMax: 10,
    baseScale: 1,
  },
  bridge: {
    objectFit: 'cover' as const,
    objectPosition: '42% 48%',
    filter: 'brightness(0.8) contrast(1.08) saturate(1.06)',
    parallaxScaleMax: 1.07,
    parallaxTranslateMax: 18,
    baseScale: 1.05,
  },
  whale: {
    objectFit: 'cover' as const,
    objectPosition: '50% 46%',
    filter: 'brightness(0.92) contrast(1.04)',
    parallaxScale: 0.94,
    parallaxTranslateMax: 16,
    preRevealOverlay: 'rgba(6,6,5,0.62)',
    spotlight: 'ellipse 108% 88% at 50% 44%',
  },
  shield: {
    objectFit: 'cover' as const,
    objectPosition: '74% 50%',
    filter: 'brightness(0.6) contrast(1.06) saturate(0.9)',
    mediaOpacity: 0.56,
    parallaxScaleMax: 1.04,
    parallaxTranslateMax: 10,
    baseScale: 1.02,
  },
  phaseHeader: {
    audit: { objectPosition: 'center center', filter: 'brightness(0.72) contrast(1.1)' },
    encrypted: { objectPosition: 'center center', filter: 'brightness(0.72) contrast(1.1)' },
    permissions: { objectPosition: 'center center', filter: 'brightness(0.72) contrast(1.1)' },
  },
  ctaStaircase: {
    objectFit: 'cover' as const,
    objectPosition: '42% 72%',
    filter: 'brightness(0.62) contrast(1.1) saturate(0.88)',
    mediaOpacity: 0.68,
    overscanScale: 1.14,
    parallaxScaleMax: 1.04,
    parallaxTranslateMax: 12,
    baseScale: 1.02,
  },
  aboutConnection: {
    objectFit: 'cover' as const,
    objectPosition: '50% 56%',
    filter: 'brightness(0.68) contrast(1.08) saturate(0.95)',
    parallaxScaleMax: 1.04,
    parallaxTranslateMax: 10,
    baseScale: 1.02,
  },
  faqDataGraph: {
    objectFit: 'cover' as const,
    objectPosition: '68% 50%',
    filter: 'brightness(0.56) contrast(1.1) saturate(0.82)',
    mediaOpacity: 0.62,
    overscanScale: 1.12,
    parallaxScaleMax: 1.05,
    parallaxTranslateMax: 14,
    baseScale: 1.03,
  },
} as const;

export function phaseFrame(image: string) {
  if (image.includes('audit')) return IMAGE_FRAMES.phaseHeader.audit;
  if (image.includes('encrypted')) return IMAGE_FRAMES.phaseHeader.encrypted;
  return IMAGE_FRAMES.phaseHeader.permissions;
}
