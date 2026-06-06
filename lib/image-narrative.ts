/**
 * Retention-strategist meaning for every scene image.
 * Each asset earns its place in the revenue narrative — not decoration.
 */
export const IMAGE_NARRATIVE = {
  hero: {
    code: '01',
    label: 'Second-sale margin',
    meaning: 'Repeat purchases — not acquisition — carry gross profit.',
  },
  bridge: {
    code: '02',
    label: 'Retention span',
    meaning: 'Acquisition spend on one shore. Compounding revenue on the other.',
  },
  method: {
    code: '03',
    label: 'Compound phase',
    meaning: 'Systems that stack — month two starts ahead of month one.',
  },
  whale: {
    code: '04',
    label: 'Below the surface',
    meaning: '65% of DTC revenue lives in existing buyers most brands ignore.',
  },
  shield: {
    code: '05',
    label: 'Margin protected',
    meaning: 'Fixed scope. Fixed fee. No retainer bleed.',
  },
  phaseAudit: {
    code: '05a',
    label: 'Forensic read',
    meaning: 'Every lever in your database, ranked in dollars.',
  },
  phaseBuild: {
    code: '05b',
    label: 'Locked build',
    meaning: 'Top 2–3 levers shipped — win-back, RFM, flows.',
  },
  phaseCompound: {
    code: '05c',
    label: 'Compounding layer',
    meaning: 'Monthly signal on what moved and what it is worth.',
  },
  about: {
    code: '06',
    label: 'Direct line',
    meaning: 'One strategist on your data. No agency layer.',
  },
  faq: {
    code: '07',
    label: 'Customer graph',
    meaning: 'Every question maps to a revenue lever in your file.',
  },
  cta: {
    code: '08',
    label: 'Step one',
    meaning: 'The audit is the first climb — everything else follows the map.',
  },
} as const;

export type ImageNarrativeKey = keyof typeof IMAGE_NARRATIVE;
