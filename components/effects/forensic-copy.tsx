'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { shouldInstantReveal } from '@/lib/motion-policy';
import { NumberScramble } from '@/components/effects/number-scramble';
import {
  animateCount,
  formatMetricValue,
  parseMetric,
} from '@/lib/count-up';

function useInViewCountUp(threshold = 0.35) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useLayoutEffect(() => {
    if (shouldInstantReveal()) {
      setStarted(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || shouldInstantReveal()) {
      setStarted(true);
      return;
    }

    const markStarted = () => setStarted(true);
    const checkNow = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.92 && rect.bottom > 0) markStarted();
    };

    checkNow();

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) markStarted();
    }, { threshold: [0, 0.1, threshold], rootMargin: '60px 0px' });
    obs.observe(el);
    window.addEventListener('scroll', checkNow, { passive: true });
    const t = window.setTimeout(checkNow, 200);

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', checkNow);
      window.clearTimeout(t);
    };
  }, [threshold]);

  return { ref, started };
}

/** Inline revenue figure — amber tabular highlight; glows near cursor */
export function ForensicFigure({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !fine) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const glow = Math.max(0, 1 - dist / 90);
      el.style.setProperty('--figure-glow', glow.toFixed(2));
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <span ref={ref} className={`forensic-figure ${className}`.trim()} style={{ '--figure-glow': '0' } as CSSProperties}>
      {children}
    </span>
  );
}

/** Count-up for dollar / percent metrics */
export function ForensicCountUp({
  value,
  duration = 1400,
  className = '',
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const { ref, started } = useInViewCountUp();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const parsed = parseMetric(value);
    if (!parsed) {
      setDisplay(value);
      return;
    }
    if (!started) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(formatMetricValue(parsed.target, parsed.decimals, parsed.prefix, parsed.suffix));
      return;
    }

    setDisplay(formatMetricValue(0, parsed.decimals, parsed.prefix, parsed.suffix));
    return animateCount(0, parsed.target, duration, (n) => {
      setDisplay(formatMetricValue(n, parsed.decimals, parsed.prefix, parsed.suffix));
    });
  }, [started, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/** Hero range stat — low bound first, then high bound */
export function ForensicRangeStat({
  low,
  high,
  separator = '–',
  label,
  className = '',
}: {
  low: { value: number; prefix?: string; suffix: string; decimals?: number };
  high: { value: number; prefix?: string; suffix: string; decimals?: number };
  separator?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'idle' | 'low' | 'pause' | 'high' | 'done'>('idle');
  const [lowDisplay, setLowDisplay] = useState(0);
  const [highDisplay, setHighDisplay] = useState(0);

  const lowPrefix = low.prefix ?? '$';
  const highPrefix = high.prefix ?? '$';
  const lowDecimals = low.decimals ?? 0;
  const highDecimals = high.decimals ?? 1;

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || shouldInstantReveal()) {
      setLowDisplay(low.value);
      setHighDisplay(high.value);
      setPhase('done');
    }
  }, [low.value, high.value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || shouldInstantReveal()) return;

    const mark = () => {
      if (phase === 'idle') setPhase('low');
    };
    const checkNow = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) mark();
    };

    checkNow();

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) mark();
    }, { threshold: [0, 0.12, 0.3], rootMargin: '80px 0px' });
    obs.observe(el);
    window.addEventListener('scroll', checkNow, { passive: true });
    const t = window.setTimeout(checkNow, 240);

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', checkNow);
      window.clearTimeout(t);
    };
  }, [phase, low.value, high.value]);

  useEffect(() => {
    if (phase !== 'low') return;
    return animateCount(0, low.value, 1100, setLowDisplay, () => setPhase('pause'));
  }, [phase, low.value]);

  useEffect(() => {
    if (phase !== 'pause') return;
    const t = setTimeout(() => setPhase('high'), 220);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'high') return;
    return animateCount(0, high.value, 1200, setHighDisplay, () => setPhase('done'));
  }, [phase, high.value]);

  const showHigh = phase === 'high' || phase === 'done';
  const lowStr = formatMetricValue(lowDisplay, lowDecimals, lowPrefix, low.suffix);
  const highStr = formatMetricValue(highDisplay, highDecimals, highPrefix, high.suffix);

  return (
    <div ref={ref} className={`forensic-stat forensic-range-stat ${className}`.trim()}>
      <div className="forensic-stat__value font-display forensic-range-stat__value">
        <span className="forensic-range-stat__low">{lowStr}</span>
        {showHigh && (
          <>
            <span className="forensic-range-stat__sep">{separator}</span>
            <span className="forensic-range-stat__high forensic-figure">{highStr}</span>
          </>
        )}
      </div>
      <div className="forensic-stat__label">{label}</div>
    </div>
  );
}

/** Hero / section stat with scramble decode */
export function ForensicStat({
  value,
  label,
  scramble = true,
  className = '',
}: {
  value: string;
  label: string;
  scramble?: boolean;
  className?: string;
}) {
  return (
    <div className={`forensic-stat ${className}`.trim()}>
      <div className="forensic-stat__value font-display">
        {scramble ? <NumberScramble value={value} duration={1100} /> : value}
      </div>
      <div className="forensic-stat__label">{label}</div>
    </div>
  );
}

/** Percentage count-up on scroll */
export function ForensicPercent({
  value,
  suffix = '%',
  duration = 1400,
  className = '',
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, started } = useInViewCountUp();
  const [display, setDisplay] = useState(0);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || shouldInstantReveal()) {
      setDisplay(value);
    }
  }, [value]);

  useEffect(() => {
    if (!started) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || shouldInstantReveal()) return;
    return animateCount(0, value, duration, (n) => setDisplay(Math.round(n)));
  }, [started, value, duration]);

  return (
    <span ref={ref} className={`forensic-stat__value font-display ${className}`.trim()}>
      {display}{suffix}
    </span>
  );
}

/** Before → after metric row (proof cases) */
export function ForensicDelta({
  before,
  after,
  label,
  className = '',
}: {
  before: string;
  after: string;
  label: string;
  className?: string;
}) {
  const parsed = parseMetric(after);

  return (
    <div className={`forensic-delta ${className}`.trim()}>
      <span className="forensic-delta__before">{before}</span>
      <span className="forensic-delta__arrow" aria-hidden="true">→</span>
      <span className="forensic-delta__after font-display forensic-figure">
        {parsed ? (
          <ForensicCountUp value={after} duration={1200} />
        ) : (
          after
        )}
      </span>
      <span className="forensic-delta__label">{label}</span>
    </div>
  );
}

/** Problem section — indexed finding with stat emphasis */
export function FindingLine({
  index,
  stat,
  rest,
  visible = false,
  delay = 0,
}: {
  index: number;
  stat: string;
  rest: string;
  visible?: boolean;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (shouldInstantReveal()) {
      setShow(true);
      return;
    }
    setShow(visible);
  }, [visible]);

  const tag = String(index).padStart(2, '0');
  return (
    <div
      className={`finding-line${show ? ' finding-line--visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <span className="finding-line__tag">Finding {tag}</span>
      <p className="finding-line__text">
        <span className="finding-line__stat font-display">{stat}</span>
        <span className="finding-line__rest"> {rest}</span>
      </p>
    </div>
  );
}

/** Method / process step with phase-lock dimming */
export function ForensicStep({
  index,
  title,
  copy,
  visible = false,
  delay = 0,
  active = false,
  past = false,
}: {
  index: string;
  title: string;
  copy: string;
  visible?: boolean;
  delay?: number;
  active?: boolean;
  past?: boolean;
}) {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (shouldInstantReveal()) {
      setShow(true);
      return;
    }
    setShow(visible);
  }, [visible]);

  const stateClass = active ? ' forensic-step--active' : past ? ' forensic-step--past' : ' forensic-step--future';

  return (
    <div
      className={`forensic-step${show ? ' forensic-step--visible' : ''}${stateClass}`}
      style={{ transitionDelay: `${delay}s` }}
      data-step={index}
    >
      <div className="forensic-step__index" aria-hidden="true">
        <span>{index}</span>
      </div>
      <div>
        <div className="forensic-step__title font-display">{title}</div>
        <div className="forensic-step__copy">{copy}</div>
      </div>
    </div>
  );
}

/** Offer card price with decode */
export function ForensicPrice({ value, className = '' }: { value: string; className?: string }) {
  return (
    <div className={`forensic-price font-body ${className}`.trim()}>
      <NumberScramble value={value} duration={1000} />
    </div>
  );
}

const METRIC_PATTERN = /^(\d+\.?\d*%|\$[\d,.]+[kKmM]?)$/;

export function ForensicQuote({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/(\d+\.?\d*%|\$[\d,.]+[kKmM]?)/g).filter(Boolean);
  return (
    <p className={`forensic-quote font-display ${className}`.trim()}>
      &ldquo;
      {parts.map((part, i) =>
        METRIC_PATTERN.test(part) ? (
          <ForensicFigure key={i}>{part}</ForensicFigure>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
      &rdquo;
    </p>
  );
}

/** FAQ answer exhibit label */
export function FaqExhibitTag({ index, node, open }: { index: number; node: string; open: boolean }) {
  return (
    <span className={`faq-exhibit-tag${open ? ' faq-exhibit-tag--open' : ''}`}>
      Exhibit {String(index).padStart(2, '0')} · {node}
    </span>
  );
}

/** Accent underline that draws in under headline highlights */
export function ForensicHeadlineMark({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      className="forensic-headline-mark"
      style={{ ...style, '--mark-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </span>
  );
}
