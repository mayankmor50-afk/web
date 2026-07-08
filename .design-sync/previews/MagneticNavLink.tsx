import { MagneticNavLink } from 'chetna-bhadkare-site';

/** Real usage from the site header nav (components/landing/home-page.tsx) */
export function Default() {
  return (
    <div style={{ display: 'flex', gap: 24, background: '#0C0B09', padding: 24 }}>
      <MagneticNavLink href="#results">Results</MagneticNavLink>
      <MagneticNavLink href="#process">Process</MagneticNavLink>
      <MagneticNavLink href="/audit">The offer</MagneticNavLink>
    </div>
  );
}
