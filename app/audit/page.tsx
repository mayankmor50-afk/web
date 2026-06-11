import type { Metadata } from 'next';
import { AuditPageContent } from '@/components/landing/audit-page-content';
import { METADATA } from '@/lib/site-copy';

export const metadata: Metadata = {
  title: METADATA.audit.title,
  description: METADATA.audit.description,
  openGraph: {
    title: METADATA.audit.title,
    description: METADATA.audit.ogDescription,
    type: 'website',
    images: [{ url: '/images/audit.jpg', width: 1200, height: 630, alt: 'The Retention Audit' }],
  },
};

export default function AuditPage() {
  return <AuditPageContent />;
}
