import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Optional review gate — set SITE_ACCESS_PASSWORD on Vercel (server-only, NOT NEXT_PUBLIC_).
 * When unset, the site is fully public. When set, browsers get HTTP Basic Auth.
 * Remove the env var + redeploy when you're ready for a public launch.
 */
export function middleware(request: NextRequest) {
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!password) return NextResponse.next();

  // Never gate Next internals / static build assets
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const colon = decoded.indexOf(':');
      const user = colon >= 0 ? decoded.slice(0, colon) : '';
      const pass = colon >= 0 ? decoded.slice(colon + 1) : '';
      // Any username is fine; password must match SITE_ACCESS_PASSWORD.
      if (pass === password) {
        return NextResponse.next();
      }
    } catch {
      // fall through to challenge
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Chetna site — review only"',
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: [
    /*
     * Run on pages + public assets (images/video) so the gate covers the full site.
     * Skip Next internals via the checks above.
     */
    '/((?!_next/static|_next/image).*)',
  ],
};
