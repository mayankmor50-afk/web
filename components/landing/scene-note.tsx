'use client';

import type { ImageNarrativeKey } from '@/lib/image-narrative';
import { IMAGE_NARRATIVE } from '@/lib/image-narrative';

interface SceneNoteProps {
  narrative: ImageNarrativeKey;
  visible?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SceneNote({
  narrative,
  visible = true,
  align = 'left',
  className = '',
}: SceneNoteProps) {
  const note = IMAGE_NARRATIVE[narrative];

  return (
    <div
      className={`scene-note scene-note--${align} ${className}`.trim()}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div className="scene-note__code">{note.code}</div>
      <div className="scene-note__label">{note.label}</div>
      <div className="scene-note__meaning">{note.meaning}</div>
    </div>
  );
}
