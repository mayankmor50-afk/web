/**
 * Live booking link — set in .env.local:
 * NEXT_PUBLIC_BOOKING_URL=https://calendly.com/your-link
 */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ?? '';

export function isBookingLive(): boolean {
  return BOOKING_URL.startsWith('http');
}

/** External Calendly when configured; otherwise scroll fallback to offer section */
export function bookingHref(): string {
  return isBookingLive() ? BOOKING_URL : '#audit';
}

export function bookingLinkProps(): {
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
  return { href: '#audit' };
}
