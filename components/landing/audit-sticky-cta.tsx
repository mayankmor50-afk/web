'use client';

import { useEffect, useState } from 'react';
import { ScheduleLink } from '@/components/landing/schedule-link';

/** Sticky book CTA on /audit — hides near the final section */
export function AuditStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const final = document.getElementById('audit-final');

    const onScroll = () => {
      const pastIntro = window.scrollY > window.innerHeight * 0.45;
      const hide = final ? final.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      setVisible(pastIntro && !hide);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <ScheduleLink
      variant="primary"
      label="Book a call"
      showPlus={false}
      placement="top-end"
      className="audit-sticky-cta btn-primary font-body"
    >
      Book a call →
    </ScheduleLink>
  );
}
