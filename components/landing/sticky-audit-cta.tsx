'use client';

import { useEffect, useState } from 'react';
import { BookingLink } from '@/components/landing/booking-link';

export function StickyAuditCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const audit = document.getElementById('audit');
    const finalCta = document.getElementById('final-cta');

    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.55;
      if (!pastHero) {
        setVisible(false);
        return;
      }

      const hide =
        (audit && audit.getBoundingClientRect().top < window.innerHeight * 0.75) ||
        (finalCta && finalCta.getBoundingClientRect().top < window.innerHeight * 0.85);

      setVisible(!hide);
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
    <BookingLink
      className="sticky-audit-cta btn-primary"
      style={{
        position: 'fixed',
        bottom: 'max(20px, env(safe-area-inset-bottom))',
        right: 'max(20px, env(safe-area-inset-right))',
        zIndex: 45,
        fontSize: 13,
        padding: '12px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      }}
    >
      Book the Audit →
    </BookingLink>
  );
}
