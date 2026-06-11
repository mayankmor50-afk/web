'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { shouldInstantReveal } from '@/lib/motion-policy';

/**
 * NumberScramble — forensic digit decode on reveal
 */
export function NumberScramble({
  value,
  className = '',
  duration = 1200,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);
  const chars = '0123456789$%→.x-+';

  useLayoutEffect(() => {
    if (shouldInstantReveal()) setStarted(true);
  }, []);

  useEffect(() => {
    if (shouldInstantReveal()) return;
    const el = ref.current;
    if (!el) return;

    const markStarted = () => setStarted(true);
    const checkNow = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.92 && rect.bottom > 0) markStarted();
    };

    checkNow();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) markStarted();
      },
      { threshold: [0, 0.15, 0.35], rootMargin: '60px 0px' },
    );
    observer.observe(el);
    window.addEventListener('scroll', checkNow, { passive: true });
    const t = window.setTimeout(checkNow, 200);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkNow);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!started) return;

    const target = value;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const resolved = Math.floor(progress * target.length);

      const scrambled = target
        .split('')
        .map((ch, i) => {
          if (i < resolved) return ch;
          if (
            ch === ' ' ||
            ch === '→' ||
            ch === '$' ||
            ch === '%' ||
            ch === '.' ||
            ch === 'x' ||
            ch === '-' ||
            ch === '–' ||
            ch === ',' ||
            ch === 'k' ||
            ch === 'M' ||
            ch === '/' ||
            ch === '+'
          ) {
            return ch;
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplay(scrambled);
      frame = requestAnimationFrame(tick);

      if (progress >= 1) {
        cancelAnimationFrame(frame);
        setDisplay(target);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
