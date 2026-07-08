import { PhaseSlider } from 'chetna-bhadkare-site';

/**
 * Phase content (headline/copy/images) is internal data (lib/audit-content.ts),
 * not a prop — there's no externally-driven variant axis to sweep, and the
 * active tab is internal state a static render can't advance past index 0.
 * Phase images are absolute /images/*.jpg site assets, not part of this
 * bundle — expect broken images here; layout/copy/CTA are still real.
 */
export function Default() {
  return <PhaseSlider />;
}
