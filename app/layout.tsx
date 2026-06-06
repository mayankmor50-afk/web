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

export const metadata: Metadata = {
  title: 'Chetna Bhadkare | Retention & Profitability Strategist',
  description: 'Find the $200k–$1.4M sitting in your existing customer database. Fixed-price retention audits and build sprints for DTC brands doing $100k–$4M/month.',
  openGraph: {
    title: 'Chetna Bhadkare | Retention & Profitability Strategist',
    description: 'Fixed-price retention audits for DTC brands doing $100k–$4M/month. Find the margin already in your customer database.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chetna Bhadkare | Retention Strategist',
    description: 'Your second sale is where margin lives.',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=/Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent||'');if(m)document.documentElement.classList.add('touch-device');}catch(e){}})();`,
          }}
        />
        <link rel="preload" as="image" href="/images/cherry-tree.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dmSans.variable} font-body antialiased bg-[#0C0B09]`}>
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
