import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE = 'site_review_ok';

/**
 * Optional review gate — set SITE_ACCESS_PASSWORD on Vercel (server-only).
 * Plain form POST + redirect (no fade/veil — those caused a stuck black screen).
 * Remove the env var + redeploy for a public launch.
 */
export async function middleware(request: NextRequest) {
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!password) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  const expected = await gateToken(password);

  if (request.cookies.get(COOKIE)?.value === expected) {
    return NextResponse.next();
  }

  if (await basicAuthOk(request, password)) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE, expected, cookieOpts(request));
    return res;
  }

  if (pathname === '/review-gate' && request.method === 'POST') {
    const form = await request.formData();
    const pass = String(form.get('password') ?? '');
    const next = safeNext(String(form.get('next') ?? '/'));

    if (pass === password) {
      // 303 + Set-Cookie — most reliable across Safari/Chrome/mobile
      const res = NextResponse.redirect(new URL(next, request.url), 303);
      res.cookies.set(COOKIE, expected, cookieOpts(request));
      return res;
    }

    return htmlLogin(next, true);
  }

  const next = pathname === '/review-gate' ? '/' : `${pathname}${request.nextUrl.search}`;
  return htmlLogin(next, false);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};

function cookieOpts(request: NextRequest) {
  return {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };
}

function safeNext(raw: string) {
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

async function gateToken(password: string) {
  const data = new TextEncoder().encode(`chetna-review:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function basicAuthOk(request: NextRequest, password: string) {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Basic ')) return false;
  try {
    const decoded = atob(auth.slice(6));
    const colon = decoded.indexOf(':');
    const pass = colon >= 0 ? decoded.slice(colon + 1) : '';
    return pass === password;
  } catch {
    return false;
  }
}

function htmlLogin(next: string, failed: boolean) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Private review — Chetna Bhadkare</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      background: #0C0B09; color: #E8E2D9;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    }
    .card {
      width: min(92vw, 400px); padding: 32px 28px;
      border: 1px solid rgba(184,135,58,0.35);
      background: rgba(18,16,14,0.92);
    }
    .eyebrow {
      font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
      color: #B8873A; margin: 0 0 12px;
    }
    h1 { font-size: 22px; font-weight: 600; margin: 0 0 8px; line-height: 1.25; }
    p { margin: 0 0 24px; color: rgba(232,226,217,0.7); font-size: 14px; line-height: 1.5; }
    label {
      display: block; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
      color: rgba(232,226,217,0.55); margin-bottom: 8px;
    }
    input {
      width: 100%; padding: 12px 14px; margin-bottom: 16px;
      border: 1px solid rgba(255,255,255,0.12); background: #080807; color: #E8E2D9;
      font-size: 16px; outline: none;
    }
    input:focus { border-color: #B8873A; }
    button {
      width: 100%; padding: 12px 16px; border: 0; cursor: pointer;
      background: #B8873A; color: #0C0B09; font-weight: 600; font-size: 14px;
    }
    .err { color: #E8A0A0; font-size: 13px; margin: -8px 0 16px; }
  </style>
</head>
<body>
  <main class="card">
    <p class="eyebrow">Private preview</p>
    <h1>Chetna Bhadkare</h1>
    <p>This site is review-only. Enter the password you were given.</p>
    ${failed ? '<p class="err">Wrong password. Try again.</p>' : ''}
    <form method="POST" action="/review-gate">
      <input type="hidden" name="next" value="${escapeAttr(next)}" />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
      <button type="submit">Enter site</button>
    </form>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: failed ? 401 : 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
