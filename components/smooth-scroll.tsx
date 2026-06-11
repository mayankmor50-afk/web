'use client';

import { useEffect } from 'react';
import 'lenis/dist/lenis.css';

export function SmoothScroll() {
  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void; scroll: number; scrollTo: (value: number) => void } | null = null;
    let frameId = 0;
    let cancelled = false;
    let gsapTicker: ((time: number) => void) | null = null;

    const initLenis = async () => {
      const { isTouchPrimaryDevice, isFigmaCaptureMode } = await import('@/lib/motion-policy');
      if (isTouchPrimaryDevice() || isFigmaCaptureMode()) return;

      const Lenis = (await import('lenis')).default;
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const instance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2,
      });
      lenis = instance;

      instance.on('scroll', ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (lenis && arguments.length && typeof value === 'number') {
            lenis.scrollTo(value);
          }
          return lenis?.scroll ?? window.scrollY;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      ScrollTrigger.addEventListener('refresh', () => lenis?.raf(performance.now()));
      ScrollTrigger.refresh();

      gsapTicker = (time: number) => {
        instance.raf(time * 1000);
      };
      gsap.ticker.add(gsapTicker);
      gsap.ticker.lagSmoothing(0);

      instance.on('scroll', () => {
        window.dispatchEvent(new Event('scroll'));
      });
    };

    initLenis();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      if (gsapTicker) {
        void import('gsap').then(({ default: gsap }) => {
          gsap.ticker.remove(gsapTicker!);
        });
      }
      lenis?.destroy();
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  return null;
}
