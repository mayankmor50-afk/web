'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface AmbientHandle {
  stop: () => void;
}

interface AmbientSoundContextValue {
  enabled: boolean;
  toggle: () => void;
}

const AmbientSoundContext = createContext<AmbientSoundContextValue>({
  enabled: false,
  toggle: () => {},
});

function startAmbient(): AmbientHandle | null {
  try {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.04;
    master.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 400;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.6;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 55;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.15;
    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start();

    return {
      stop: () => {
        noise.stop();
        osc.stop();
        void ctx.close();
      },
    };
  } catch {
    return null;
  }
}

export function AmbientSoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const handleRef = useRef<AmbientHandle | null>(null);

  const toggle = useCallback(() => {
    if (enabled) {
      handleRef.current?.stop();
      handleRef.current = null;
      setEnabled(false);
      return;
    }
    handleRef.current = startAmbient();
    setEnabled(true);
  }, [enabled]);

  return (
    <AmbientSoundContext.Provider value={{ enabled, toggle }}>
      {children}
    </AmbientSoundContext.Provider>
  );
}

export function useAmbientSound() {
  return useContext(AmbientSoundContext);
}
