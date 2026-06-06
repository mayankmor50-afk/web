'use client';

import { useEffect, useRef, useState } from 'react';

type CursorMode = 'default' | 'interactive' | 'cta';

/**
 * Forensic cursor — amber crosshair + corner brackets on interactive targets.
 */
export function ForensicCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -120, y: -120 });
  const ringPosRef = useRef({ x: -120, y: -120 });
  const clickRef = useRef(0);
  const frameRef = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersFine = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersFine || prefersReduced) return;

    setEnabled(true);
    document.documentElement.classList.add('forensic-cursor-active');

    const setMode = (mode: CursorMode) => {
      rootRef.current?.setAttribute('data-mode', mode);
    };

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onDown = () => {
      clickRef.current = performance.now();
      rootRef.current?.setAttribute('data-click', '1');
    };

    const onEnterInteractive = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      setMode(target.matches('.btn-primary, [data-cursor="cta"]') ? 'cta' : 'interactive');
    };

    const onLeaveInteractive = () => setMode('default');

    const bindInteractive = () => {
      document.querySelectorAll('a, button, [data-cursor], summary, label').forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    };

    bindInteractive();
    const observer = new MutationObserver(bindInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    const tick = (now: number) => {
      const root = rootRef.current;
      if (root) {
        ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.14;
        ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.14;
        root.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0)`;

        if (now - clickRef.current > 280) {
          root.removeAttribute('data-click');
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('forensic-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      document.querySelectorAll('a, button, [data-cursor], summary, label').forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="forensic-cursor__dot-layer" aria-hidden="true">
        <div className="forensic-cursor__dot" />
      </div>
      <div
        ref={rootRef}
        className="forensic-cursor"
        data-mode="default"
        aria-hidden="true"
      >
        <div className="forensic-cursor__pulse" />
        <div className="forensic-cursor__cross forensic-cursor__cross--h" />
        <div className="forensic-cursor__cross forensic-cursor__cross--v" />
        <span className="forensic-cursor__corner forensic-cursor__corner--tl" />
        <span className="forensic-cursor__corner forensic-cursor__corner--tr" />
        <span className="forensic-cursor__corner forensic-cursor__corner--bl" />
        <span className="forensic-cursor__corner forensic-cursor__corner--br" />
        <span className="forensic-cursor__ring" />
      </div>
    </>
  );
}
