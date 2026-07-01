import { HOME_FAQ, SITE_IDENTITY } from '@/lib/site-copy';
import { absoluteUrl } from '@/lib/site-url';

export function HomeJsonLd() {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_IDENTITY.name,
    jobTitle: SITE_IDENTITY.title,
    url: absoluteUrl('/'),
    description: SITE_IDENTITY.tagline,
  };

  const service = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${SITE_IDENTITY.name} — Retention Audits`,
    url: absoluteUrl('/audit'),
    description:
      'Fixed-price retention audits and build sprints for DTC brands doing $100k–$4M/month.',
    provider: { '@type': 'Person', name: SITE_IDENTITY.name },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
