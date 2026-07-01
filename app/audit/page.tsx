import type { Metadata } from 'next';
import { AuditPageContent } from '@/components/landing/audit-page-content';
import { METADATA } from '@/lib/site-copy';

export const metadata: Metadata = {
  title: 'The 3-Phase Partnership',
  description: METADATA.audit.description,
  alternates: { canonical: '/audit' },
  openGraph: {
    title: METADATA.audit.title,
    description: METADATA.audit.ogDescription,
    type: 'website',
    url: '/audit',
    images: [{ url: '/images/audit.jpg', width: 1200, height: 630, alt: 'The Retention Audit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: METADATA.audit.title,
    description: METADATA.audit.ogDescription,
    images: ['/images/audit.jpg'],
  },
};

export default function AuditPage() {
  return <AuditPageContent />;
}
