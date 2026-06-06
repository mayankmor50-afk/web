'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { IMAGE_QUALITY } from '@/lib/image-framing';

interface SceneImageProps {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  sizes?: string;
}

export function SceneImage({
  src,
  alt = '',
  priority = false,
  className,
  style,
  objectFit = 'cover',
  objectPosition = 'center',
  sizes = '100vw',
}: SceneImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={IMAGE_QUALITY}
      sizes={sizes}
      className={className}
      aria-hidden={alt === '' ? true : undefined}
      style={{
        objectFit,
        objectPosition,
        ...style,
      }}
    />
  );
}
