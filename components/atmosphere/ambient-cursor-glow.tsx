'use client';

import { useEffect, useRef } from 'react';

/**
 * Soft amber light pool that follows the cursor — inspired by Tenbin's light beams.
 */
export function AmbientCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const targetRef = useRef({ x: -200, y: -200 });
  const frameRef = useRef(0);

  useEffect(() => {
    const prefersFine = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersFine || prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      const el = glowRef.current;
      if (el) {
        posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.08;
        posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.08;
        el.style.transform = `translate(${posRef.current.x - 280}px, ${posRef.current.y - 280}px)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        width: 560,
        height: 560,
        zIndex: 1,
        background:
          'radial-gradient(circle, rgba(184,135,58,0.045) 0%, rgba(184,135,58,0.015) 32%, transparent 68%)',
        willChange: 'transform',
      }}
    />
  );
}
