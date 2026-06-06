/** Public contact links — set in .env.local */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? '';
export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ?? '';

export function isEmailLive(): boolean {
  return CONTACT_EMAIL.includes('@');
}

export function isLinkedInLive(): boolean {
  return LINKEDIN_URL.startsWith('http');
}

export function mailtoHref(): string {
  return `mailto:${CONTACT_EMAIL}`;
}
