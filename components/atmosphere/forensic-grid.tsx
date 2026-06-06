'use client';

/**
 * Subtle forensic grid — from the original template hero.
 * Amber-tinted lines over dark scenes; reads as analysis, not sci-fi UI.
 */
export function ForensicGrid({ opacity = 0.14 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2, opacity }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: 'absolute',
            height: 1,
            left: 0,
            right: 0,
            top: `${12.5 * (i + 1)}%`,
            background: 'rgba(184, 135, 58, 0.12)',
          }}
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: 'absolute',
            width: 1,
            top: 0,
            bottom: 0,
            left: `${8.33 * (i + 1)}%`,
            background: 'rgba(184, 135, 58, 0.08)',
          }}
        />
      ))}
    </div>
  );
}
