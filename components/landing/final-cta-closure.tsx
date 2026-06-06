'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { shouldInstantReveal } from '@/lib/motion-policy';
import { isEmailLive, isLinkedInLive, mailtoHref, LINKEDIN_URL } from '@/lib/contact';

const navLinks = [
  { href: '#results', label: 'Results' },
  { href: '#process', label: 'Process' },
  { href: '#audit', label: 'The offer' },
] as const;

function ClosureLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className = 'final-cta-closure__link';
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function LinkRow({ children }: { children: ReactNode }) {
  return <div className="final-cta-closure__row font-body">{children}</div>;
}

function Sep() {
  return <span className="final-cta-closure__sep" aria-hidden="true">·</span>;
}

/** Compact credits strip — standalone section below Start here */
export function FinalCtaClosure() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const year = new Date().getFullYear();

  useLayoutEffect(() => {
    if (shouldInstantReveal()) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || shouldInstantReveal()) {
      setVisible(true);
      return;
    }
    const markVisible = () => setVisible(true);
    const checkNow = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.95 && rect.bottom > 0) markVisible();
    };

    checkNow();

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) markVisible();
      },
      { threshold: [0, 0.1, 0.2], rootMargin: '40px 0px' },
    );
    obs.observe(el);
    window.addEventListener('scroll', checkNow, { passive: true });
    const t = window.setTimeout(checkNow, 200);

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', checkNow);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="contentinfo"
      className={`final-cta-closure${visible ? ' final-cta-closure--visible' : ''}`}
    >
      <div className="final-cta-closure__rule" aria-hidden="true" />

      <nav aria-label="Page sections">
        <LinkRow>
          {navLinks.map((link, i) => (
            <span key={link.href} className="final-cta-closure__item">
              {i > 0 && <Sep />}
              <ClosureLink href={link.href}>{link.label}</ClosureLink>
            </span>
          ))}
        </LinkRow>
      </nav>

      {(isLinkedInLive() || isEmailLive()) && (
        <nav aria-label="Connect">
          <LinkRow>
            {isLinkedInLive() && (
              <span className="final-cta-closure__item">
                <ClosureLink href={LINKEDIN_URL} external>LinkedIn</ClosureLink>
              </span>
            )}
            {isLinkedInLive() && isEmailLive() && <Sep />}
            {isEmailLive() && (
              <span className="final-cta-closure__item">
                <ClosureLink href={mailtoHref()} external>Email</ClosureLink>
              </span>
            )}
          </LinkRow>
        </nav>
      )}

      <p className="final-cta-closure__name font-display">Chetna Bhadkare</p>
      <p className="final-cta-closure__role font-body">Retention & Profitability Strategist</p>

      <div className="final-cta-closure__legal font-body">
        <ClosureLink href="/privacy">Privacy</ClosureLink>
        <Sep />
        <ClosureLink href="/terms">Terms</ClosureLink>
        <span className="final-cta-closure__copy">© {year} Chetna Bhadkare</span>
      </div>
    </div>
  );
}
