/**
 * Booking flow:
 * - Primary CTAs → /audit (on-site audit page)
 * - Schedule CTA on /audit → Cal.com when NEXT_PUBLIC_BOOKING_URL is set
 */
import { CONTACT_EMAIL } from '@/lib/contact';

export const AUDIT_PAGE_PATH = '/audit';

export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ?? '';

export function isBookingLive(): boolean {
  return BOOKING_URL.startsWith('http');
}

/** All "Book the Audit" buttons — always land on the audit page first */
export function bookingLinkProps(): {
  href: string;
  target?: string;
  rel?: string;
} {
  return { href: AUDIT_PAGE_PATH };
}

/** Schedule on /audit — external Cal.com or mailto when not configured */
export function scheduleLinkProps(): {
  href: string;
  target?: string;
  rel?: string;
} {
  if (isBookingLive()) {
    return {
      href: BOOKING_URL,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  if (CONTACT_EMAIL) {
    return {
      href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Retention Audit — booking request')}`,
    };
  }

  return { href: AUDIT_PAGE_PATH };
}

export function scheduleCtaLabel(): string {
  if (isBookingLive()) return 'Schedule on Cal.com →';
  if (CONTACT_EMAIL) return 'Email to book →';
  return 'Request the audit →';
}
