'use client';

import { useState } from 'react';
import { FaqGraphAtmosphere } from '@/components/landing/faq-graph-atmosphere';
import { SceneImage } from '@/components/landing/scene-image';
import { AUDIT_FAQ, AUDIT_FAQ_SECTION } from '@/lib/audit-content';
import { BRAND_IMAGES, IMAGE_FRAMES } from '@/lib/image-framing';
import { revealClass } from '@/lib/reveal-class';
import { useInView } from '@/lib/use-in-view';

export function AuditFaqSection() {
  const { ref, inView } = useInView(0.12);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section ref={ref} className="audit-page__faq section-pad">
      <div className="audit-page__faq-bg" aria-hidden="true">
        <div className="faq-graph-glow faq-graph-glow--primary audit-page__faq-glow" />
        <div className="audit-page__faq-graph-media">
          <SceneImage
            src={BRAND_IMAGES.faqDataGraph}
            sizes="100vw"
            objectFit={IMAGE_FRAMES.faqDataGraph.objectFit}
            objectPosition={IMAGE_FRAMES.faqDataGraph.objectPosition}
            style={{
              filter: IMAGE_FRAMES.faqDataGraph.filter,
              opacity: IMAGE_FRAMES.faqDataGraph.mediaOpacity,
            }}
          />
        </div>
        <FaqGraphAtmosphere />
        <div className="audit-page__faq-edge" />
        <div className="audit-page__faq-scrim" />
      </div>

      <div className="site-container audit-page__faq-inner">
        <p className={`section-eyebrow ${revealClass(inView, 'fade-only')}`}>{AUDIT_FAQ_SECTION.eyebrow}</p>
        <h2 className={`font-display audit-page__section-title ${revealClass(inView)}`}>{AUDIT_FAQ_SECTION.title}</h2>
        <p className={`font-body audit-page__faq-lead ${revealClass(inView, 'fade-only')}`}>
          {AUDIT_FAQ_SECTION.lead}
        </p>

        <div className="audit-page__faq-list">
          {AUDIT_FAQ.map((item, i) => (
            <div key={item.q} className={`audit-page__faq-item ${revealClass(inView)}`}>
              <button
                type="button"
                className="audit-page__faq-trigger font-display"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span className="audit-page__faq-trigger-text">
                  <span className="audit-page__faq-node font-body">{item.node}</span>
                  {item.q}
                </span>
                <span aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
              </button>
              <div
                className={`audit-page__faq-answer font-body${openFaq === i ? ' audit-page__faq-answer--open' : ''}`}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
