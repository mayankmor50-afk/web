'use client';

import Link from 'next/link';
import { AuditFaqSection } from '@/components/landing/audit-faq-section';
import { AuditStickyCta } from '@/components/landing/audit-sticky-cta';
import { ConnectionScene } from '@/components/landing/connection-scene';
import { HorizonScene } from '@/components/landing/horizon-scene';
import { PhaseSlider } from '@/components/landing/phase-slider';
import { ScheduleLink } from '@/components/landing/schedule-link';
import { SceneNote } from '@/components/landing/scene-note';
import { FinalCtaClosure } from '@/components/landing/final-cta-closure';
import { useInView } from '@/lib/use-in-view';
import { revealClass } from '@/lib/reveal-class';
import {
  AUDIT_FINAL,
  AUDIT_FIT,
  AUDIT_HOW,
  AUDIT_PAGE,
  AUDIT_PROOF,
} from '@/lib/audit-content';
import { SITE } from '@/lib/site-tokens';

export function AuditPageContent() {
  const { ref: introRef, inView: introInView } = useInView(0.15);
  const { ref: howRef, inView: howInView } = useInView(0.12);
  const { ref: sliderRef, inView: sliderInView } = useInView(0.08);
  const { ref: fitRef, inView: fitInView } = useInView(0.12);
  const { ref: finalRef, inView: finalInView } = useInView(0.15);

  return (
    <main className="audit-page" style={{ background: SITE.bg, minHeight: '100vh' }}>
      <AuditStickyCta />

      <header className="audit-page__header">
        <Link href="/" className="font-body audit-page__back">
          ← Back to home
        </Link>
        <ScheduleLink variant="outline" label="Book a call" showPlus={false} placement="bottom-end">
          Book call
        </ScheduleLink>
      </header>

      {/* Intro — orientation, not a proposal */}
      <section ref={introRef} className="audit-page__intro audit-page__intro--integrated section-pad">
        <ConnectionScene scrim="intro" />
        <SceneNote narrative="connection" visible={introInView} align="right" className="audit-intro-scene-note" />
        <div className="site-container audit-page__intro-inner">
          <p className={`section-eyebrow ${revealClass(introInView, 'fade-only')}`}>{AUDIT_PAGE.eyebrow}</p>
          <h1 className={`font-display audit-page__title ${revealClass(introInView)}`}>{AUDIT_PAGE.title}</h1>
          <p className={`font-body audit-page__subtitle ${revealClass(introInView, 'fade-only')}`}>
            {AUDIT_PAGE.subtitle}
          </p>

          <div className={`audit-page__hero-actions ${revealClass(introInView, 'fade-only')}`}>
            <ScheduleLink variant="link" label="Book a call" showPlus className="audit-page-book-call">
              Book a call +
            </ScheduleLink>
            <p className="font-body audit-page__fine-print">{AUDIT_PAGE.notProposalNote}</p>
          </div>

          <div className={`audit-page__proof-row ${revealClass(introInView, 'fade-only')}`}>
            {AUDIT_PROOF.map((item) => (
              <div key={item.label} className="audit-page__proof">
                <div className="font-display audit-page__proof-stat">{item.stat}</div>
                <div className="font-body audit-page__proof-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it starts — before phases */}
      <section ref={howRef} className="audit-page__how section-pad">
        <div className="site-container">
          <p className={`section-eyebrow ${revealClass(howInView, 'fade-only')}`}>{AUDIT_HOW.eyebrow}</p>
          <h2 className={`font-display audit-page__section-title ${revealClass(howInView)}`}>{AUDIT_HOW.title}</h2>
          <div className="audit-page__how-grid">
            {AUDIT_HOW.steps.map((step, i) => (
              <div
                key={step.n}
                className={`audit-page__how-step ${revealClass(howInView, 'fade-only')}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className="audit-page__how-num font-body">{step.n}</span>
                <h3 className="font-display audit-page__how-title">{step.title}</h3>
                <p className="font-body audit-page__how-copy">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase explorer */}
      <section ref={sliderRef} className="audit-page__slider-section section-pad">
        <div className="audit-page__slider-glow" aria-hidden="true" />
        <div className="site-container audit-page__slider-wrap">
          <p className={`section-eyebrow ${revealClass(sliderInView, 'fade-only')}`}>
            {AUDIT_PAGE.phasesEyebrow}
          </p>
          <h2 className={`font-display audit-page__section-title ${revealClass(sliderInView)}`}>
            {AUDIT_PAGE.phasesTitle}
          </h2>
          <p className={`font-body audit-page__phases-intro ${revealClass(sliderInView, 'fade-only')}`}>
            {AUDIT_PAGE.phasesIntro}
          </p>
          <PhaseSlider />
        </div>
      </section>

      {/* Who this is for */}
      <section ref={fitRef} className="audit-page__fit section-pad">
        <div className="site-container audit-page__fit-grid">
          <div className={`audit-page__fit-copy ${revealClass(fitInView)}`}>
            <p className="section-eyebrow">{AUDIT_FIT.eyebrow}</p>
            <h2 className="font-display audit-page__section-title">{AUDIT_FIT.title}</h2>
            <p className="font-body audit-page__fit-body">{AUDIT_FIT.body}</p>
          </div>
          <div className={`audit-page__fit-lists ${revealClass(fitInView, 'fade-only')}`}>
            <div className="audit-page__fit-col">
              <h3 className="font-body audit-page__fit-label">Good fit</h3>
              <ul className="font-body">
                {AUDIT_FIT.fits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="audit-page__fit-col audit-page__fit-col--muted">
              <h3 className="font-body audit-page__fit-label">Not the right fit</h3>
              <ul className="font-body">
                {AUDIT_FIT.notFit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AuditFaqSection />

      {/* Final CTA */}
      <section id="audit-final" ref={finalRef} className="audit-page__final audit-page__final--horizon scene-section--integrated section-pad">
        <HorizonScene variant="realTimeGraph" />
        <div className="site-container audit-page__final-inner">
          <h2 className={`font-display audit-page__final-title ${revealClass(finalInView)}`}>{AUDIT_FINAL.title}</h2>
          <p className={`font-body audit-page__final-copy ${revealClass(finalInView, 'fade-only')}`}>
            {AUDIT_FINAL.body}
          </p>
          <ScheduleLink variant="link" label="Book a call" showPlus className="audit-page-book-call">
            Book a call +
          </ScheduleLink>
          <p className="font-body audit-page__final-fine">{AUDIT_FINAL.finePrint}</p>
        </div>
      </section>

      <section className="site-closure-section audit-page__closure" aria-label="Site footer">
        <div className="site-container site-closure-section__inner">
          <FinalCtaClosure />
        </div>
      </section>
    </main>
  );
}
