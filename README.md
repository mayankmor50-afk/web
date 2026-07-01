# Chetna Bhadkare — Retention Strategist Site

Production landing page and audit funnel for [Chetna Bhadkare](https://github.com/mayankmor50-afk/website), built with Next.js 16.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Main landing page |
| `/audit` | Offer overview + booking |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Setup

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local with real values
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URL, sitemap, OG previews |
| `NEXT_PUBLIC_BOOKING_URL` | Yes | Cal.com link on `/audit` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recommended | Footer email + mailto fallback |
| `NEXT_PUBLIC_LINKEDIN_URL` | Recommended | Footer LinkedIn |

In development, missing vars log a `[launch]` warning in the terminal.

## Scripts

```bash
pnpm dev      # local dev server
pnpm build    # production build
pnpm start    # serve production build
```

## Deploy (Vercel)

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. Add all `NEXT_PUBLIC_*` variables from `.env.local`.
3. Deploy — framework preset: **Next.js**.

## Pre-launch checklist

- [ ] Real Cal.com URL in `NEXT_PUBLIC_BOOKING_URL`
- [ ] Production domain in `NEXT_PUBLIC_SITE_URL`
- [ ] Contact email + LinkedIn in env
- [ ] Portrait at `public/images/chetna.jpg` (optional; placeholder shown until added)
- [ ] Full-browser + phone pass on `/` and `/audit`
- [ ] Test social preview (OG image: cherry-tree on home, audit.jpg on `/audit`)

## Structure

```
app/              Routes, layout, global CSS
components/       UI, effects, atmosphere
lib/              Copy, booking, motion policy, image framing
public/images/    Scene backdrops (do not remove without approval)
```

Marketing copy lives in `lib/site-copy.ts` — single source of truth for homepage text.
