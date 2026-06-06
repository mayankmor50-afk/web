'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * FluidMeshOverlay — amber wireframe over the cherry blossom hero video.
 * Transparent background, screen blend, low opacity.
 */
export function FluidMeshOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      65,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 2.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B8873A'),
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xB8873A, 1.2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const positionAttr = geometry.attributes.position;
    const originalPositions = new Float32Array(positionAttr.array.length);
    for (let i = 0; i < positionAttr.array.length; i++) {
      originalPositions[i] = positionAttr.array[i];
    }

    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.003;

      for (let i = 0; i < positionAttr.count; i++) {
        const x = originalPositions[i * 3];
        const y = originalPositions[i * 3 + 1];
        positionAttr.setZ(
          i,
          Math.sin(x * 1.5 + time) * 0.12 +
          Math.sin(y * 1.5 + time * 0.8) * 0.12
        );
      }
      positionAttr.needsUpdate = true;
      geometry.computeVertexNormals();
      renderer.render(scene, camera);
    };

    animate();

    const onScroll = () => {
      const wrap = wrapperRef.current;
      if (!wrap || prefersReduced) return;
      const fade = Math.max(0, 1 - window.scrollY / window.innerHeight);
      wrap.style.opacity = String(0.18 + fade * 0.14);
    };
    if (!prefersReduced) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: '38%',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: 0.22,
        zIndex: 2,
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
