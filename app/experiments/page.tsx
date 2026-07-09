import type { Metadata } from 'next';
import { EffectsLab } from '@/components/experiments/effects-lab';

export const metadata: Metadata = {
  title: 'Effects Lab',
  description: 'Internal sandbox for motion, atmosphere, and WebGL experiments.',
  robots: { index: false, follow: false },
};

export default function ExperimentsPage() {
  return <EffectsLab />;
}
