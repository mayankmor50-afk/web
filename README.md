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
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recommended | Footer + mailto fallback |
| `NEXT_PUBLIC_LINKEDIN_URL` | Recommended | Footer LinkedIn |

## Deploy (Vercel)

1. Import repo → add all `NEXT_PUBLIC_*` from `.env.local`
2. Framework: **Next.js** → Deploy

## Project layout

```
app/           Routes + global CSS
components/    UI, effects, atmosphere
lib/           Copy, booking, images, motion
public/images/ Scene assets + hero.mp4
```

Copy: `lib/site-copy.ts` · Images: `lib/image-framing.ts`
