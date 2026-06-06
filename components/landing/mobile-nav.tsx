'use client';

import { useEffect } from 'react';
import { BookingLink } from '@/components/landing/booking-link';
import { SITE } from '@/lib/site-tokens';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: '#results', label: 'Results' },
  { href: '#process', label: 'Process' },
  { href: '#audit', label: 'Audit' },
];

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(6,6,5,0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        padding: SITE.padX,
      }}
      onClick={onClose}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="font-display"
          style={{
            fontSize: 'clamp(28px, 8vw, 40px)',
            fontWeight: 700,
            color: SITE.cream,
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            padding: '12px 0',
          }}
        >
          {link.label}
        </a>
      ))}
      <BookingLink
        onClick={onClose}
        className="font-body"
        style={{
          marginTop: 24,
          fontSize: 14,
          fontWeight: 600,
          color: SITE.bg,
          background: SITE.amber,
          padding: '14px 32px',
          textDecoration: 'none',
          letterSpacing: '0.04em',
        }}
      >
        Book the Audit →
      </BookingLink>
    </div>
  );
}
