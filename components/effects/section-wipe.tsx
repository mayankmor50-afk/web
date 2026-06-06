'use client';

import { useEffect, useRef } from 'react';

interface SectionWipeProps {
  fromColor: string;
  toColor: string;
  height?: number;
}

export function SectionWipe({ fromColor, toColor, height = 100 }: SectionWipeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const fill = fillRef.current;
    const line = lineRef.current;
    if (!container || !fill || !line) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      fill.style.transform = 'scaleY(1)';
      line.style.transform = 'scaleX(1)';
      return;
    }

    let ctx: { revert: () => void } | undefined;

    const run = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'top 55%',
              scrub: 0.6,
              scroller: document.documentElement,
            },
          }
        );

        gsap.fromTo(
          line,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.4,
              scroller: document.documentElement,
            },
          }
        );
        ScrollTrigger.refresh();
      }, container);
    };

    void run();

    return () => {
      ctx?.revert();
    };
  }, [fromColor, toColor]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'relative',
        height,
        background: fromColor,
        overflow: 'hidden',
        zIndex: 5,
      }}
    >
      <div
        ref={fillRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: toColor,
          transformOrigin: 'bottom center',
          transform: 'scaleY(0)',
        }}
      />
      <div
        ref={lineRef}
        style={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          top: '50%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, #B8873A, transparent)',
          transformOrigin: 'center',
          transform: 'scaleX(0)',
          opacity: 0,
        }}
      />
    </div>
  );
}
