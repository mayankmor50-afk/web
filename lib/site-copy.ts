/**
 * Central marketing copy — single source of truth for homepage sections
 * and shared stats imported by audit-content.ts.
 *
 * Sourced from client PDFs (All Info, Case study, Proof).
 * Excludes: deliverable lists, timelines, pricing tables, proposal language.
 */

export const SITE_IDENTITY = {
  name: 'Chetna Bhadkare',
  title: 'Retention & Profitability Strategist',
  tagline: 'Your second sale is where margin lives.',
} as const;

export const AUDIENCE = {
  revenueRange: '$100k–$4M/month',
  eyebrow: 'DTC Retention Strategy',
  categories:
    'Pet, supplements, skincare, coffee & tea, haircare, protein',
} as const;

/** Aggregate audit proof — representative premium skincare DTC case study */
export const PROOF_AGGREGATE = {
  amount: '$502k',
  leverCount: 6,
  headlineLines: ['$502k identified', 'across six ranked', 'levers. One audit.'] as const,
  footnote: 'These are not projections. They are what happened.',
  /** Hero-only tease — full headline lives in Proof section */
  heroTease: {
    value: '$502k',
    label: 'Gross profit mapped in one audit',
  },
} as const;

/** Hero proof rail — PDF-backed; full $502k story lives in Results */
export const HERO_STATS = [
  { value: '$502k', label: 'Gross profit · one audit' },
  { value: '80%', label: 'Continue after audit' },
  { value: '5–7 days', label: 'Audit turnaround' },
] as const;

export const HERO = {
  eyebrow: `${AUDIENCE.eyebrow} · ${AUDIENCE.revenueRange}`,
  headlineLines: ['Your second sale', 'is where', 'margin lives.'] as const,
  headlineHighlightIndex: 2,
  subhead:
    'Forensic read of your Shopify file — 5–8 levers ranked by gross profit, not open rates.',
  ctaLabel: 'See how it works →',
} as const;

export const PROBLEM = {
  eyebrow: 'The gap',
  lines: [
    {
      stat: '22% bought again in month two.',
      rest: 'Out of 1,000 new customers — loyalty forms or dies right there.',
    },
    {
      stat: '18–25% M1 repeat',
      rest: 'is where most brands start. The gap is enormous when you finally read cohorts.',
    },
    {
      stat: 'Acquisition gets funded.',
      rest: 'The bridge to repeat revenue rarely does.',
    },
  ],
  caption: 'Most brands focus on new traffic. Retention revenue is already in the file.',
} as const;

export const METHOD = {
  eyebrow: 'How it works',
  headlineLines: ['Diagnose.', 'Build.', 'Compound.'] as const,
  steps: [
    { n: '01', title: 'Diagnose', copy: 'Cohort, RFM, and lifecycle gaps — each lever ranked in dollars.' },
    { n: '02', title: 'Build', copy: 'Win-back, segmentation, dashboards — top 2–3 levers shipped.' },
    { n: '03', title: 'Compound', copy: 'Monthly cohort read + ranked test backlog — compounding what the build proved.' },
  ],
} as const;

export type CaseStudy = {
  brand: string;
  category: string;
  before: string;
  after: string;
  label: string;
  timeline: string;
};

/** Verified client outcomes — names appear in client Proof.pdf */
export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    brand: 'Lily.mk',
    category: "Women's Apparel",
    before: '3.7%',
    after: '36%',
    label: 'repeat revenue share · 70% on autopilot',
    timeline: '90 days',
  },
  {
    brand: 'Denman Tea',
    category: 'Consumable',
    before: '23%',
    after: '36%',
    label: 'automated flows as share of email revenue',
    timeline: '10 months',
  },
  {
    brand: 'Atlantic Naturals',
    category: 'Supplements',
    before: '0%',
    after: '37%',
    label: 'retention revenue share · 80% on autopilot',
    timeline: '6 months',
  },
];

export const PROOF = {
  eyebrow: 'Results',
  lead: 'Named outcomes on live DTC files — apparel, tea, supplements.',
  headlineLines: PROOF_AGGREGATE.headlineLines,
  footnote: PROOF_AGGREGATE.footnote,
  caseStudies: CASE_STUDIES,
} as const;

export const OFFER = {
  eyebrow: 'The offer',
  headlineLines: ['Audit first.', 'Build what pays.', 'Compound what works.'] as const,
  ctaLabel: 'See the full overview →',
  phases: [
    {
      n: '01',
      name: 'The Retention Audit',
      copy: '5–8 levers ranked by gross profit — forensic read of Shopify + Klaviyo.',
      note: 'Forensic read',
    },
    {
      n: '02',
      name: 'The Build Sprint',
      copy: 'Top audit levers deployed with locked scope.',
      note: 'Locked build',
    },
    {
      n: '03',
      name: 'The Compounding Layer',
      copy: 'Monthly call, brief, and ranked test backlog.',
      note: 'Compounding layer',
    },
  ],
} as const;

export const ABOUT = {
  eyebrow: 'Who does this',
  portraitCaption:
    'Lifecycle builds and forensic audits — DTC brands at $100k–$4M/month.',
  bio:
    'Lifecycle builds for apparel, consumables, and supplements — plus cohort analysis, LTV by channel, and forensic audits. One strategist on retention and gross profit, not brand campaigns.',
  quote: {
    text: 'Most of what moves retention doesn\'t require a bigger budget. It requires knowing where to look — and what to do first.',
    attribution: SITE_IDENTITY.name,
    role: SITE_IDENTITY.title,
  },
} as const;

export const HOME_FAQ_SECTION = {
  eyebrow: 'Before you book',
  title: 'Questions',
  lead: 'Deliverables, fit, and how this differs from an agency.',
} as const;

export const HOME_FAQ = [
  {
    q: 'What do I get from the audit?',
    a: 'A ranked map of 5–8 levers, valued in dollars. Delivered in 5–7 days with a live walkthrough.',
    node: 'Lever map',
  },
  {
    q: 'Do I have to continue after the audit?',
    a: 'No. About 80% continue because the numbers justify it — but the audit stands alone.',
    node: 'Standalone audit',
  },
  {
    q: 'Who is this for?',
    a: `DTC brands at ${AUDIENCE.revenueRange} with enough order history to diagnose.`,
    node: 'RFM cohorts',
  },
  {
    q: 'How is this different from an agency?',
    a: 'Fixed scope and price. One strategist on retention and gross profit — not brand campaigns.',
    node: 'Fixed scope',
  },
] as const;

/** Operational stats — audit page + FAQ; hero uses HERO_STATS for the same facts */
export const OPERATIONS = {
  leverRange: '5–8',
  auditDays: '5–7 days',
  continueRate: 80,
  buildDuration: '60–90 days',
} as const;

export const FINAL_CTA = {
  eyebrow: 'Start here',
  headline: 'The audit is where we start.',
} as const;

export const METADATA = {
  home: {
    title: `${SITE_IDENTITY.name} | ${SITE_IDENTITY.title}`,
    description:
      'Retention audits that surface six-figure lever maps — then fixed-scope builds for DTC brands at $100k–$4M/month.',
    ogDescription:
      'Fixed-price retention audits for DTC brands doing $100k–$4M/month. Find the margin already in your customer database.',
    twitterDescription: SITE_IDENTITY.tagline,
  },
  audit: {
    title: `The 3-Phase Partnership | ${SITE_IDENTITY.name}`,
    description:
      'Audit, build, advisory — how the partnership works. Scope confirmed on your call.',
    ogDescription:
      'Orientation on the three-phase retention partnership. Book a call to confirm fit.',
  },
} as const;
