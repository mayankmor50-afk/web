import {
  AUDIENCE,
  OFFER,
  OPERATIONS,
  PROOF_AGGREGATE,
  SITE_IDENTITY,
} from '@/lib/site-copy';

export type PhaseStatus = 'open' | 'sequential' | 'invitation';

export type PartnershipPhase = {
  id: string;
  number: string;
  name: string;
  tabLabel: string;
  headline: string;
  subhead: string;
  body: string;
  duration: string;
  focusLabel: string;
  focus: readonly string[];
  status: PhaseStatus;
  statusLabel: string;
  image: string;
  footnote: string;
};

const PHASE_IMAGES = ['/images/audit.jpg', '/images/encrypted.jpg', '/images/permissions.jpg'] as const;
const PHASE_TAB_LABELS = ['Audit', 'Build', 'Advisory'] as const;
const PHASE_HEADLINES = [
  'Forensic read of your customer file.',
  'Ship the top audit levers.',
  'Compound what is working.',
] as const;
const PHASE_SUBHEADS = [
  'Fixed-fee diagnostic — not a pitch deck or agency retainer.',
  'Only unlocked after Phase 01 shows what pays.',
  'Fractional retention leadership — by invitation only.',
] as const;
const PHASE_BODIES = [
  `We rank ${OPERATIONS.leverRange} levers by dollar impact and walk you through the findings live. About ${OPERATIONS.continueRate}% of clients continue — the audit stands on its own.`,
  'Top audit levers built with fixed scope — sequences, segmentation, dashboards. Scope locked before any work starts.',
  'Monthly call, brief, and ranked test backlog. Offered only after Phase 02 proves the model.',
] as const;
const PHASE_DURATIONS = [
  `${OPERATIONS.auditDays} once data is in`,
  OPERATIONS.buildDuration,
  'Monthly · 3-month minimum',
] as const;
const PHASE_FOCUS_LABELS = [
  'What we examine',
  'Typical build areas',
  'Each month includes',
] as const;
const PHASE_FOCUS: readonly (readonly string[])[] = [
  [
    'Cohort and repeat-rate gaps by channel',
    'Lifecycle and email revenue leaks',
    'Offer architecture and segmentation opportunities',
  ],
  [
    'Post-purchase and win-back sequences',
    'Segmentation and offer architecture',
    'Retention dashboards your team can run',
  ],
  [
    'Strategy call on what moved',
    'Written brief with ranked tests',
    'Backlog prioritized by dollar impact',
  ],
];
const PHASE_STATUSES: readonly PhaseStatus[] = ['open', 'sequential', 'invitation'];
const PHASE_STATUS_LABELS = [
  'Where every partnership starts',
  'Unlocked after Phase 01',
  'By invitation · after Phase 02',
] as const;
const PHASE_FOOTNOTES = ['', 'Pricing scoped after your audit.', ''] as const;

export const PARTNERSHIP_PHASES: readonly PartnershipPhase[] = OFFER.phases.map((phase, i) => ({
  id: ['audit', 'build', 'compound'][i],
  number: phase.n,
  name: phase.name,
  tabLabel: PHASE_TAB_LABELS[i],
  headline: PHASE_HEADLINES[i],
  subhead: PHASE_SUBHEADS[i],
  body: PHASE_BODIES[i],
  duration: PHASE_DURATIONS[i],
  focusLabel: PHASE_FOCUS_LABELS[i],
  focus: PHASE_FOCUS[i],
  status: PHASE_STATUSES[i],
  statusLabel: PHASE_STATUS_LABELS[i],
  image: PHASE_IMAGES[i],
  footnote: PHASE_FOOTNOTES[i],
}));

/** This page orients prospects — it is not a scoped proposal or quote. */
export const AUDIT_PAGE = {
  eyebrow: 'The partnership',
  title: 'How we work — before you book.',
  subtitle:
    'Three phases — audit, build, advisory. Scope and pricing are confirmed on your call.',
  phasesEyebrow: 'The three phases',
  phasesTitle: 'Explore how the partnership unfolds.',
  phasesIntro: 'Most partnerships start with Phase 01. Nothing here is a formal quote.',
  swipeHintDesktop: 'Click a phase',
  swipeHintTouch: 'Swipe or tap a phase',
  notProposalNote: 'Scope confirmed on your call.',
} as const;

export const AUDIT_PROOF = [
  {
    stat: PROOF_AGGREGATE.amount,
    label: `Identified across ${PROOF_AGGREGATE.leverCount} ranked levers`,
  },
  { stat: `${OPERATIONS.continueRate}%`, label: 'Continue after the audit' },
  { stat: OPERATIONS.auditDays, label: 'Typical audit turnaround' },
] as const;

export const AUDIT_FIT = {
  eyebrow: 'Who this is for',
  title: 'DTC brands with real customer history.',
  body:
    'Enough order history to read cohorts and repeat behavior. If repeat revenue is not compounding, start with a call.',
  fits: [
    `${AUDIENCE.revenueRange} revenue`,
    'Shopify + email with order history',
    AUDIENCE.categories,
  ],
  notFit: ['Pre-revenue or launching soon', 'Brand campaigns or open-ended retainers'],
} as const;

export const AUDIT_HOW = {
  eyebrow: 'How it starts',
  title: 'Three steps.',
  steps: [
    {
      n: '01',
      title: 'Book a call',
      copy: 'Fifteen minutes. Confirm fit and outline Phase 01 for your file.',
    },
    {
      n: '02',
      title: 'Get the audit',
      copy: `Fixed quote after intake. Findings in ${OPERATIONS.auditDays} with a live walkthrough.`,
    },
    {
      n: '03',
      title: 'Decide what is next',
      copy: 'Keep the audit, or green-light Phase 02. Your call — no auto-enrollment.',
    },
  ],
} as const;

export const AUDIT_FAQ_SECTION = {
  eyebrow: 'Before you book',
  title: 'Questions',
  lead: 'Fit, process, and what happens on the call.',
} as const;

export const AUDIT_FAQ = [
  {
    q: 'Is this page a proposal or quote?',
    a: 'No. Orientation only — scope and pricing are confirmed on your call.',
    node: 'Overview',
  },
  {
    q: 'What happens on the first call?',
    a: 'We confirm fit and outline Phase 01 for your file. Fixed quote before any work starts.',
    node: 'First call',
  },
  {
    q: 'Do I have to continue after Phase 01?',
    a: `No. About ${OPERATIONS.continueRate}% continue because the numbers justify it — but the audit stands alone.`,
    node: 'Standalone',
  },
  {
    q: 'How is pricing determined?',
    a: 'Catalog, channels, and data depth — scoped on your call, not from this page.',
    node: 'Fixed scope',
  },
  {
    q: 'What data do you need?',
    a: 'Shopify orders, email exports, and ad spend by channel. Checklist sent after you book.',
    node: 'Data intake',
  },
] as const;

export const AUDIT_FINAL = {
  title: 'See if this fits.',
  body: 'Book fifteen minutes. We talk through your file and scope Phase 01 on the call if it fits.',
  finePrint: 'Scope confirmed on your call',
} as const;

export { SITE_IDENTITY };
