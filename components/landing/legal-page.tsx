import Link from 'next/link';
import type { ReactNode } from 'react';
import { SITE } from '@/lib/site-tokens';

export function LegalPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <main
      className="legal-page font-body"
      style={{ background: SITE.bg, minHeight: '100vh', padding: `${SITE.padY} ${SITE.padX}` }}
    >
      <div className="site-container" style={{ maxWidth: 720 }}>
        <Link href="/" className="legal-page__back">
          ← Back to home
        </Link>
        <p className="section-eyebrow" style={{ marginBottom: 16 }}>
          {eyebrow}
        </p>
        <h1 className="font-display legal-page__title">{title}</h1>
        <div className="legal-page__body">{children}</div>
      </div>
    </main>
  );
}
