'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { animateCount, formatMetricValue } from '@/lib/count-up';
import { shouldInstantReveal } from '@/lib/motion-policy';
import { isElementVisible } from '@/lib/use-in-view';

interface GsapSplitHeadlineProps {
  lines: string[];
  highlightLine?: number;
  highlightColor?: string;
  style?: CSSProperties;
  stagger?: number;
  className?: string;
  /** Wrap $ figures in amber tabular styling */
  accentFigures?: boolean;
  /** Count up $ figures instead of static highlight */
  countUpFigures?: boolean;
}

interface HeadlineAnimConfig {
  lines: string[];
  highlightLine: number | null;
  highlightColor: string;
  stagger: number;
  textColor: string;
  accentFigures: boolean;
  countUpFigures: boolean;
}

function accentDollarFigures(text: string, countUp: boolean) {
  if (!countUp) {
    return text.replace(
      /(\$[\d,.]+[kKmM]?)/g,
      '<span class="forensic-figure">$1</span>',
    );
  }

  return text.replace(
    /(\$\d+(?:\.\d+)?(?:k|M)?)/gi,
    (match) => {
      const parsed = match.match(/\$(\d+(?:\.\d+)?)(k|M)?/i);
      if (!parsed) return match;
      const num = parsed[1];
      const suffix = (parsed[2] || '').toLowerCase();
      const decimals = num.includes('.') ? 1 : 0;
      return `<span class="forensic-figure forensic-figure--count" data-count-up="${num}" data-prefix="$" data-suffix="${suffix}" data-decimals="${decimals}">${formatMetricValue(0, decimals, '$', suffix)}</span>`;
    },
  );
}

function runHeadlineCountUps(container: HTMLElement) {
  const spans = container.querySelectorAll<HTMLElement>('[data-count-up]');
  const cancels: Array<() => void> = [];

  spans.forEach((span, i) => {
    const target = parseFloat(span.dataset.countUp || '0');
    const prefix = span.dataset.prefix || '';
    const suffix = span.dataset.suffix || '';
    const decimals = parseInt(span.dataset.decimals || '0', 10);
    const delay = i * 120;

    const start = () => {
      const cancel = animateCount(0, target, 1400, (n) => {
        span.textContent = formatMetricValue(n, decimals, prefix, suffix);
      });
      cancels.push(cancel);
    };

    if (delay > 0) {
      const t = setTimeout(start, delay);
      cancels.push(() => clearTimeout(t));
    } else {
      start();
    }
  });

  return () => cancels.forEach((fn) => fn());
}

function buildAnimationSignature(config: HeadlineAnimConfig) {
  return JSON.stringify(config);
}

function shouldUseStaticHeadline() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    shouldInstantReveal()
  );
}

/** Line-level reveal — editorial, not letter-salad */
export function GsapSplitHeadline({
  lines,
  highlightLine,
  highlightColor = '#B8873A',
  style,
  stagger = 0.14,
  className = '',
  accentFigures = false,
  countUpFigures = false,
}: GsapSplitHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const textColor = style?.color ?? '#E8E2D9';
  const signature = buildAnimationSignature({
    lines,
    highlightLine: highlightLine ?? null,
    highlightColor,
    stagger,
    textColor,
    accentFigures,
    countUpFigures,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const config: HeadlineAnimConfig = JSON.parse(signature);

    if (shouldUseStaticHeadline()) {
      if (config.countUpFigures && config.accentFigures) {
        const cancel = runHeadlineCountUps(el);
        return () => cancel();
      }
      return;
    }

    el.innerHTML = config.lines
      .map((line, lineIdx) => {
        const color =
          lineIdx === config.highlightLine ? config.highlightColor : config.textColor;
        const content = config.accentFigures
          ? accentDollarFigures(line, config.countUpFigures)
          : line;
        return `<span class="gsap-line" style="display:block;overflow:hidden;color:${color}"><span class="gsap-line-inner" style="display:block">${content}</span></span>`;
      })
      .join('');

    let ctx: { revert: () => void } | undefined;
    let cancelCountUps: (() => void) | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let io: IntersectionObserver | undefined;

    const revealNow = async () => {
      const gsap = (await import('gsap')).default;
      const inners = el.querySelectorAll('.gsap-line-inner');
      gsap.set(inners, { yPercent: 0, opacity: 1, filter: 'blur(0px)' });
      if (config.countUpFigures) {
        cancelCountUps?.();
        cancelCountUps = runHeadlineCountUps(el);
      }
    };

    const run = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const inners = el.querySelectorAll('.gsap-line-inner');
      gsap.set(inners, { yPercent: 108, opacity: 0, filter: 'blur(4px)' });

      const forceRevealIfNeeded = () => {
        if (!isElementVisible(el, 0.05)) return;
        const first = inners[0] as HTMLElement | undefined;
        if (!first) return;
        if (parseFloat(window.getComputedStyle(first).opacity) < 0.5) {
          void revealNow();
        }
      };

      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            forceRevealIfNeeded();
            io?.disconnect();
          }
        },
        { threshold: [0, 0.08, 0.15], rootMargin: '100px 0px 100px 0px' },
      );
      io.observe(el);
      forceRevealIfNeeded();

      ctx = gsap.context(() => {
        gsap.to(inners, {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.05,
          stagger: config.stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
            onEnter: () => {
              if (config.countUpFigures) {
                cancelCountUps?.();
                cancelCountUps = runHeadlineCountUps(el);
              }
            },
          },
        });
        ScrollTrigger.refresh();
      }, el);

      fallbackTimer = setTimeout(forceRevealIfNeeded, 1800);
    };

    void run();

    return () => {
      cancelCountUps?.();
      io?.disconnect();
      if (fallbackTimer) clearTimeout(fallbackTimer);
      ctx?.revert();
    };
  }, [signature]);

  return (
    <h2
      ref={ref}
      className={`font-display ${className}`.trim()}
      suppressHydrationWarning
      style={{
        fontWeight: 700,
        lineHeight: 1.12,
        margin: 0,
        ...style,
      }}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          style={{
            display: 'block',
            color: i === highlightLine ? highlightColor : textColor,
          }}
        >
          {line}
        </span>
      ))}
    </h2>
  );
}
