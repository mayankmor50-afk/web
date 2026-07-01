import type { Metadata } from 'next';
import { LegalPage } from '@/components/landing/legal-page';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of this website and retention consulting services.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" eyebrow="Legal">
      <p>
        By using this website or engaging Chetna Bhadkare for retention strategy services,
        you agree to these terms.
      </p>

      <h2>Services</h2>
      <p>
        Services include fixed-scope retention audits, build sprints, and advisory work as
        described on this site or in a separate written agreement. Scope, fees, and deliverables
        are defined before work begins.
      </p>

      <h2>No guarantee of results</h2>
      <p>
        Case studies and figures on this site reflect past client outcomes. Your results depend
        on your data, team, product, and execution. We do not guarantee specific revenue,
        margin, or retention outcomes.
      </p>

      <h2>Website content</h2>
      <p>
        Content on this site is for general information. It is not legal, financial, or
        investment advice. Do not rely on it as a substitute for professional advice
        tailored to your situation.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Site design, copy, and materials are owned by Chetna Bhadkare unless otherwise noted.
        Client deliverables are governed by the project agreement.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for indirect, incidental,
        or consequential damages arising from use of this site or services. Direct liability
        is limited to fees paid for the specific engagement giving rise to the claim.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws applicable in the jurisdiction of the service
        provider, unless a signed client agreement states otherwise.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. Continued use of the site after changes constitutes acceptance.
      </p>

      <p className="legal-page__updated">Last updated: June 2026</p>
    </LegalPage>
  );
}
