'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BRAND_IMAGES } from '@/lib/image-framing';
import { ABOUT } from '@/lib/site-copy';

/**
 * Reserved portrait slot — add your photo later as:
 * public/images/chetna.jpg
 * It will fill this frame automatically once the file exists.
 */
export function AboutPortrait() {
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(BRAND_IMAGES.chetnaPortrait, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setHasPhoto(res.ok);
      })
      .catch(() => {
        if (!cancelled) setHasPhoto(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="about-portrait about-portrait--slot">
      <div className="about-portrait__frame">
        {hasPhoto ? (
          <Image
            src={BRAND_IMAGES.chetnaPortrait}
            alt="Chetna Bhadkare, Retention & Profitability Strategist"
            fill
            sizes="(max-width: 900px) 80vw, 320px"
            className="about-portrait__photo"
          />
        ) : (
          <div className="about-portrait__placeholder" aria-hidden="true">
            <span className="about-portrait__corner about-portrait__corner--tl" />
            <span className="about-portrait__corner about-portrait__corner--tr" />
            <span className="about-portrait__corner about-portrait__corner--bl" />
            <span className="about-portrait__corner about-portrait__corner--br" />
          </div>
        )}
      </div>
      <div className="about-portrait__rule" aria-hidden="true" />
      <p className="about-portrait__caption font-body">
        {ABOUT.portraitCaption}
      </p>
    </div>
  );
}
