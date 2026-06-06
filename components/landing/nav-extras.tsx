'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { useAmbientSound } from '@/components/effects/ambient-sound';

const mono: CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
};

export function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hr = h % 12 || 12;
      setTime(`${hr}:${m} ${ampm}, ET`);
    };
    fmt();
    const id = setInterval(fmt, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ ...mono, color: '#4A4440', marginTop: 4 }}>
      {time}
    </div>
  );
}

export function SoundToggle() {
  const { enabled, toggle } = useAmbientSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? 'Turn ambient sound off' : 'Turn ambient sound on'}
      data-cursor
      style={{
        ...mono,
        position: 'fixed',
        top: 22,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 51,
        background: 'none',
        border: 'none',
        color: enabled ? '#B8873A' : '#6B6560',
        cursor: 'none',
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        transition: 'color 0.3s ease',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 24,
          height: 1,
          background: enabled ? '#B8873A' : '#4A4440',
          transition: 'background 0.3s ease, width 0.3s ease',
        }}
      />
      Sound: {enabled ? 'On' : 'Off'}
      <span
        style={{
          display: 'inline-block',
          width: enabled ? 24 : 12,
          height: 1,
          background: enabled ? '#B8873A' : '#4A4440',
          transition: 'background 0.3s ease, width 0.3s ease',
        }}
      />
    </button>
  );
}
