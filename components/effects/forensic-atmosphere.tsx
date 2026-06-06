'use client';

import { AmbientCursorGlow } from '@/components/atmosphere/ambient-cursor-glow';
import { CursorLightTrail } from '@/components/atmosphere/cursor-light-trail';
import { ForensicCursor } from '@/components/effects/forensic-cursor';

/** Global forensic interaction layer — cursor, trail, ambient glow */
export function ForensicAtmosphere() {
  return (
    <>
      <AmbientCursorGlow />
      <CursorLightTrail />
      <ForensicCursor />
    </>
  );
}
