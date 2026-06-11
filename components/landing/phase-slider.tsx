'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { SceneImage } from '@/components/landing/scene-image';
import { ScheduleLink } from '@/components/landing/schedule-link';
import { AUDIT_PAGE, PARTNERSHIP_PHASES, type PartnershipPhase } from '@/lib/audit-content';
import { phaseFrame } from '@/lib/image-framing';
import { isFigmaCaptureMode } from '@/lib/motion-policy';

function phaseTabId(baseId: string, phaseId: string) {
  return `${baseId}-tab-${phaseId}`;
}

function phasePanelId(baseId: string, phaseId: string) {
  return `${baseId}-panel-${phaseId}`;
}

function PhaseStatusBadge({ phase }: { phase: PartnershipPhase }) {
  const mod =
    phase.status === 'open'
      ? 'phase-slider__badge--open'
      : phase.status === 'invitation'
        ? 'phase-slider__badge--invitation'
        : 'phase-slider__badge--sequential';

  return (
    <span className={`phase-slider__badge font-body ${mod}`}>
      {phase.status === 'sequential' && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="2.5" y="5" width="7" height="5.5" rx="1" stroke="currentColor" strokeWidth="1" />
          <path d="M4 5V3.8a1.2 1.2 0 0 1 1.2-1.2h1.6A1.2 1.2 0 0 1 8 3.8V5" stroke="currentColor" strokeWidth="1" />
        </svg>
      )}
      {phase.statusLabel}
    </span>
  );
}

type PhaseSliderProps = {
  onActiveChange?: (index: number) => void;
};

export function PhaseSlider({ onActiveChange }: PhaseSliderProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const [captureMode, setCaptureMode] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);

  const goTo = useCallback((index: number) => {
    setActive(Math.max(0, Math.min(PARTNERSHIP_PHASES.length - 1, index)));
    setDragOffset(0);
  }, []);

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  useLayoutEffect(() => {
    setCaptureMode(isFigmaCaptureMode());
  }, []);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  const onPointerDown = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
  };

  const onPointerMove = (clientX: number) => {
    if (!isDragging || !trackRef.current) return;
    const width = trackRef.current.offsetWidth;
    setDragOffset((clientX - dragStartX.current) / width);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -0.15) goTo(active + 1);
    else if (dragOffset > 0.15) goTo(active - 1);
    setDragOffset(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sliderRef.current?.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(active + 1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(active - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  const translate = -(active + dragOffset) * 100;
  const swipeHint = isTouch ? AUDIT_PAGE.swipeHintTouch : AUDIT_PAGE.swipeHintDesktop;

  return (
    <div ref={sliderRef} className={`phase-slider${captureMode ? ' phase-slider--capture' : ''}`}>
      <div className="phase-slider__picker" role="tablist" aria-label="Partnership phases">
        {PARTNERSHIP_PHASES.map((p, i) => (
          <button
            key={p.id}
            id={phaseTabId(baseId, p.id)}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={phasePanelId(baseId, p.id)}
            tabIndex={active === i ? 0 : -1}
            className={`phase-slider__pill font-body${active === i ? ' phase-slider__pill--active' : ''}`}
            onClick={() => goTo(i)}
          >
            <span className="phase-slider__pill-num">{p.number}</span>
            {p.tabLabel}
          </button>
        ))}
      </div>

      <p className="phase-slider__hint font-body">{swipeHint}</p>

      <div
        className="phase-slider__viewport"
        ref={trackRef}
        tabIndex={0}
        aria-label="Partnership phase details. Use arrow keys to change phase."
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
        onTouchEnd={onPointerUp}
      >
        <div
          className={`phase-slider__track${isDragging ? ' phase-slider__track--dragging' : ''}`}
          style={{ transform: `translate3d(${translate}%, 0, 0)` }}
        >
          {PARTNERSHIP_PHASES.map((p, i) => (
            <article
              key={p.id}
              id={phasePanelId(baseId, p.id)}
              role="tabpanel"
              aria-labelledby={phaseTabId(baseId, p.id)}
              aria-hidden={!captureMode && active !== i}
              inert={!captureMode && active !== i ? true : undefined}
              tabIndex={active === i ? 0 : -1}
              className="phase-slider__slide"
            >
              <div
                className={`phase-slider__card${p.status !== 'open' ? ' phase-slider__card--locked' : ''}`}
              >
                <div className="phase-slider__visual">
                  <SceneImage
                    src={p.image}
                    alt={p.name}
                    priority={i === 0}
                    sizes="(max-width: 900px) 100vw, 440px"
                    objectFit={phaseFrame(p.image).objectFit}
                    objectPosition={phaseFrame(p.image).objectPosition}
                    style={{ filter: phaseFrame(p.image).filter }}
                  />
                </div>

                <div className="phase-slider__copy">
                  <PhaseStatusBadge phase={p} />
                  <span className="phase-slider__phase font-body">Phase {p.number}</span>
                  <h2 className="phase-slider__headline font-display">{p.headline}</h2>
                  {p.subhead && <p className="phase-slider__subhead font-body">{p.subhead}</p>}
                  <p className="phase-slider__body font-body">{p.body}</p>
                  <p className="phase-slider__duration font-body">{p.duration}</p>

                  {p.focus.length > 0 && (
                    <div className="phase-slider__focus">
                      <p className="phase-slider__focus-label font-body">{p.focusLabel}</p>
                      <ul className="phase-slider__list font-body">
                        {p.focus.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {p.id === 'audit' ? (
                    <ScheduleLink variant="link" label="Book a call" showPlus className="phase-slider__cta">
                      Book a call +
                    </ScheduleLink>
                  ) : (
                    p.footnote && (
                      <p className="phase-slider__footnote font-body">{p.footnote}</p>
                    )
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="phase-slider__dots" role="group" aria-label="Phase navigation">
        {PARTNERSHIP_PHASES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`phase-slider__dot${active === i ? ' phase-slider__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to phase ${p.number}: ${p.tabLabel}`}
            aria-current={active === i ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
