# Chetna Bhadkare — Retention Strategist Site

Next.js 16 landing page and audit funnel.

**Repo:** https://github.com/mayankmor50-afk/web

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing page |
| `/audit` | Offer + booking |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in real values
pnpm dev
```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Prod | Canonical URL, sitemap, OG |
| `NEXT_PUBLIC_BOOKING_URL` | Yes | Cal.com on `/audit` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Footer + mailto fallback |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional | Footer LinkedIn |
| `SITE_ACCESS_PASSWORD` | Review | HTTP Basic Auth gate (server-only). Unset = public |

## Booking flow

There is **no iframe embed**. Booking is plain links, configured via env vars:

1. **Homepage CTAs** (`BookingLink` / `BookingHoverMenu`) open a hover menu with copy-email, mailto, and optional Cal.com.
2. **Primary path:** CTAs link to **`/audit`** — the canonical offer + booking page.
3. **Cal.com is opt-in:** set `NEXT_PUBLIC_BOOKING_URL` to your Cal.com event URL. When set, "Book call" opens Cal.com in a **new tab** (`target="_blank"`). When unset, CTAs fall back to `/audit` or `mailto:` via `NEXT_PUBLIC_CONTACT_EMAIL`.
4. **`/audit` schedule buttons** use the same hover menu; the sticky CTA on that page also routes through `ScheduleLink`.

Logic lives in `lib/booking.ts`. Vercel Analytics custom events (`booking`, `section_view`) fire from `lib/analytics.ts` when live.

## Deploy (Vercel)

1. Import repo → add env vars from `.env.example` (skip email/LinkedIn if not ready)
2. For private review: set `SITE_ACCESS_PASSWORD` (Production) — share that password with reviewers only
3. Framework: **Next.js** → Deploy
4. To go public later: delete `SITE_ACCESS_PASSWORD` on Vercel → Redeploy

## Project layout

```
app/           Routes + global CSS
components/    UI, effects, atmosphere
lib/           Copy, booking, images, motion
public/images/ Scene assets + hero.mp4
```

Copy: `lib/site-copy.ts` · Images: `lib/image-framing.ts`
