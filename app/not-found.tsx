import Link from 'next/link';
import { SITE_IDENTITY } from '@/lib/site-copy';

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <p className="not-found-page__eyebrow font-body">404</p>
      <h1 className="not-found-page__title font-display">This page isn&apos;t in the file.</h1>
      <p className="not-found-page__lead font-body">
        The URL may be outdated. Head back to {SITE_IDENTITY.name}&apos;s site or book the audit.
      </p>
      <div className="not-found-page__actions">
        <Link href="/" className="not-found-page__cta not-found-page__cta--primary font-body">
          Back to home
        </Link>
        <Link href="/audit" className="not-found-page__cta font-body">
          The offer →
        </Link>
      </div>
    </main>
  );
}
