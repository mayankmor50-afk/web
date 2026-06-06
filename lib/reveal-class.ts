/** Scroll-reveal utility — hidden on desktop until in view; always visible on touch / narrow viewports via CSS */
export function revealClass(inView: boolean, variant?: 'fade-only') {
  const base = 'reveal-fade';
  const shown = inView ? ' reveal-fade--in' : '';
  const mod = variant === 'fade-only' ? ' reveal-fade--fade-only' : '';
  return `${base}${shown}${mod}`;
}
