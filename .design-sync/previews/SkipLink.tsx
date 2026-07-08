import { SkipLink } from 'chetna-bhadkare-site';

/**
 * Real behavior: hidden off-screen (translateY(-120%)) until keyboard focus.
 * A static preview can't simulate :focus-visible, so this shows the
 * always-present resting state (see .design-sync/NOTES.md).
 */
export function Default() {
  return (
    <div style={{ position: 'relative', height: 96, background: '#0C0B09', padding: 16 }}>
      <p style={{ color: '#9A9590', fontFamily: 'system-ui, sans-serif', fontSize: 13, margin: 0, maxWidth: 360 }}>
        Tab into the page to reveal — this link is intentionally off-screen until keyboard focus.
      </p>
      <SkipLink />
    </div>
  );
}
