import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SakuraThread } from '@/components/atmosphere/sakura-thread'
import { FilmGrain } from '@/components/atmosphere/film-grain'
import { SmoothScroll } from '@/components/smooth-scroll'
import { ForensicAtmosphere } from '@/components/effects/forensic-atmosphere'
import { AmbientSoundProvider } from '@/components/effects/ambient-sound'
import { ScrollProgress } from '@/components/effects/scroll-progress'
import { TouchDeviceMark } from '@/components/touch-device-mark'
import { SkipLink } from '@/components/skip-link'
import { warnIfLaunchConfigMissing } from '@/lib/env'
import { absoluteUrl } from '@/lib/site-url'
import './globals.css'

warnIfLaunchConfigMissing()

const OG_IMAGE = {
  url: '/images/cherry-tree.png',
  width: 1200,
  height: 630,
  alt: 'Chetna Bhadkare — Retention & Profitability Strategist',
} as const;

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

import { METADATA, SITE_IDENTITY } from '@/lib/site-copy'

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: METADATA.home.title,
    template: `%s | ${SITE_IDENTITY.name}`,
  },
  description: METADATA.home.description,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: METADATA.home.title,
    description: METADATA.home.ogDescription,
    type: 'website',
    url: '/',
    siteName: SITE_IDENTITY.name,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_IDENTITY.name} | Retention Strategist`,
    description: METADATA.home.twitterDescription,
    images: [OG_IMAGE.url],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#0C0B09]" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/images/cherry-tree.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(location.hash.indexOf('figmacapture=')!==-1||location.search.indexOf('figma=1')!==-1){document.documentElement.classList.add('figma-capture');}})();`,
          }}
        />
        {process.env.NODE_ENV === 'development' && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSans.variable} font-body antialiased bg-[#0C0B09]`}>
        <SkipLink />
        <TouchDeviceMark />
        <AmbientSoundProvider>
          <SakuraThread />
          <FilmGrain />
          <ScrollProgress />
          <SmoothScroll />
          <ForensicAtmosphere />
          {children}
          <Analytics />
        </AmbientSoundProvider>
      </body>
    </html>
  )
}
