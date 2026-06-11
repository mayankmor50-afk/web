'use client';

import { useEffect, useRef } from 'react';
import { SceneImage } from '@/components/landing/scene-image';
import { BRAND_IMAGES, IMAGE_FRAMES } from '@/lib/image-framing';

type HorizonVariant = 'realTimeGraph' | 'wildflowerHill';

const VARIANTS: Record<
  HorizonVariant,
  {
    src: string;
    frame: (typeof IMAGE_FRAMES)['realTimeGraph'] | (typeof IMAGE_FRAMES)['wildflowerHill'];
  }
> = {
  realTimeGraph: { src: BRAND_IMAGES.realTimeGraph, frame: IMAGE_FRAMES.realTimeGraph },
  wildflowerHill: { src: BRAND_IMAGES.wildflowerHill, frame: IMAGE_FRAMES.wildflowerHill },
};

type HorizonSceneProps = {
  variant: HorizonVariant;
  className?: string;
  parallax?: boolean;
};

/** Panoramic bottom-horizon atmosphere — black sky, lit terrain strip */
export function HorizonScene({ variant, className = '', parallax = true }: HorizonSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { src, frame } = VARIANTS[variant];

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
      const y = t * (frame.parallaxTranslateMax ?? 0);
      const scale =
        (frame.baseScale ?? 1) + t * ((frame.parallaxScaleMax ?? 1) - (frame.baseScale ?? 1));
      wrap.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [parallax, frame]);

  return (
    <div className={`horizon-scene ${className}`.trim()} aria-hidden="true">
      <div
        ref={wrapRef}
        className="horizon-scene__media"
        style={{
          filter: frame.filter,
          opacity: frame.mediaOpacity,
        }}
      >
        <SceneImage
          src={src}
          sizes="100vw"
          objectFit={frame.objectFit}
          objectPosition={frame.objectPosition}
        />
      </div>
      <div className="horizon-scene__edge" />
      <div className="horizon-scene__scrim" />
    </div>
  );
}
