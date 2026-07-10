'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { shouldDisableHeavyWebGL } from '@/lib/motion-policy';
import { SAKURA } from '@/lib/sakura-palette';

interface DriftItem {
  mesh: THREE.Mesh;
  depth: number;
  driftX: number;
  driftY: number;
  rotSpeed: number;
  phase: number;
  kind: 'petal' | 'cluster';
}

/** Obovate sakura petal with emarginate (notched) apex + central vein */
function drawSakuraPetalPath(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.94);
  ctx.bezierCurveTo(cx - w * 0.06, h * 0.78, cx - w * 0.4, h * 0.48, cx - w * 0.24, h * 0.16);
  ctx.bezierCurveTo(cx - w * 0.14, h * 0.06, cx - w * 0.03, h * 0.05, cx, h * 0.03);
  ctx.bezierCurveTo(cx + w * 0.03, h * 0.05, cx + w * 0.14, h * 0.06, cx + w * 0.24, h * 0.16);
  ctx.bezierCurveTo(cx + w * 0.4, h * 0.48, cx + w * 0.06, h * 0.78, cx, h * 0.94);
  ctx.closePath();
}

function makePetalTexture(): THREE.CanvasTexture {
  const w = 96;
  const h = 128;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;

  drawSakuraPetalPath(ctx, w, h);

  const fill = ctx.createLinearGradient(w / 2, h * 0.94, w / 2, h * 0.03);
  fill.addColorStop(0, SAKURA.base);
  fill.addColorStop(0.2, SAKURA.blush);
  fill.addColorStop(0.5, SAKURA.face);
  fill.addColorStop(0.72, SAKURA.core);
  fill.addColorStop(0.9, SAKURA.blush);
  fill.addColorStop(1, SAKURA.edge);
  ctx.fillStyle = fill;
  ctx.fill();

  const vein = ctx.createLinearGradient(w / 2, h * 0.9, w / 2, h * 0.05);
  vein.addColorStop(0, 'rgba(245, 224, 184, 0.35)');
  vein.addColorStop(0.4, 'rgba(255, 255, 255, 0.18)');
  vein.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
  ctx.strokeStyle = vein;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(w / 2, h * 0.88);
  ctx.quadraticCurveTo(w / 2, h * 0.5, w / 2, h * 0.06);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/** Soft emissive blossom cluster — matches the video canopy bokeh */
function makeClusterTexture(): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.46);
  g.addColorStop(0, 'rgba(255, 252, 254, 0.92)');
  g.addColorStop(0.22, 'rgba(252, 200, 220, 0.7)');
  g.addColorStop(0.48, 'rgba(232, 120, 160, 0.38)');
  g.addColorStop(0.72, 'rgba(200, 72, 120, 0.16)');
  g.addColorStop(1, 'rgba(184, 72, 120, 0)');

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Site-wide sakura thread — constant from hero to footer.
 * Petals + soft blossom clusters drift at depth; blush glow anchors the hero tree.
 */
export function SakuraDepthField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(false);

  useEffect(() => {
    setWebglEnabled(!shouldDisableHeavyWebGL());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !webglEnabled) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const petalTex = makePetalTexture();
    const clusterTex = makeClusterTexture();
    const items: DriftItem[] = [];

    const addPetal = () => {
      const depth = -5 + Math.random() * 10;
      const proximity = (depth + 5) / 10;
      const scale = 0.07 + proximity * 0.2;
      const opacity = 0.1 + proximity * 0.42;

      const mat = new THREE.MeshBasicMaterial({
        map: petalTex,
        transparent: true,
        opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(scale, scale * 1.28), mat);
      mesh.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 11, depth);
      mesh.rotation.z = Math.random() * Math.PI * 2;

      scene.add(mesh);
      items.push({
        mesh,
        depth,
        driftX: -0.002 + Math.random() * 0.004,
        driftY: -(0.003 + proximity * 0.009),
        rotSpeed: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2,
        kind: 'petal',
      });
    };

    const addCluster = () => {
      const depth = -3 + Math.random() * 6;
      const proximity = (depth + 3) / 6;
      const scale = 0.18 + proximity * 0.38;
      const opacity = 0.06 + proximity * 0.14;

      const mat = new THREE.MeshBasicMaterial({
        map: clusterTex,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(scale, scale), mat);
      mesh.position.set((Math.random() - 0.3) * 14, (Math.random() - 0.5) * 10, depth);
      mesh.rotation.z = Math.random() * Math.PI;

      scene.add(mesh);
      items.push({
        mesh,
        depth,
        driftX: -0.001 + Math.random() * 0.002,
        driftY: -(0.0015 + proximity * 0.004),
        rotSpeed: (Math.random() - 0.5) * 0.002,
        phase: Math.random() * Math.PI * 2,
        kind: 'cluster',
      });
    };

    for (let i = 0; i < 26; i++) addPetal();
    for (let i = 0; i < 10; i++) addCluster();

    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resize);

    let raf = 0;
    let t = 0;
    let paused = false;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { paused = !entry.isIntersecting; },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (paused) return;

      t += 0.016;
      const vh = window.innerHeight;
      const heroBoost = Math.max(0, 1 - scrollY / (vh * 1.4));
      const threadIntensity = 0.58 + heroBoost * 0.28;

      items.forEach((p) => {
        const proximity = p.kind === 'petal' ? (p.depth + 5) / 10 : (p.depth + 3) / 6;
        const sway = Math.sin(t * 0.5 + p.phase) * 0.0015;

        p.mesh.position.y += p.driftY * threadIntensity;
        p.mesh.position.x += p.driftX + sway;
        p.mesh.rotation.z += p.rotSpeed * threadIntensity;

        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        const baseOpacity = p.kind === 'petal'
          ? 0.08 + proximity * 0.38
          : 0.05 + proximity * 0.12;
        mat.opacity = baseOpacity * threadIntensity;

        if (p.mesh.position.y < -7) {
          p.mesh.position.y = 7;
          p.mesh.position.x = (Math.random() - 0.35) * 16;
        }
      });

      camera.position.x = Math.sin(t * 0.06) * 0.12;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      visibilityObserver.disconnect();
      petalTex.dispose();
      clusterTex.dispose();
      items.forEach((p) => {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [webglEnabled]);

  return (
    <>
      {/* Constant emissive blush — mirrors the hero tree glow, persists site-wide */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 6,
          background: `
            radial-gradient(ellipse 58% 48% at 72% 36%, ${SAKURA.glow} 0%, transparent 72%),
            radial-gradient(ellipse 36% 28% at 68% 40%, ${SAKURA.glowHot} 0%, transparent 58%)
          `,
        }}
      />
      {webglEnabled && (
        <div
          ref={containerRef}
          aria-hidden="true"
          className="fixed inset-0 w-full h-full pointer-events-none"
          style={{
            zIndex: 7,
            mixBlendMode: 'screen',
            opacity: 0.15,
          }}
        />
      )}
    </>
  );
}
