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
import './globals.css'

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
  title: METADATA.home.title,
  description: METADATA.home.description,
  openGraph: {
    title: METADATA.home.title,
    description: METADATA.home.ogDescription,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_IDENTITY.name} | Retention Strategist`,
    description: METADATA.home.twitterDescription,
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
