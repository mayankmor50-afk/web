import { BookingLink } from 'chetna-bhadkare-site';

/**
 * The hover-opened contact panel can't be forced open via props (no `open`
 * prop — it's internal hover/touch state), so each cell shows the resting
 * trigger for that variant. Props/usage mirror the real site header
 * (components/landing/home-page.tsx).
 */
export function LinkVariant() {
  return (
    <div style={{ background: '#0C0B09', padding: 24 }}>
      <BookingLink variant="link" />
    </div>
  );
}

export function PrimaryVariant() {
  return (
    <div style={{ background: '#0C0B09', padding: 24 }}>
      <BookingLink variant="primary" label="Book a call" showPlus={false} />
    </div>
  );
}

export function OutlineVariant() {
  return (
    <div style={{ background: '#0C0B09', padding: 24 }}>
      <BookingLink variant="outline" label="Book a call" showPlus={false} placement="bottom-end" />
    </div>
  );
}

export function GhostVariant() {
  return (
    <div style={{ background: '#0C0B09', padding: 24 }}>
      <BookingLink variant="ghost" label="Book a call" />
    </div>
  );
}
