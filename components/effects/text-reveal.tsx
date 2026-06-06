'use client';

import { useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { ForensicHeadlineMark } from '@/components/effects/forensic-copy';
import { shouldInstantReveal } from '@/lib/motion-policy';

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2';
  style?: CSSProperties;
}

export function TextReveal({ children, delay = 0, as: Tag = 'div', style }: TextRevealProps) {
  const [mounted, setMounted] = useState(false);
  const [touchMotion, setTouchMotion] = useState(false);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    const instant = shouldInstantReveal();
    setTouchMotion(instant);
    if (instant) setVisible(true);
  }, []);

  useEffect(() => {
    if (!mounted || touchMotion) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, mounted, touchMotion]);

  const show = mounted && (touchMotion || visible);

  return (
    <Tag
      className={`text-reveal${show ? ' text-reveal--show' : ''}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

interface SplitLinesProps {
  lines: string[];
  highlightIndex?: number;
  highlightColor?: string;
  baseStyle?: React.CSSProperties;
  lineDelay?: number;
  /** Draw forensic amber underline under the highlighted line */
  markHighlight?: boolean;
}

export function SplitLinesReveal({
  lines,
  highlightIndex,
  highlightColor = '#B8873A',
  baseStyle,
  lineDelay = 120,
  markHighlight = false,
}: SplitLinesProps) {
  return (
    <>
      {lines.map((line, i) => {
        const isHighlight = i === highlightIndex;
        const content = (
          <span
            style={{
              ...baseStyle,
              color: isHighlight ? highlightColor : baseStyle?.color,
            }}
          >
            {line}
          </span>
        );

        return (
          <TextReveal key={i} delay={200 + i * lineDelay} as="span" style={{ display: 'block' }}>
            {markHighlight && isHighlight ? (
              <ForensicHeadlineMark delay={200 + i * lineDelay}>{content}</ForensicHeadlineMark>
            ) : (
              content
            )}
          </TextReveal>
        );
      })}
    </>
  );
}
