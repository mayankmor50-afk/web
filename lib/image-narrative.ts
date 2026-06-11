/**
 * Retention-strategist meaning for every scene image.
 * Each asset earns its place in the revenue narrative — not decoration.
 */
export const IMAGE_NARRATIVE = {
  hero: {
    code: '01',
    label: 'Second-sale margin',
    meaning: 'Repeat purchases carry gross profit.',
  },
  bridge: {
    code: '02',
    label: 'Retention span',
    meaning: 'Acquisition on one shore. Compounding on the other.',
  },
  method: {
    code: '03',
    label: 'Compound phase',
    meaning: 'Systems that stack month over month.',
  },
  whale: {
    code: '04',
    label: 'Below the surface',
    meaning: 'Lever value hiding in the customer file.',
  },
  shield: {
    code: '05',
    label: 'Margin protected',
    meaning: 'Fixed scope. No retainer bleed.',
  },
  phaseAudit: {
    code: '05a',
    label: 'Forensic read',
    meaning: 'Every lever ranked in dollars.',
  },
  phaseBuild: {
    code: '05b',
    label: 'Locked build',
    meaning: 'Top levers shipped — win-back, RFM, flows.',
  },
  phaseCompound: {
    code: '05c',
    label: 'Compounding layer',
    meaning: 'Monthly signal on what moved.',
  },
  about: {
    code: '06',
    label: 'Direct line',
    meaning: 'One strategist. Room for what compounds.',
  },
  connection: {
    code: '05d',
    label: 'The partnership',
    meaning: 'Your file — one thread to the work.',
  },
  faq: {
    code: '07',
    label: 'Customer graph',
    meaning: 'Every question maps to a revenue lever.',
  },
  cta: {
    code: '08',
    label: 'Step one',
    meaning: 'The audit is the first climb.',
  },
} as const;

export type ImageNarrativeKey = keyof typeof IMAGE_NARRATIVE;
