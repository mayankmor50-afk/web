import { MobileNav } from 'chetna-bhadkare-site';

/** Renders null when closed — the only meaningful static state is open. */
export function Open() {
  return <MobileNav open={true} onClose={() => {}} />;
}
