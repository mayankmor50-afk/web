'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AUDIT_PAGE_PATH, BOOKING_URL, isBookingLive } from '@/lib/booking';
import { CONTACT_EMAIL, isEmailLive, isLinkedInLive, LINKEDIN_URL, mailtoHref } from '@/lib/contact';
import { trackBooking, type BookingAnalyticsSource } from '@/lib/analytics';

type BookingHoverMenuProps = {
  children?: ReactNode;
  label?: string;
  showPlus?: boolean;
  className?: string;
  style?: CSSProperties;
  /** link = Drift-style underlined headline; primary/outline = button CTAs */
  variant?: 'link' | 'primary' | 'outline' | 'ghost';
  placement?: 'bottom-start' | 'bottom-end' | 'top-end';
  /** Vercel Analytics — where this CTA lives on the page */
  analyticsSource?: BookingAnalyticsSource;
  onNavigate?: () => void;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
};

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 11V3.8A1.8 1.8 0 0 1 5.8 2H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 4.5 8 9l5.5-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 6.5h12M5.5 2v2M10.5 2v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 12.5V4.2A1.2 1.2 0 0 1 4.2 3h7.6A1.2 1.2 0 0 1 13 4.2v8.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 7h5M5.5 9.5h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export const BookingHoverMenu = forwardRef<HTMLButtonElement, BookingHoverMenuProps>(
  function BookingHoverMenu(
    {
      children,
      label = 'Book a call',
      showPlus = true,
      className = '',
      style,
      variant = 'link',
      placement = 'bottom-start',
      analyticsSource = 'unknown',
      onNavigate,
      onMouseEnter,
      onMouseLeave,
    },
    ref,
  ) {
    const menuId = useId();
    const pathname = usePathname();
    const onAuditPage = pathname === '/audit';
    const rootRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onDoc);
      window.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        window.removeEventListener('keydown', onKey);
      };
    }, [open]);

    const copyEmail = useCallback(async () => {
      if (!isEmailLive()) return;
      trackBooking('email_copy', analyticsSource);
      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      } catch {
        window.prompt('Copy email:', CONTACT_EMAIL);
      }
    }, [analyticsSource]);

    const bookCallHref = isBookingLive() ? BOOKING_URL : AUDIT_PAGE_PATH;
    const bookCallExternal = isBookingLive();
    const bookCallLabel = isBookingLive() ? 'Book call' : 'View audit details';
    // When Cal.com is the only action (no email/LinkedIn), click should open it —
    // don't force a hover menu with a single item (felt "broken" on /audit).
    const calOnly = isBookingLive() && !isEmailLive() && !isLinkedInLive();

    const triggerLabel = children ?? (
      <>
        {label}
        {showPlus ? ' +' : ''}
      </>
    );

    const triggerClass = [
      'booking-hover-menu__trigger',
      variant === 'primary' ? 'btn-primary font-body' : 'font-body',
      variant === 'outline' ? 'booking-hover-menu__trigger--outline' : '',
      variant === 'link' ? 'booking-hover-menu__trigger--link font-display' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const handleTriggerClick = () => {
      if (calOnly) {
        trackBooking('cal_click', analyticsSource);
        window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
        onNavigate?.();
        return;
      }
      // Desktop used to be hover-only; click did nothing. Toggle for everyone.
      setOpen((v) => !v);
    };

    return (
      <div
        ref={rootRef}
        className={`booking-hover-menu booking-hover-menu--${variant} booking-hover-menu--${placement}${open ? ' booking-hover-menu--open' : ''}${className ? ` ${className}` : ''}`}
        style={style}
      >
        <button
          ref={ref}
          type="button"
          className={triggerClass}
          aria-expanded={calOnly ? undefined : open}
          aria-haspopup={calOnly ? undefined : 'menu'}
          aria-controls={calOnly ? undefined : menuId}
          onClick={handleTriggerClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {triggerLabel}
        </button>

        {!calOnly && (
        <div id={menuId} role="menu" className="booking-hover-menu__panel">
          <div className="booking-hover-menu__header">
            <span className="booking-hover-menu__brand font-display">Chetna Bhadkare</span>
            <span className="booking-hover-menu__tagline font-body">Get in touch.</span>
          </div>

          {isEmailLive() && (
            <>
              <button
                type="button"
                role="menuitem"
                className="booking-hover-menu__item font-body"
                onClick={() => {
                  void copyEmail();
                }}
              >
                <CopyIcon />
                <span>{copied ? 'Copied!' : 'Copy email'}</span>
              </button>
              <a
                role="menuitem"
                className="booking-hover-menu__item font-body"
                href={`${mailtoHref()}?subject=${encodeURIComponent('Retention audit inquiry')}`}
                onClick={() => {
                  trackBooking('email_mailto', analyticsSource);
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                <MailIcon />
                <span>Open mail client</span>
              </a>
            </>
          )}

          {bookCallExternal ? (
            <a
              role="menuitem"
              className="booking-hover-menu__item font-body booking-hover-menu__item--primary"
              href={bookCallHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackBooking(bookCallExternal ? 'cal_click' : 'audit_click', analyticsSource);
                setOpen(false);
                onNavigate?.();
              }}
            >
              <CalendarIcon />
              <span>{bookCallLabel}</span>
            </a>
          ) : (
            <Link
              role="menuitem"
              className="booking-hover-menu__item font-body booking-hover-menu__item--primary"
              href={bookCallHref}
              onClick={() => {
                trackBooking('audit_click', analyticsSource);
                setOpen(false);
                onNavigate?.();
              }}
            >
              <AuditIcon />
              <span>{bookCallLabel}</span>
            </Link>
          )}

          {isBookingLive() && !onAuditPage && (
            <Link
              role="menuitem"
              className="booking-hover-menu__item booking-hover-menu__item--muted font-body"
              href={AUDIT_PAGE_PATH}
              onClick={() => {
                trackBooking('audit_click', analyticsSource);
                setOpen(false);
                onNavigate?.();
              }}
            >
              <AuditIcon />
              <span>About the audit</span>
            </Link>
          )}

          {!isEmailLive() && isLinkedInLive() && (
            <a
              role="menuitem"
              className="booking-hover-menu__item booking-hover-menu__item--muted font-body"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              <MailIcon />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
        )}
      </div>
    );
  },
);

BookingHoverMenu.displayName = 'BookingHoverMenu';
