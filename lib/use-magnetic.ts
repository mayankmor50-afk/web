'use client';

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';

/** Subtle cursor attraction for CTAs and nav links */
export function useMagnetic({ strength = 0.3 }: { strength?: number } = {}) {
  const ref = useRef<HTMLElement>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      setStyle({
        transform: `translate(${dx}px, ${dy}px)`,
        transition: 'transform 0.15s ease-out',
      });
    };

    const onLeave = () => {
      setStyle({ transform: 'translate(0, 0)', transition: 'transform 0.4s ease-out' });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return { ref, style };
}

export type MagneticRef = RefObject<HTMLElement>;
