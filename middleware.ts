import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE = 'site_review_ok';

/**
 * Optional review gate — set SITE_ACCESS_PASSWORD on Vercel (server-only, NOT NEXT_PUBLIC_).
 * Shows a password form with a smooth fade into the site on success.
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

  // Already unlocked this browser
  if (request.cookies.get(COOKIE)?.value === expected) {
    return NextResponse.next();
  }

  // Still accept Basic Auth (curl / smoke tests / URL credentials)
  if (await basicAuthOk(request, password)) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE, expected, cookieOpts(request));
    return res;
  }

  // Form submit
  if (pathname === '/review-gate' && request.method === 'POST') {
    const form = await request.formData();
    const pass = String(form.get('password') ?? '');
    const next = safeNext(String(form.get('next') ?? '/'));
    const wantsJson = request.headers.get('accept')?.includes('application/json');

    if (pass === password) {
      if (wantsJson) {
        const res = NextResponse.json({ ok: true, next });
        res.cookies.set(COOKIE, expected, cookieOpts(request));
        return res;
      }
      // Non-JS fallback: dark interstitial, then soft redirect
      const res = htmlUnlock(next);
      res.cookies.set(COOKIE, expected, cookieOpts(request));
      return res;
    }

    if (wantsJson) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return htmlLogin(next, true);
  }

  // Show login form
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

function htmlUnlock(next: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Opening…</title>
  <style>
    html, body { margin: 0; height: 100%; background: #0C0B09; }
    .veil {
      position: fixed; inset: 0; background: #0C0B09;
      opacity: 0; transition: opacity 0.55s ease;
    }
    .veil.on { opacity: 1; }
  </style>
</head>
<body>
  <div class="veil" id="veil"></div>
  <script>
    (function () {
      var next = ${JSON.stringify(next)};
      var veil = document.getElementById('veil');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { veil.classList.add('on'); });
      });
      setTimeout(function () { location.replace(next); }, 520);
    })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
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
    html, body {
      margin: 0; min-height: 100vh; background: #0C0B09; color: #E8E2D9;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    }
    body {
      display: grid; place-items: center;
      transition: opacity 0.45s ease;
    }
    body.is-leaving { opacity: 0; pointer-events: none; }
    .card {
      width: min(92vw, 400px); padding: 32px 28px;
      border: 1px solid rgba(184,135,58,0.35);
      background: rgba(18,16,14,0.92);
      opacity: 0; transform: translateY(10px);
      animation: rise 0.5s ease forwards;
    }
    @keyframes rise {
      to { opacity: 1; transform: none; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }
    .card.is-shake { animation: shake 0.35s ease; }
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
      transition: filter 0.15s ease, opacity 0.15s ease;
    }
    button:hover { filter: brightness(1.05); }
    button:disabled { opacity: 0.65; cursor: wait; }
    .err { color: #E8A0A0; font-size: 13px; margin: -8px 0 16px; min-height: 1.2em; }
    .err:empty { display: none; }
    .veil {
      position: fixed; inset: 0; background: #0C0B09;
      opacity: 0; pointer-events: none; transition: opacity 0.5s ease; z-index: 20;
    }
    .veil.on { opacity: 1; }
  </style>
</head>
<body>
  <div class="veil" id="veil" aria-hidden="true"></div>
  <main class="card" id="card">
    <p class="eyebrow">Private preview</p>
    <h1>Chetna Bhadkare</h1>
    <p>This site is review-only. Enter the password you were given.</p>
    <p class="err" id="err">${failed ? 'Wrong password. Try again.' : ''}</p>
    <form method="POST" action="/review-gate" id="gate-form">
      <input type="hidden" name="next" value="${escapeAttr(next)}" />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
      <button type="submit" id="submit">Enter site</button>
    </form>
  </main>
  <script>
    (function () {
      var form = document.getElementById('gate-form');
      var card = document.getElementById('card');
      var err = document.getElementById('err');
      var btn = document.getElementById('submit');
      var veil = document.getElementById('veil');
      var body = document.body;
      var busy = false;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;
        busy = true;
        btn.disabled = true;
        err.textContent = '';
        body.classList.add('is-leaving');

        var data = new FormData(form);
        var next = data.get('next') || '/';

        window.setTimeout(function () {
          fetch('/review-gate', {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin',
          }).then(function (res) {
            return res.json().then(function (json) {
              return { res: res, json: json };
            }).catch(function () {
              return { res: res, json: null };
            });
          }).then(function (pack) {
            if (pack.res.ok && pack.json && pack.json.ok) {
              veil.classList.add('on');
              window.setTimeout(function () {
                location.replace(pack.json.next || next);
              }, 480);
              return;
            }
            // Wrong password — ease back in
            busy = false;
            btn.disabled = false;
            body.classList.remove('is-leaving');
            err.textContent = 'Wrong password. Try again.';
            card.classList.remove('is-shake');
            void card.offsetWidth;
            card.classList.add('is-shake');
            document.getElementById('password').focus();
            document.getElementById('password').select();
          }).catch(function () {
            // Network / no-JS path fallback
            form.submit();
          });
        }, 280);
      });
    })();
  </script>
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
