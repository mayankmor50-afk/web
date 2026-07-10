/** Viewport below the mobile layout breakpoint */
export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 900px)').matches;
}

/** Phones / tablets — not Mac trackpads, mouse desktops, or wide embedded browsers */
export function isTouchPrimaryDevice() {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (mobileUa) return true;

  // Coarse pointer only counts on narrow viewports (avoids Cursor/Electron false positives)
  if (!isMobileViewport()) return false;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  return coarse && !fine;
}

/** Figma html-to-design capture — force full visible state (no scroll-hide) */
export function isFigmaCaptureMode() {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hash.includes('figmacapture=') ||
    window.location.search.includes('figma=1')
  );
}

/** Skip scroll-hide animations — touch devices, narrow viewports, or Figma capture */
export function shouldInstantReveal() {
  return isFigmaCaptureMode() || isMobileViewport() || isTouchPrimaryDevice();
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Skip WebGL / heavy canvas loops on constrained devices (sakura, hero mesh). */
export function shouldDisableHeavyWebGL() {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return true;
  if (isMobileViewport()) return true;
  if (window.location.search.includes('lowPower=1')) return true;

  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return true;

  return false;
}
