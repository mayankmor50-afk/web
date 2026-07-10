'use client';

import { useEffect, useRef } from 'react';
import { trackSectionView } from '@/lib/analytics';

/** Fire a Vercel Analytics section_view event once when the section enters view */
export function useTrackSectionView(section: string, inView: boolean) {
  const fired = useRef(false);

  useEffect(() => {
    if (inView && !fired.current) {
      fired.current = true;
      trackSectionView(section);
    }
  }, [inView, section]);
}
