'use client';

import { useEffect, useRef } from 'react';

/** Animated node mesh — customer-graph atmosphere for the FAQ panel */
export function FaqGraphAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const nodes = Array.from({ length: 18 }, (_, i) => ({
      x: 0.52 + Math.random() * 0.42,
      y: 0.12 + Math.random() * 0.76,
      r: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      linkBias: i % 3,
    }));

    const links: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.22 || (nodes[i].linkBias === nodes[j].linkBias && dist < 0.32)) {
          links.push([i, j]);
        }
      }
    }

    let raf = 0;
    let t = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += reduced ? 0 : 0.012;

      ctx.clearRect(0, 0, w, h);

      links.forEach(([a, b]) => {
        const na = nodes[a];
        const nb = nodes[b];
        const pulse = 0.22 + Math.sin(t + na.phase) * 0.08;
        ctx.beginPath();
        ctx.moveTo(na.x * w, na.y * h);
        ctx.lineTo(nb.x * w, nb.y * h);
        ctx.strokeStyle = `rgba(184, 135, 58, ${pulse * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      nodes.forEach((n) => {
        const glow = 0.35 + Math.sin(t * 1.4 + n.phase) * 0.2;
        const x = n.x * w;
        const y = n.y * h;
        ctx.beginPath();
        ctx.arc(x, y, n.r * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 135, 58, ${glow * 0.12})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 226, 217, ${0.25 + glow * 0.35})`;
        ctx.fill();
      });

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="faq-graph-atmosphere"
      aria-hidden="true"
    />
  );
}
