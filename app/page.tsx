'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SplitLinesReveal, TextReveal } from '@/components/effects/text-reveal';
import {
  FindingLine,
  ForensicDelta,
  ForensicFigure,
  ForensicPercent,
  ForensicPrice,
  ForensicQuote,
  ForensicRangeStat,
  ForensicStat,
  ForensicStep,
  FaqExhibitTag,
} from '@/components/effects/forensic-copy';
import { GsapSplitHeadline } from '@/components/effects/gsap-split-headline';
import { SectionWipe } from '@/components/effects/section-wipe';
import { LiveClock, SoundToggle } from '@/components/landing/nav-extras';
import { MagneticNavLink } from '@/components/landing/magnetic-nav-link';
import { useMagnetic } from '@/lib/use-magnetic';
import { BookingLink } from '@/components/landing/booking-link';
import { FinalCtaClosure } from '@/components/landing/final-cta-closure';
import { useInView } from '@/lib/use-in-view';
import { shouldInstantReveal } from '@/lib/motion-policy';
import { StickyAuditCta } from '@/components/landing/sticky-audit-cta';
import { MobileNav } from '@/components/landing/mobile-nav';
import { ForensicGrid } from '@/components/atmosphere/forensic-grid';
import { Bioluminescence } from '@/components/atmosphere/bioluminescence';
import { DataStreamCurtain } from '@/components/landing/data-stream-curtain';
import { useHeroScroll } from '@/components/effects/use-hero-scroll';
import { SITE } from '@/lib/site-tokens';
import { SceneImage } from '@/components/landing/scene-image';
import { SceneNote } from '@/components/landing/scene-note';
import { AboutPortrait } from '@/components/landing/about-portrait';
import { BRAND_IMAGES, IMAGE_FRAMES, phaseFrame } from '@/lib/image-framing';
import { revealClass } from '@/lib/reveal-class';
import type { RefObject } from 'react';

const FluidMeshOverlay = dynamic(
  () => import('@/components/3d/fluid-mesh-overlay').then(m => ({ default: m.FluidMeshOverlay })),
  { ssr: false }
);

const PROOF_HEADLINE_LINES: string[] = ['$502k found', 'in a single', 'brand audit.'];
const OFFER_HEADLINE_LINES: string[] = ['Fixed price.', 'Fixed deliverable.', 'No retainer trap.'];

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const auditCta = useMagnetic({ strength: 0.22 });
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
    <SoundToggle />
    <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: `16px ${SITE.padX}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(12,11,9,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div>
        <div className="font-display" style={{ fontSize: 15, color: SITE.cream, fontWeight: 700, letterSpacing: '0.01em' }}>
          Chetna Bhadkare
        </div>
        <div className="font-body" style={{ fontSize: 11, color: SITE.dim, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
          Retention & Profitability Strategist
        </div>
        <LiveClock />
      </div>
      <div className="nav-desktop">
        {[
          { label: 'Results', href: '#results' },
          { label: 'Process', href: '#process' },
          { label: 'Audit', href: '#audit' },
        ].map(link => (
          <MagneticNavLink key={link.href} href={link.href}>{link.label}</MagneticNavLink>
        ))}
        <BookingLink
          ref={auditCta.ref as RefObject<HTMLAnchorElement>}
          className="font-body"
          style={{
            fontSize: 13, fontWeight: 600,
            color: SITE.amber, border: `1px solid ${SITE.amber}`, padding: '8px 20px',
            textDecoration: 'none', letterSpacing: '0.04em', transition: 'all 0.2s',
            display: 'inline-block',
            ...auditCta.style,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = SITE.amber; e.currentTarget.style.color = SITE.bg; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = SITE.amber; }}
        >
          Book the Audit
        </BookingLink>
      </div>
      <button
        type="button"
        className="nav-mobile-toggle"
        aria-expanded={menuOpen}
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
      >
        Menu
      </button>
    </nav>
    </>
  );
}

// ─── SECTION 1: HERO ─────────────────────────────────────────────────────────
// Asset: hero video + cherry-tree.png poster/fallback

const HERO_VIDEO_SRC =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4';

function HeroSection() {
  const { translateY } = useHeroScroll();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <section className="hero-section">

      {/* Layer 1 — poster still (local) then video on top */}
      <div
        className="hero-scene"
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden',
          transform: reducedMotion ? undefined : `translate3d(0, ${translateY * 0.5}px, 0)`,
        }}
      >
        <SceneImage
          src={BRAND_IMAGES.cherryTree}
          priority
          sizes="100vw"
          objectFit={IMAGE_FRAMES.heroVideo.objectFit}
          objectPosition={IMAGE_FRAMES.heroVideo.objectPosition}
          style={{ filter: IMAGE_FRAMES.cherryTree.filter }}
        />
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster={BRAND_IMAGES.cherryTree}
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: IMAGE_FRAMES.heroVideo.objectFit,
            objectPosition: IMAGE_FRAMES.heroVideo.objectPosition,
            opacity: IMAGE_FRAMES.heroVideo.opacity,
            zIndex: 1,
          }}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* Layer 2 — amber forensic mesh (courser: screen blend ~22%) */}
      <FluidMeshOverlay />

      {/* Layer 2b — light forensic grid */}
      <ForensicGrid opacity={0.1} />

      {/* Layer 3 — lighter vignettes so magenta blossoms breathe */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 3,
        background: 'linear-gradient(to top, rgba(12,11,9,0.62) 0%, rgba(12,11,9,0.22) 42%, transparent 100%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 3,
        background: 'linear-gradient(to right, rgba(12,11,9,0.55) 0%, rgba(12,11,9,0.12) 38%, transparent 68%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 3,
        background: 'linear-gradient(to bottom, rgba(12,11,9,0.18) 0%, transparent 28%)' }} />

      <SceneNote narrative="hero" align="right" className="hero-scene-note" />

      {/* Content */}
      <div className="site-container" style={{ position: 'relative', zIndex: 4, padding: `0 ${SITE.padX} clamp(64px, 10vw, 96px)` }}>

        <TextReveal delay={80}>
          <div className="section-eyebrow" style={{ marginBottom: 24 }}>
            DTC Retention Strategy · $100k–$4M/month
          </div>
        </TextReveal>

        <h1 className="font-display" style={{
          fontSize: 'clamp(44px, 7vw, 80px)',
          fontWeight: 700,
          lineHeight: 1.08,
          margin: '0 0 28px',
          maxWidth: 700,
          letterSpacing: '-0.02em',
        }}>
          <SplitLinesReveal
            lines={['Your second sale', 'is where', 'margin lives.']}
            highlightIndex={2}
            lineDelay={140}
            markHighlight
            baseStyle={{ color: '#E8E2D9' }}
          />
        </h1>

        <TextReveal delay={620}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            color: '#9A9590',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 0 40px',
          }}>
            We find the <ForensicFigure>$200k–$1.4M</ForensicFigure> sitting in your existing customer database
            and build the system that keeps capturing it.
          </p>
        </TextReveal>

        <TextReveal delay={780}>
          <BookingLink className="btn-primary font-body" style={{ fontSize: 14, padding: '14px 32px' }}>
            Book the Retention Audit →
          </BookingLink>
        </TextReveal>

        {/* Anchor stats — credibility below the fold line */}
        <div
          className="hero-stats font-body"
          style={{
            display: 'flex',
            gap: 'clamp(24px, 5vw, 56px)',
            marginTop: 56,
            paddingTop: 32,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            flexWrap: 'wrap',
          }}
        >
          <ForensicRangeStat
            low={{ value: 200, suffix: 'k' }}
            high={{ value: 1.4, suffix: 'M' }}
            label="Typical audit find"
          />
          <ForensicStat value="5–7 days" label="Audit delivered" />
          <div className="forensic-stat">
            <ForensicPercent value={80} className="forensic-stat__value" />
            <div className="forensic-stat__label">Continue after audit</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 2: PROBLEM ──────────────────────────────────────────────────────
// Asset: bridge.png — two islands, amber span across the void
// Intensity: LOW → building — stats on one shore; the crossing visible beside them

function ProblemSection() {
  const { ref, inView } = useInView(0.15);
  const bridgeWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = bridgeWrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const section = ref.current;
      if (!section || reduced) return;
      const rect = section.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      const t = Math.max(0, Math.min(1, progress));
      const y = t * IMAGE_FRAMES.bridge.parallaxTranslateMax;
      const scale = IMAGE_FRAMES.bridge.baseScale + t * (IMAGE_FRAMES.bridge.parallaxScaleMax - IMAGE_FRAMES.bridge.baseScale);
      wrap.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);

  const lines = [
    { stat: 'CAC up 200%+ since 2015.', rest: 'Repeat rate: unchanged.' },
    { stat: '65% of DTC revenue', rest: 'comes from existing customers. Most brands spend nothing building them.' },
    { stat: 'Good months don\'t compound.', rest: 'Every month starts from zero.' },
  ];

  return (
    <section ref={ref} className="gap-section" style={{ position: 'relative', overflow: 'hidden', background: SITE.bg2 }}>
      <DataStreamCurtain />
      <div className="gap-layout" style={{ position: 'relative', zIndex: 1 }}>

        <div className="gap-copy">
          <div className={`section-eyebrow ${revealClass(inView)}`} style={{ marginBottom: 48 }}>
            The gap
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {lines.map((line, i) => (
              <FindingLine
                key={i}
                index={i + 1}
                stat={line.stat}
                rest={line.rest}
                visible={inView}
                delay={i * 0.12 + 0.1}
              />
            ))}
          </div>

          <p
            className={`gap-span-caption ${revealClass(inView, 'fade-only')}`}
            style={{ marginTop: 40, transitionDelay: '0.45s' }}
          >
            Most brands fund acquisition. Few build the bridge to repeat revenue.
          </p>
        </div>

        <div className="bridge-col gap-bridge-col">
          <div
            ref={bridgeWrapRef}
            className="bridge-visual-media"
            style={{ filter: IMAGE_FRAMES.bridge.filter }}
          >
            <SceneImage
              src={BRAND_IMAGES.bridge}
              sizes="(max-width: 900px) 100vw, 58vw"
              objectFit={IMAGE_FRAMES.bridge.objectFit}
              objectPosition={IMAGE_FRAMES.bridge.objectPosition}
              priority={false}
            />
          </div>
          <div className="bridge-visual-edge" aria-hidden="true" />
          <div className="gap-bridge-fade-left" aria-hidden="true" />
          <div className="gap-bridge-fade-bottom" aria-hidden="true" />
          <SceneNote narrative="bridge" visible={inView} align="center" />
        </div>

      </div>
    </section>
  );
}

// ─── SECTION 3: METHOD ───────────────────────────────────────────────────────
// Asset: cherry-tree.png — left panel

function MethodSection() {
  const { ref, inView } = useInView(0.1);
  const visualWrapRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = visualWrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const section = ref.current;
      if (!section || reduced) return;
      const rect = section.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      const y = Math.max(0, Math.min(1, progress)) * IMAGE_FRAMES.cherryTree.parallaxTranslateMax;
      const scale = IMAGE_FRAMES.cherryTree.baseScale + Math.max(0, Math.min(1, progress)) * (IMAGE_FRAMES.cherryTree.parallaxScaleMax - IMAGE_FRAMES.cherryTree.baseScale);
      wrap.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);

  useEffect(() => {
    if (!inView) return;
    const nodes = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.stepIdx);
            if (!Number.isNaN(idx)) setActiveStep(idx);
          }
        });
      },
      { threshold: 0.55, rootMargin: '-12% 0px -35% 0px' },
    );

    nodes.forEach((node) => obs.observe(node));
    return () => obs.disconnect();
  }, [inView]);

  const steps = [
    { n: '01', title: 'Diagnose', copy: '7 days in your data. A ranked map of every revenue opportunity, valued in dollars.' },
    { n: '02', title: 'Build', copy: 'We build the top 2–3 levers. Fixed scope. Fixed price. 60–90 days.' },
    { n: '03', title: 'Compound', copy: 'Monthly intelligence on what\'s moving, what\'s next, and exactly what it\'s worth.' },
  ];

  return (
    <section id="process" ref={ref} className="method-section" style={{ background: SITE.bg, overflow: 'hidden' }}>
      <div className="method-layout">

        <div className="method-visual-col method-visual-col--desktop">
          <div
            ref={visualWrapRef}
            className="method-visual-media"
            style={{ filter: IMAGE_FRAMES.cherryTree.filter }}
          >
            <SceneImage
              src={BRAND_IMAGES.cherryTree}
              sizes="(max-width: 900px) 100vw, 55vw"
              objectFit={IMAGE_FRAMES.cherryTree.objectFit}
              objectPosition={IMAGE_FRAMES.cherryTree.objectPosition}
            />
          </div>
          <div className="method-visual-edge" aria-hidden="true" />
          <div className="method-visual-scrim method-visual-scrim--side" aria-hidden="true" />
          <div className="method-visual-scrim method-visual-scrim--bottom" aria-hidden="true" />
          <SceneNote narrative="method" visible={inView} align="left" />
        </div>

        <div className="method-copy">

          <div className="method-intro">
            <div className="method-intro-scene" aria-hidden="true">
              <div
                className="method-intro-media"
                style={{ filter: IMAGE_FRAMES.cherryTree.filter }}
              >
                <SceneImage
                  src={BRAND_IMAGES.cherryTree}
                  sizes="100vw"
                  objectFit={IMAGE_FRAMES.cherryTree.objectFit}
                  objectPosition="50% 32%"
                />
              </div>
              <div className="method-visual-edge method-intro-edge" aria-hidden="true" />
              <div className="method-visual-scrim method-visual-scrim--bottom method-intro-scrim" aria-hidden="true" />
            </div>

            <div
              className={`section-eyebrow method-intro__eyebrow ${revealClass(inView, 'fade-only')}`}
            >
              How it works
            </div>

            <h2 className={`font-display method-intro__headline ${revealClass(inView)}`} style={{
              transitionDelay: '0.1s',
            }}>
              Three phases.<br />Fixed price.<br />Fixed deliverable.
            </h2>
          </div>

          <div className="method-steps">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { stepRefs.current[i] = el; }}
                data-step-idx={i}
              >
                <ForensicStep
                  index={step.n}
                  title={step.title}
                  copy={step.copy}
                  visible={inView}
                  delay={0.2 + i * 0.1}
                  active={activeStep === i}
                  past={activeStep > i}
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

// ─── SECTION 4: PROOF ────────────────────────────────────────────────────────
// Asset: whale.png — spotlight reveal as signature scroll moment
// Intensity: HIGH — the page's cinematic peak; the hidden scale revealed

function ProofSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const { ref: textRef, inView: textInView } = useInView(0.2);

  useLayoutEffect(() => {
    if (shouldInstantReveal()) setRevealed(true);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const revealIfVisible = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        setRevealed(true);
      }
    };

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setRevealed(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    revealIfVisible();
    window.addEventListener('scroll', revealIfVisible, { passive: true });

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', revealIfVisible);
    };
  }, []);

  // Whale parallax on scroll
  useEffect(() => {
    const handle = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const layer = wrapper.querySelector('.whale-parallax') as HTMLDivElement | null;
      if (layer) {
        const y = (progress - 0.5) * IMAGE_FRAMES.whale.parallaxTranslateMax;
        layer.style.transform = `translate3d(0, ${y}px, 0) scale(${IMAGE_FRAMES.whale.parallaxScale})`;
      }
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const cases = [
    { brand: 'Lily.mk', category: 'Women\'s Apparel', before: '3.7%', after: '36%', label: 'repeat revenue', timeline: '90 days' },
    { brand: 'Denman Tea', category: 'Consumable', before: '23%', after: '37%', label: 'sustained', timeline: '10 months' },
    { brand: 'Atlantic Naturals', category: 'Supplements', before: '0%', after: '37%', label: 'retention revenue', timeline: '6 months' },
  ];

  return (
    <section id="results" className="proof-section" style={{ position: 'relative', background: '#060605', overflow: 'hidden' }}>

      <div ref={wrapperRef} className="whale-scene">
        <Bioluminescence />
        <ForensicGrid opacity={0.06} />
        <div className="whale-parallax" style={{ willChange: 'transform', filter: IMAGE_FRAMES.whale.filter }}>
          <SceneImage
            src={BRAND_IMAGES.whale}
            sizes="100vw"
            objectFit={IMAGE_FRAMES.whale.objectFit}
            objectPosition={IMAGE_FRAMES.whale.objectPosition}
          />
        </div>
        <div
          className="whale-scene-spotlight"
          style={{
            position: 'absolute', inset: 0,
            background: revealed
              ? `radial-gradient(${IMAGE_FRAMES.whale.spotlight}, rgba(0,0,0,0) 30%, rgba(0,0,0,0.22) 64%, rgba(0,0,0,0.78) 100%)`
              : IMAGE_FRAMES.whale.preRevealOverlay,
            transition: 'background 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <div className="whale-scene-legibility" aria-hidden="true" />
        <SceneNote narrative="whale" visible={revealed} align="right" />
      </div>

      {/* Content — sits above whale */}
      <div ref={textRef} className="site-container section-pad proof-content" style={{ position: 'relative', zIndex: 2, paddingBottom: 'clamp(64px, 10vw, 96px)' }}>

        <div className="proof-row">

          {/* Left: headline */}
          <div style={{ maxWidth: 480 }}>
            <div className={revealClass(textInView, 'fade-only')} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#B8873A',
              letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 24,
            }}>
              Results
            </div>
            <GsapSplitHeadline
              lines={PROOF_HEADLINE_LINES}
              highlightLine={2}
              accentFigures
              countUpFigures
              style={{ fontSize: 'clamp(36px, 5vw, 62px)', lineHeight: 1.1, color: '#E8E2D9' }}
            />
          </div>

          {/* Right: case study rows */}
          <div className="proof-cases" style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 340, flex: 1 }}>
            {cases.map((c, i) => (
              <div
                key={i}
                className={`proof-case-row ${revealClass(textInView)}`}
                style={{
                  borderTop: i === 0 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.06)',
                  padding: '20px 0',
                  transitionDelay: `${0.3 + i * 0.12}s`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: '#E8E2D9' }}>{c.brand}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6B6560', marginLeft: 8, letterSpacing: '0.1em' }}>{c.category}</span>
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6B6560' }}>{c.timeline}</span>
                </div>
                <ForensicDelta before={c.before} after={c.after} label={c.label} />
              </div>
            ))}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#4A4440', marginTop: 16, fontStyle: 'italic' }}>
              These are not projections. They are what happened.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── SECTION 5: OFFER ────────────────────────────────────────────────────────
// Asset: shield.png (bg) + audit/encrypted/permissions for phase cards
// Intensity: MEDIUM — calm authority; shield = what we protect

function OfferSection() {
  const { ref, inView } = useInView(0.1);
  const shieldWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = shieldWrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const section = document.getElementById('audit');
      if (!section || reduced) return;
      const rect = section.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      const t = Math.max(0, Math.min(1, progress));
      const y = t * IMAGE_FRAMES.shield.parallaxTranslateMax;
      const scale = IMAGE_FRAMES.shield.baseScale + t * (IMAGE_FRAMES.shield.parallaxScaleMax - IMAGE_FRAMES.shield.baseScale);
      wrap.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phases = [
    {
      n: '01', name: 'The Retention Audit', price: '$1,000 – $3,000',
      meta: '5–7 days · One-time · Paid upfront',
      copy: 'A complete diagnostic. A ranked map of every revenue lever, valued in dollars. Buy this and stop if you want. 80% don\'t.',
      image: BRAND_IMAGES.audit,
      note: 'Forensic read',
    },
    {
      n: '02', name: 'The Build Sprint', price: '$1,500 – $8,000',
      meta: '60–90 days · Fixed scope · 50% upfront',
      copy: 'I build the top 2–3 levers. Win-back campaign, RFM segmentation, automated flows, retention dashboard. Handed over completely.',
      image: BRAND_IMAGES.encrypted,
      note: 'Locked build',
    },
    {
      n: '03', name: 'The Compounding Layer', price: '$1,000 – $4,000 / mo',
      meta: '3-month minimum · Fixed monthly output',
      copy: 'Monthly dashboard. One strategic call. Written insight. Only offered after Phase 2 results are visible.',
      image: BRAND_IMAGES.permissions,
      note: 'Compounding layer',
    },
  ];

  return (
    <section id="audit" className="offer-section" style={{ position: 'relative', background: '#0C0B09', overflow: 'hidden' }}>

      <div className="offer-shield-bg" aria-hidden="true">
        <div
          ref={shieldWrapRef}
          className="offer-shield-media"
          style={{ filter: IMAGE_FRAMES.shield.filter }}
        >
          <SceneImage
            src={BRAND_IMAGES.shield}
            sizes="100vw"
            objectFit={IMAGE_FRAMES.shield.objectFit}
            objectPosition={IMAGE_FRAMES.shield.objectPosition}
          />
        </div>
        <div className="offer-shield-edge" />
        <div className="offer-shield-scrim" />
        <SceneNote narrative="shield" visible={inView} align="right" className="offer-shield-note" />
      </div>

      <div ref={ref} className="site-container section-pad offer-content" style={{ position: 'relative', zIndex: 1 }}>

        <div className={revealClass(inView, 'fade-only')} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#B8873A',
          letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 24,
        }}>
          The offer
        </div>

        <div style={{ marginBottom: 64, maxWidth: 560 }}>
          <GsapSplitHeadline
            lines={OFFER_HEADLINE_LINES}
            style={{ fontSize: 'clamp(30px, 4vw, 50px)', color: '#E8E2D9' }}
          />
        </div>

        <div className="offer-grid">
          {phases.map((phase, i) => (
            <div key={i} className={`offer-card ${revealClass(inView)}`} style={{
              transitionDelay: `${0.2 + i * 0.12}s`,
            }}>
              <div className="offer-card-header">
                <SceneImage
                  src={phase.image}
                  sizes="(max-width: 900px) 100vw, 33vw"
                  objectFit="cover"
                  objectPosition={phaseFrame(phase.image).objectPosition}
                  style={{ filter: phaseFrame(phase.image).filter }}
                />
                <div className="offer-card-header-fade" aria-hidden="true" />
                <div className="offer-phase-note">{phase.note}</div>
              </div>
              <div className="offer-card-body">
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#B8873A', letterSpacing: '0.16em', marginBottom: 20 }}>
                  PHASE {phase.n}
                </div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: '#E8E2D9', marginBottom: 8 }}>
                  {phase.name}
                </div>
                <ForensicPrice value={phase.price} />
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6B6560', letterSpacing: '0.08em', marginBottom: 20 }}>
                  {phase.meta}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#9A9590', lineHeight: 1.7, margin: 0 }}>
                  {phase.copy}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-page CTA */}
        <div className={revealClass(inView, 'fade-only')} style={{ textAlign: 'center', marginTop: 56, transitionDelay: '0.6s' }}>
          <a href="#final-cta" className="btn-primary font-body" style={{ fontSize: 14, padding: '14px 32px' }}>
            Start with the Audit →
          </a>
        </div>

      </div>
    </section>
  );
}

// ─── SECTION 6: ABOUT ────────────────────────────────────────────────────────
// Asset: about-connection.png — full-section backdrop; portrait slot sits in front
// Intensity: LOW — quiet, human, trust-building

function AboutSection() {
  const { ref, inView } = useInView(0.15);
  const visualWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = visualWrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const section = ref.current;
      if (!section || reduced) return;
      const rect = section.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      const t = Math.max(0, Math.min(1, progress));
      const y = t * IMAGE_FRAMES.aboutConnection.parallaxTranslateMax;
      const scale = IMAGE_FRAMES.aboutConnection.baseScale + t * (IMAGE_FRAMES.aboutConnection.parallaxScaleMax - IMAGE_FRAMES.aboutConnection.baseScale);
      wrap.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);

  return (
    <section className="about-section" style={{ background: SITE.bg2, overflow: 'hidden' }}>
      <div className="about-connection-bg" aria-hidden="true">
        <div
          ref={visualWrapRef}
          className="about-connection-media"
          style={{ filter: IMAGE_FRAMES.aboutConnection.filter }}
        >
          <SceneImage
            src={BRAND_IMAGES.aboutConnection}
            sizes="100vw"
            objectFit={IMAGE_FRAMES.aboutConnection.objectFit}
            objectPosition={IMAGE_FRAMES.aboutConnection.objectPosition}
          />
        </div>
        <div className="about-connection-edge" />
        <div className="about-connection-scrim" />
      </div>

      <div ref={ref} className="about-layout">

        <div className={`about-portrait-col ${revealClass(inView)}`}>
          <AboutPortrait />
          <SceneNote narrative="about" visible={inView} align="left" />
        </div>

        <div className={`about-copy ${revealClass(inView)}`} style={{ transitionDelay: '0.15s' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#B8873A', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 24 }}>
            Who does this
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 32, fontWeight: 700, color: '#E8E2D9',
            margin: '0 0 16px', lineHeight: 1.2,
          }}>
            Chetna Bhadkare
          </h2>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#B8873A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 }}>
            Retention & Profitability Strategist
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#9A9590', lineHeight: 1.8, margin: '0 0 48px' }}>
            Not an agency. Not a generalist. A focused system for finding what's already
            in your business and building the infrastructure that keeps capturing it.
            Works with DTC brands doing $100k–$4M/month in pet food, supplements,
            skincare, coffee, and haircare.
          </p>

          {/* Testimonials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { quote: 'We went from 3.7% to 36% repeat revenue in 90 days. The system runs itself now.', name: 'Lily.mk', role: 'Women\'s Apparel' },
              { quote: '31% of our revenue is now automated retention. It compounds every month.', name: 'Denman Tea', role: 'Consumable Brand' },
            ].map((t, i) => (
              <div key={i} style={{ borderLeft: '1px solid rgba(184,135,58,0.3)', paddingLeft: 20 }}>
                <ForensicQuote text={t.quote} />
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6B6560', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {t.name} · {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── SECTION 7: FAQ ──────────────────────────────────────────────────────────
// Asset: faq-data-graph.png — customer graph; every question maps to revenue

function FaqSection() {
  const { ref, inView } = useInView(0.1);
  const graphWrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const wrap = graphWrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const section = ref.current;
      if (!section || reduced) return;
      const rect = section.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      const t = Math.max(0, Math.min(1, progress));
      const y = t * IMAGE_FRAMES.faqDataGraph.parallaxTranslateMax;
      const scale = IMAGE_FRAMES.faqDataGraph.baseScale + t * (IMAGE_FRAMES.faqDataGraph.parallaxScaleMax - IMAGE_FRAMES.faqDataGraph.baseScale);
      wrap.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);

  const items = [
    { q: 'What do I get from the audit?', a: 'A ranked map of every retention revenue lever in your business, valued in dollars. Delivered in 5–7 days. Fixed fee, paid upfront.', node: 'Lever map' },
    { q: 'Do I have to continue after the audit?', a: 'No. About 80% of brands do — because the audit surfaces enough to justify the build. But the audit stands alone.', node: 'Standalone audit' },
    { q: 'Who is this for?', a: 'DTC brands doing $100k–$4M/month in pet food, supplements, skincare, coffee, and haircare — with enough customer data to diagnose.', node: 'RFM cohorts' },
    { q: 'How is this different from an agency?', a: 'Fixed scope. Fixed price. No retainer trap. One strategist, forensic focus on retention and gross profit — not brand campaigns.', node: 'Fixed scope' },
  ];

  return (
    <section ref={ref} className="faq-section section-pad" style={{ position: 'relative', background: SITE.bg2, borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div className="faq-graph-bg" aria-hidden="true">
        <div
          ref={graphWrapRef}
          className="faq-graph-media"
          style={{ filter: IMAGE_FRAMES.faqDataGraph.filter }}
        >
          <SceneImage
            src={BRAND_IMAGES.faqDataGraph}
            sizes="100vw"
            objectFit={IMAGE_FRAMES.faqDataGraph.objectFit}
            objectPosition={IMAGE_FRAMES.faqDataGraph.objectPosition}
          />
        </div>
        <div className="faq-graph-edge" />
        <div className="faq-graph-scrim" />
        <div className="faq-graph-nodes" aria-hidden="true">
          {items.map((item, i) => (
            <span
              key={item.node}
              className="faq-graph-node"
              style={{
                top: `${22 + i * 17}%`,
                right: `${14 + (i % 2) * 8}%`,
                opacity: open === i ? 1 : 0.35,
              }}
            >
              {item.node}
            </span>
          ))}
        </div>
        <SceneNote narrative="faq" visible={inView} align="right" className="faq-graph-note" />
      </div>

      <div className="site-container faq-layout">

      <div className="faq-copy">
        <div className={revealClass(inView, 'fade-only')} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#B8873A',
          letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12,
        }}>
          Questions
        </div>
        <p className={`font-body ${revealClass(inView, 'fade-only')}`} style={{
          fontSize: 14, color: '#6B6560', lineHeight: 1.65, margin: '0 0 40px', maxWidth: 520,
          transitionDelay: '0.08s',
        }}>
          Every answer ties back to a lever in your customer file — audit scope, build deliverables, or who this is built for.
        </p>
        {items.map((item, i) => (
          <div key={i} className={revealClass(inView)} style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            transitionDelay: `${i * 0.08}s`,
          }}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                padding: '24px 0', textAlign: 'left',
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 18, fontWeight: 700, color: '#E8E2D9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                <span className="faq-item-index">{String(i + 1).padStart(2, '0')}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                  <span className="faq-node-tag" style={{ opacity: open === i ? 1 : 0.45 }}>{item.node}</span>
                  {item.q}
                </span>
              </span>
              <span style={{ color: '#B8873A', fontSize: 20, flexShrink: 0 }}>{open === i ? '−' : '+'}</span>
            </button>
            <div
              className={`faq-answer${open === i ? ' faq-answer--open' : ''}`}
              style={{
                maxHeight: open === i ? 280 : 0,
                opacity: open === i ? 1 : 0,
              }}
            >
              <FaqExhibitTag index={i + 1} node={item.node} open={open === i} />
              <p className="font-body faq-answer__text" style={{ fontSize: 15, color: '#9A9590', lineHeight: 1.7, margin: '0 0 24px', paddingRight: 32 }}>
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>

      </div>
    </section>
  );
}

// ─── SECTION 8: FINAL CTA ────────────────────────────────────────────────────
// Asset: cta-staircase.png — first step upward; audit is where the climb begins
// Intensity: CALM — resolves the page; confident, not shouty

function FinalCTASection() {
  const { ref, inView } = useInView(0.2);
  const ctaWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ctaWrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const section = document.getElementById('final-cta');
      if (!section || reduced) return;
      const rect = section.getBoundingClientRect();
      const progress = 1 - rect.top / window.innerHeight;
      const t = Math.max(0, Math.min(1, progress));
      const y = t * IMAGE_FRAMES.ctaStaircase.parallaxTranslateMax;
      const scale = IMAGE_FRAMES.ctaStaircase.baseScale + t * (IMAGE_FRAMES.ctaStaircase.parallaxScaleMax - IMAGE_FRAMES.ctaStaircase.baseScale);
      wrap.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="final-cta" className="final-cta-section" style={{ position: 'relative', background: '#0C0B09', overflow: 'hidden' }}>

      <div className="cta-scene" aria-hidden="true">
        <div
          ref={ctaWrapRef}
          className="cta-scene-media"
          style={{
            filter: IMAGE_FRAMES.ctaStaircase.filter,
            opacity: IMAGE_FRAMES.ctaStaircase.mediaOpacity,
          }}
        >
          <SceneImage
            src={BRAND_IMAGES.ctaStaircase}
            sizes="100vw"
            objectFit={IMAGE_FRAMES.ctaStaircase.objectFit}
            objectPosition={IMAGE_FRAMES.ctaStaircase.objectPosition}
          />
        </div>
        <div className="cta-scene-edge" aria-hidden="true" />
        <div className="cta-scene-readability" aria-hidden="true" />
      </div>

      <div className="final-cta-stack site-container section-pad">
        <div ref={ref} className="final-cta-copy">
          <div className={`final-cta-eyebrow font-body ${revealClass(inView, 'fade-only')}`}>
            Start here
          </div>

          <h2 className={`final-cta-headline ${revealClass(inView)}`} style={{ transitionDelay: '0.1s' }}>
            The audit is where we start.
          </h2>

          <p className={`final-cta-body font-body ${revealClass(inView, 'fade-only')}`} style={{ transitionDelay: '0.2s' }}>
            Most brands find <ForensicFigure>$200,000–$600,000</ForensicFigure> in identifiable gross profit at this stage.
            Everything else follows from what we find.
          </p>

          <div className={`final-cta-action ${revealClass(inView, 'fade-only')}`} style={{ transitionDelay: '0.3s' }}>
            <BookingLink className="btn-primary font-body final-cta-btn">
              Book the Retention Audit →
            </BookingLink>
            <div className="final-cta-meta font-body">
              Fixed fee · Paid upfront · Delivered in 5–7 days
            </div>
          </div>

          <SceneNote
            narrative="cta"
            visible={inView}
            align="center"
            className="final-cta-scene-note"
          />
        </div>
      </div>
    </section>
  );
}

function SiteClosureSection() {
  return (
    <section className="site-closure-section" aria-label="Site footer">
      <div className="site-container site-closure-section__inner">
        <FinalCtaClosure />
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Avoid landing on a black proof overlay from a restored scroll position
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0C0B09]">
      <Navigation />
      <StickyAuditCta />
      <HeroSection />
      <SectionWipe fromColor="#0C0B09" toColor="#080807" />
      <ProblemSection />
      <SectionWipe fromColor="#080807" toColor="#0C0B09" />
      <MethodSection />
      <SectionWipe fromColor="#0C0B09" toColor="#060605" />
      <ProofSection />
      <SectionWipe fromColor="#060605" toColor="#0C0B09" height={80} />
      <OfferSection />
      <SectionWipe fromColor="#0C0B09" toColor="#080807" height={72} />
      <AboutSection />
      <SectionWipe fromColor="#080807" toColor="#0C0B09" height={64} />
      <FaqSection />
      <FinalCTASection />
      <SiteClosureSection />
    </main>
  );
}
