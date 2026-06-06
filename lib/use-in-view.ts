'use client';

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { isTouchPrimaryDevice, shouldInstantReveal } from '@/lib/motion-policy';

export function isElementVisible(el: HTMLElement, threshold = 0.08) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.height <= 0) return false;

  const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  const ratio = visibleHeight / rect.height;
  return ratio >= threshold || (rect.top < vh * 0.92 && rect.bottom > vh * 0.06);
}

/** Reliable in-view detection — touch devices show content immediately after mount */
export function useInView(threshold = 0.08): {
  ref: RefObject<HTMLDivElement | null>;
  inView: boolean;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [touchMotion, setTouchMotion] = useState(false);
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    const touchPrimary =
      document.documentElement.classList.contains('touch-device') || isTouchPrimaryDevice();
    const instant = shouldInstantReveal();
    setTouchMotion(instant);
    if (touchPrimary) {
      document.documentElement.classList.add('touch-device');
    }
    if (instant) {
      setInView(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || touchMotion) return;

    const el = ref.current;
    if (!el) return;

    const markVisible = () => setInView(true);

    const checkNow = () => {
      if (isElementVisible(el, threshold)) markVisible();
    };

    checkNow();

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) markVisible();
      },
      {
        threshold: [0, 0.05, 0.1, Math.min(threshold, 0.25)],
        rootMargin: '120px 0px 120px 0px',
      },
    );

    obs.observe(el);
    window.addEventListener('scroll', checkNow, { passive: true });
    window.addEventListener('resize', checkNow, { passive: true });

    const t = window.setTimeout(checkNow, 100);
    const t2 = window.setTimeout(checkNow, 500);

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', checkNow);
      window.removeEventListener('resize', checkNow);
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [mounted, touchMotion, threshold]);

  const visible = mounted && (touchMotion || inView);

  return { ref, inView: visible };
}
