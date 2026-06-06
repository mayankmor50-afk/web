export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function animateCount(
  from: number,
  to: number,
  duration: number,
  onFrame: (value: number) => void,
  onDone?: () => void,
) {
  const start = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const value = from + (to - from) * easeOutCubic(t);
    onFrame(value);
    if (t < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      onFrame(to);
      onDone?.();
    }
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export interface ParsedMetric {
  target: number;
  prefix: string;
  suffix: string;
  decimals: number;
}

/** Parse proof-style metrics: 36%, 3.7%, $502k */
export function parseMetric(value: string): ParsedMetric | null {
  const trimmed = value.trim();

  const percent = trimmed.match(/^(\d+(?:\.\d+)?)%$/);
  if (percent) {
    const num = parseFloat(percent[1]);
    const decimals = percent[1].includes('.') ? 1 : 0;
    return { target: num, prefix: '', suffix: '%', decimals };
  }

  const dollarK = trimmed.match(/^\$(\d+(?:\.\d+)?)(k|M)$/i);
  if (dollarK) {
    const num = parseFloat(dollarK[1]);
    const suffix = dollarK[2].toLowerCase();
    const decimals = dollarK[1].includes('.') ? 1 : 0;
    return { target: num, prefix: '$', suffix, decimals };
  }

  const dollar = trimmed.match(/^\$(\d+(?:,\d{3})*(?:\.\d+)?)$/);
  if (dollar) {
    const num = parseFloat(dollar[1].replace(/,/g, ''));
    return { target: num, prefix: '$', suffix: '', decimals: 0 };
  }

  return null;
}

export function formatMetricValue(value: number, decimals: number, prefix: string, suffix: string) {
  const rounded = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  return `${prefix}${rounded}${suffix}`;
}
