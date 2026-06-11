'use client';

import { useEffect, useRef } from 'react';
import { SceneImage } from '@/components/landing/scene-image';
import { BRAND_IMAGES, IMAGE_FRAMES } from '@/lib/image-framing';

type ConnectionSceneProps = {
  className?: string;
  scrim?: 'intro' | 'default';
  parallax?: boolean;
};

/** Partnership thread — audit intro backdrop */
export function ConnectionScene({ className = '', scrim = 'default', parallax = true }: ConnectionSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frame = IMAGE_FRAMES.aboutConnection;

  useEffect(() => {
    if (!parallax) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const section = wrap.closest('section');
      if (!section || reduced) return;
      const rect = section.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      const t = Math.max(0, Math.min(1, progress));
      const y = t * frame.parallaxTranslateMax;
      const scale = frame.baseScale + t * (frame.parallaxScaleMax - frame.baseScale);
      wrap.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [parallax, frame]);

  return (
    <div
      className={`connection-scene${scrim === 'intro' ? ' connection-scene--intro' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <div
        ref={wrapRef}
        className="connection-scene__media"
        style={{
          filter: frame.filter,
          opacity: frame.mediaOpacity,
        }}
      >
        <SceneImage
          src={BRAND_IMAGES.aboutConnection}
          sizes="100vw"
          objectFit={frame.objectFit}
          objectPosition={frame.objectPosition}
        />
      </div>
      <div className="connection-scene__edge" />
      <div className={`connection-scene__scrim connection-scene__scrim--${scrim}`} />
    </div>
  );
}
