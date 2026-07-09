'use client';

import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { useMagnetic } from '@/lib/use-magnetic';
import { BRAND_IMAGES } from '@/lib/image-framing';
import { SceneImage } from '@/components/landing/scene-image';

/** Clip-path image reveal on scroll */
export function ExperimentClipReveal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const media = mediaRef.current;
    if (!wrap || !media) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      media.style.clipPath = 'inset(0% 0% 0% 0%)';
      return;
    }

    let ctx: { revert: () => void } | undefined;

    const run = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          media,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 75%',
              end: 'top 25%',
              scrub: 0.8,
            },
          },
        );
      }, wrap);
    };

    void run();
    return () => ctx?.revert();
  }, []);

  return (
    <div ref={wrapRef} className="fx-lab__clip">
      <div ref={mediaRef} className="fx-lab__clip-media">
        <SceneImage
          src={BRAND_IMAGES.cherryTree}
          sizes="(max-width: 900px) 100vw, 50vw"
          objectFit="cover"
          objectPosition="50% 38%"
        />
      </div>
      <p className="fx-lab__clip-label font-body">Clip-path scrub reveal</p>
    </div>
  );
}

/** Pinned horizontal scroll strip */
export function ExperimentScrollPin() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const cards = [
    { title: 'Scramble', copy: 'Forensic digit decode on enter' },
    { title: 'Wipe', copy: 'Section color transitions on scroll' },
    { title: 'Split', copy: 'GSAP line-by-line headline' },
    { title: 'Mesh', copy: 'Three.js amber wireframe overlay' },
    { title: 'Lenis', copy: 'Smooth scroll + ScrollTrigger sync' },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let ctx: { revert: () => void } | undefined;

    const run = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const getScroll = () => track.scrollWidth - window.innerWidth;

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -getScroll(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScroll()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }, section);
    };

    void run();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="fx-lab__pin-section">
      <div className="fx-lab__pin-header">
        <p className="fx-lab__eyebrow font-body">Scroll experiment</p>
        <h3 className="font-display">Pinned horizontal strip</h3>
      </div>
      <div className="fx-lab__pin-viewport">
        <div ref={trackRef} className="fx-lab__pin-track">
          {cards.map((card) => (
            <article key={card.title} className="fx-lab__pin-card">
              <span className="fx-lab__pin-num font-body">{card.title}</span>
              <p className="font-display">{card.title}</p>
              <p className="font-body">{card.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MagneticTile({ label }: { label: string }) {
  const mag = useMagnetic({ strength: 0.35 });

  return (
    <button
      type="button"
      ref={mag.ref as RefObject<HTMLButtonElement>}
      className="fx-lab__magnetic-tile font-body"
      style={mag.style}
    >
      {label}
    </button>
  );
}

export function ExperimentMagneticField() {
  const labels = ['Audit', 'Cohort', 'RFM', 'Win-back', 'Margin', 'Compound'];
  return (
    <div className="fx-lab__magnetic-grid">
      {labels.map((label) => (
        <MagneticTile key={label} label={label} />
      ))}
    </div>
  );
}

export function ExperimentGlitchText({ children }: { children: string }) {
  return (
    <span className="fx-lab__glitch font-display" data-text={children}>
      {children}
    </span>
  );
}
