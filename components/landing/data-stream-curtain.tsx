'use client';

import { useEffect, useRef } from 'react';

const CHARS = '0123456789%$→+-';

interface Stream {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  col: number;
}

interface DataStreamCurtainProps {
  /** Peak alpha of the amber digits (the opacity ceiling). Default matches the calm ambient value. */
  maxOpacity?: number;
  /** Stacking context for the canvas relative to its container. */
  zIndex?: number;
}

export function DataStreamCurtain({ maxOpacity = 0.04, zIndex = 2 }: DataStreamCurtainProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const colWidth = 18;
    const colCount = Math.ceil(canvas.width / colWidth) + 1;
    const streams: Stream[] = Array.from({ length: colCount }, (_, i) => ({
      x: i * colWidth,
      y: Math.random() * canvas.height,
      speed: 0.15 + Math.random() * 0.25,
      chars: Array.from({ length: 14 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
      col: i,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '11px ui-monospace, monospace';
      ctx.textAlign = 'center';

      streams.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvas.height + 120) {
          s.y = -120;
          s.chars = s.chars.map(() => CHARS[Math.floor(Math.random() * CHARS.length)]);
        }

        s.chars.forEach((ch, j) => {
          const py = s.y + j * 16;
          if (py < -20 || py > canvas.height + 20) return;
          const fade = 1 - j / s.chars.length;
          ctx.fillStyle = `rgba(184, 135, 58, ${maxOpacity * fade})`;
          ctx.fillText(ch, s.x + colWidth / 2, py);
        });
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [maxOpacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex }}
    />
  );
}
