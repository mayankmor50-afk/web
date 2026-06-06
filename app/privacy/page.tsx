import type { Metadata } from 'next';
import { LegalPage } from '@/components/landing/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy | Chetna Bhadkare',
  description: 'How Chetna Bhadkare collects and uses information on this website.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" eyebrow="Legal">
      <p>
        This policy describes how information is handled when you visit chetnabhadkare.com
        (or this site) and when you book a consultation or audit.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Website usage.</strong> We use privacy-focused analytics (Vercel Analytics)
          to understand traffic and page performance. This does not include personal profiles
          or cross-site tracking for advertising.
        </li>
        <li>
          <strong>Booking information.</strong> When you schedule via Calendly, you provide
          information directly to that platform (name, email, etc.) under Calendly&apos;s privacy
          policy.
        </li>
        <li>
          <strong>Email.</strong> If you contact us by email, we receive whatever you choose to send.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To respond to inquiries, deliver audits and engagements you request, improve the site,
        and communicate about work you have engaged us for. We do not sell your data.
      </p>

      <h2>Cookies & local storage</h2>
      <p>
        The site may store minimal preferences (for example, ambient sound toggle) in your browser.
        No advertising cookies are used.
      </p>

      <h2>Retention</h2>
      <p>
        Client and inquiry data is kept only as long as needed for the engagement, legal obligations,
        or legitimate business records.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access, correction, or deletion of personal data we hold by emailing us.
        We will respond within a reasonable timeframe.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: use the email address listed in the site footer.
      </p>

      <p className="legal-page__updated">Last updated: June 2026</p>
    </LegalPage>
  );
}
