'use client';

import { useMagnetic } from '@/lib/use-magnetic';
import type { CSSProperties, RefObject } from 'react';

interface MagneticNavLinkProps {
  href: string;
  children: string;
  style?: CSSProperties;
}

export function MagneticNavLink({ href, children, style }: MagneticNavLinkProps) {
  const { ref, style: magneticStyle } = useMagnetic({ strength: 0.18 });

  return (
    <a
      ref={ref as RefObject<HTMLAnchorElement>}
      href={href}
      data-cursor
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        color: '#9A9590',
        textDecoration: 'none',
        letterSpacing: '0.04em',
        transition: 'color 0.2s',
        display: 'inline-block',
        ...style,
        ...magneticStyle,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#E8E2D9'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#9A9590'; }}
    >
      {children}
    </a>
  );
}
