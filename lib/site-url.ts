/** Canonical production URL — set NEXT_PUBLIC_SITE_URL in .env.local */
const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? '';

export const SITE_URL =
  raw.startsWith('http') ? raw.replace(/\/$/, '') : 'https://chetnabhadkare.com';

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
