'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SplitLinesReveal, TextReveal } from '@/components/effects/text-reveal';
import { GsapSplitHeadline } from '@/components/effects/gsap-split-headline';
import { NumberScramble } from '@/components/effects/number-scramble';
import { SectionWipe } from '@/components/effects/section-wipe';
import { ForensicGrid } from '@/components/atmosphere/forensic-grid';
import { Bioluminescence } from '@/components/atmosphere/bioluminescence';
import { DataStreamCurtain } from '@/components/landing/data-stream-curtain';
import { ForensicPercent, ForensicStat } from '@/components/effects/forensic-copy';
import {
  ExperimentClipReveal,
  ExperimentGlitchText,
  ExperimentMagneticField,
  ExperimentScrollPin,
} from '@/components/experiments/lab-experiments';
import { SITE } from '@/lib/site-tokens';

const FluidMeshOverlay = dynamic(
  () => import('@/components/3d/fluid-mesh-overlay').then((m) => ({ default: m.FluidMeshOverlay })),
  { ssr: false },
);

const SakuraDepthField = dynamic(
  () => import('@/components/3d/sakura-depth-field').then((m) => ({ default: m.SakuraDepthField })),
  { ssr: false },
);

const SECTIONS = [
  { id: 'type', label: 'Typography' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'scroll', label: 'Scroll' },
  { id: 'atmosphere', label: 'Atmosphere' },
  { id: 'three', label: '3D' },
  { id: 'new', label: 'New demos' },
] as const;

function LabSection({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="fx-lab__section">
      <div className="fx-lab__section-head">
        <p className="fx-lab__eyebrow font-body">{note}</p>
        <h2 className="fx-lab__section-title font-display">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function EffectsLab() {
  return (
    <main id="main-content" className="fx-lab">
      <header className="fx-lab__hero">
        <Link href="/" className="fx-lab__back font-body">
          ← Back to site
        </Link>
        <p className="fx-lab__eyebrow font-body">Internal sandbox</p>
        <h1 className="fx-lab__title font-display">
          <ExperimentGlitchText>Effects Lab</ExperimentGlitchText>
        </h1>
        <p className="fx-lab__lead font-body">
          Scroll through live building blocks from the Chetna site — plus experiments we can
          promote to production when they earn their place.
        </p>
        <nav className="fx-lab__nav font-body" aria-label="Lab sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <LabSection id="type" title="Typography & reveal" note="Existing · text-reveal.tsx">
        <div className="fx-lab__stack">
          <GsapSplitHeadline
            lines={['Forensic', 'margin', 'mapping.']}
            highlightLine={1}
            className="fx-lab__headline font-display"
          />
          <SplitLinesReveal
            lines={['Your second sale', 'is where', 'margin lives.']}
            highlightIndex={2}
            baseStyle={{ fontSize: 'clamp(22px, 3vw, 32px)', color: SITE.cream, lineHeight: 1.2 }}
            markHighlight
          />
          <TextReveal delay={400}>
            <p className="font-body" style={{ color: SITE.muted, maxWidth: 480 }}>
              TextReveal fades copy in with forensic easing — used on eyebrows and supporting lines.
            </p>
          </TextReveal>
        </div>
      </LabSection>

      <SectionWipe fromColor="#0C0B09" toColor="#080807" height={72} />

      <LabSection id="numbers" title="Forensic numbers" note="Existing · forensic-copy.tsx">
        <div className="fx-lab__stat-row">
          <div className="fx-lab__stat">
            <ForensicStat value="$502k" label="Audit gross profit" />
          </div>
          <div className="fx-lab__stat">
            <p className="fx-lab__eyebrow font-body">ForensicPercent</p>
            <ForensicPercent value={80} />
            <p className="font-body" style={{ color: SITE.dim, fontSize: 12, marginTop: 8 }}>
              Continue after audit
            </p>
          </div>
          <div className="fx-lab__stat">
            <p className="fx-lab__eyebrow font-body">NumberScramble</p>
            <NumberScramble value="$502k" className="font-display fx-lab__scramble" />
          </div>
        </div>
      </LabSection>

      <SectionWipe fromColor="#080807" toColor="#060605" height={72} />

      <LabSection id="scroll" title="Scroll choreography" note="Existing · section-wipe.tsx">
        <p className="fx-lab__hint font-body">
          Section wipes bridge color zones on the homepage. Below: pinned horizontal scroll (new
          experiment).
        </p>
      </LabSection>

      <ExperimentScrollPin />

      <LabSection id="atmosphere" title="Atmosphere layers" note="Existing · atmosphere/">
        <div className="fx-lab__atmos-grid">
          <div className="fx-lab__atmos-panel fx-lab__atmos-panel--grid">
            <ForensicGrid />
            <span className="fx-lab__panel-label font-body">Forensic grid</span>
          </div>
          <div className="fx-lab__atmos-panel fx-lab__atmos-panel--bio">
            <Bioluminescence />
            <span className="fx-lab__panel-label font-body">Bioluminescence</span>
          </div>
          <div className="fx-lab__atmos-panel fx-lab__atmos-panel--stream">
            <DataStreamCurtain />
            <span className="fx-lab__panel-label font-body">Data stream curtain</span>
          </div>
        </div>
      </LabSection>

      <LabSection id="three" title="WebGL / Three.js" note="Existing · components/3d/">
        <div className="fx-lab__three-grid">
          <div className="fx-lab__three-panel">
            <FluidMeshOverlay />
            <span className="fx-lab__panel-label font-body">Fluid mesh overlay</span>
          </div>
          <div className="fx-lab__three-panel fx-lab__three-panel--sakura">
            <SakuraDepthField />
            <span className="fx-lab__panel-label font-body">Sakura depth field</span>
          </div>
        </div>
      </LabSection>

      <LabSection id="new" title="New experiments" note="Sandbox only">
        <div className="fx-lab__stack">
          <ExperimentClipReveal />
          <div>
            <p className="fx-lab__eyebrow font-body">Magnetic field</p>
            <ExperimentMagneticField />
          </div>
          <p className="fx-lab__hint font-body">
            Hover tiles — cursor pull uses the same hook as nav CTAs. Glitch title at top is pure
            CSS.
          </p>
        </div>
      </LabSection>

      <footer className="fx-lab__footer font-body">
        <p>Not linked from production nav. Promote winners to <code>home-page.tsx</code>.</p>
        <Link href="/">Return to landing page</Link>
      </footer>
    </main>
  );
}
