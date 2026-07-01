import { BOOKING_URL } from '@/lib/booking';
import { isEmailLive, isLinkedInLive } from '@/lib/contact';
import { SITE_URL } from '@/lib/site-url';

/** Dev-only launch checklist — logs missing config once per server start */
let warned = false;

export function warnIfLaunchConfigMissing() {
  if (process.env.NODE_ENV !== 'development' || warned) return;
  warned = true;

  const gaps: string[] = [];
  if (!process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http')) {
    gaps.push('NEXT_PUBLIC_SITE_URL (canonical + social preview URLs)');
  }
  if (!BOOKING_URL.startsWith('http')) {
    gaps.push('NEXT_PUBLIC_BOOKING_URL (Cal.com schedule link on /audit)');
  }
  if (!isEmailLive()) {
    gaps.push('NEXT_PUBLIC_CONTACT_EMAIL (footer email + mailto fallback)');
  }
  if (!isLinkedInLive()) {
    gaps.push('NEXT_PUBLIC_LINKEDIN_URL (footer LinkedIn)');
  }

  if (gaps.length > 0) {
    console.warn(
      `[launch] Set in .env.local before going live:\n${gaps.map((g) => `  • ${g}`).join('\n')}\n  Site URL fallback: ${SITE_URL}`,
    );
  }
}
