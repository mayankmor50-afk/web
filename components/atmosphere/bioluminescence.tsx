'use client';

import { useEffect, useRef } from 'react';

interface Plankton {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  opacity: number;
}

export function Bioluminescence() {
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

    const dots: Plankton[] = Array.from({ length: 72 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1.2 + Math.random() * 2.8,
      speed: 0.12 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.08 + Math.random() * 0.1,
    }));

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((d) => {
        d.y -= d.speed;
        d.x += Math.sin(t * 0.4 + d.phase) * 0.15;

        if (d.y < -10) {
          d.y = canvas.height + 10;
          d.x = Math.random() * canvas.width;
        }

        const pulse = 0.7 + Math.sin(t * 1.2 + d.phase) * 0.3;
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size * 3);
        g.addColorStop(0, `rgba(220, 240, 255, ${d.opacity * pulse})`);
        g.addColorStop(0.4, `rgba(184, 210, 255, ${d.opacity * pulse * 0.6})`);
        g.addColorStop(0.7, `rgba(184, 135, 58, ${d.opacity * pulse * 0.25})`);
        g.addColorStop(1, 'rgba(140, 200, 255, 0)');

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, opacity: 0.45 }}
    />
  );
}
