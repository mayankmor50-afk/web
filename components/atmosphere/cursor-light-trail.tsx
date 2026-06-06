'use client';

import { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
}

export function CursorLightTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const lastRef = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const prefersFine = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersFine || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const last = lastRef.current;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const dt = now - last.t;

      if (dt > 0 && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
        pointsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: dx / dt,
          vy: dy / dt,
          born: now,
        });
        if (pointsRef.current.length > 24) {
          pointsRef.current.shift();
        }
      }

      lastRef.current = { x: e.clientX, y: e.clientY, t: now };
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const life = 400;

      pointsRef.current = pointsRef.current.filter((p) => now - p.born < life);

      for (let i = 1; i < pointsRef.current.length; i++) {
        const prev = pointsRef.current[i - 1];
        const curr = pointsRef.current[i];
        const age = now - curr.born;
        const alpha = (1 - age / life) * 0.22;

        const speed = Math.hypot(curr.vx, curr.vy);
        const len = Math.min(speed * 18, 28);
        const nx = curr.vx / (speed || 1);
        const ny = curr.vy / (speed || 1);

        const grad = ctx.createLinearGradient(
          curr.x - nx * len,
          curr.y - ny * len,
          curr.x,
          curr.y
        );
        grad.addColorStop(0, `rgba(252, 180, 60, 0)`);
        grad.addColorStop(0.6, `rgba(252, 200, 90, ${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255, 220, 120, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (i % 3 === 0 && alpha > 0.04) {
          const nodeSize = 2 + alpha * 2;
          ctx.fillStyle = `rgba(184, 135, 58, ${alpha * 1.4})`;
          ctx.fillRect(curr.x - nodeSize / 2, curr.y - nodeSize / 2, nodeSize, nodeSize);
          ctx.strokeStyle = `rgba(255, 220, 140, ${alpha * 0.6})`;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(curr.x - nodeSize / 2, curr.y - nodeSize / 2, nodeSize, nodeSize);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9997 }}
    />
  );
}
