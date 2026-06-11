'use client';

import { useEffect } from 'react';

/** Adds `touch-device` on `<html>` for coarse-pointer / mobile UA (replaces inline script). */
export function TouchDeviceMark() {
  useEffect(() => {
    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const mobileUa = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent || '',
    );
    if (coarse || mobileUa) {
      document.documentElement.classList.add('touch-device');
    }
  }, []);

  return null;
}
