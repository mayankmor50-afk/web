'use client';

import { useEffect, useState } from 'react';

export function useHeroScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = now - lastT;
      if (dt > 0) {
        setVelocity((y - lastY) / dt);
      }
      setScrollY(y);
      lastY = y;
      lastT = now;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const progress = Math.min(scrollY / vh, 1);
  const scale = 1 + progress * 0.06;
  const translateY = progress * 40;
  const blur = progress * 2;
  const contentOpacity = 1 - progress * 0.35;
  const skew = Math.max(Math.min(velocity * 0.4, 2), -2);

  return { scrollY, progress, scale, translateY, blur, contentOpacity, skew };
}
