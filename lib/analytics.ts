import { track } from '@vercel/analytics';

/** Booking funnel events — source identifies where on the page the CTA lived */
export type BookingAnalyticsSource =
  | 'nav'
  | 'mobile-nav'
  | 'hero'
  | 'final-cta'
  | 'sticky-cta'
  | 'audit-nav'
  | 'audit-hero'
  | 'audit-offer'
  | 'phase-slider'
  | 'unknown';

export type BookingAnalyticsAction =
  | 'menu_open'
  | 'cal_click'
  | 'audit_click'
  | 'email_copy'
  | 'email_mailto';

export function trackBooking(
  action: BookingAnalyticsAction,
  source: BookingAnalyticsSource,
) {
  track('booking', { action, source });
}

/** Fires once per page load when a key section enters view */
export function trackSectionView(section: string) {
  track('section_view', { section });
}
