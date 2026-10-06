/** Shared JavaScript interaction settings. CSS breakpoints are documented in docs/DESIGN-SYSTEM.md. */
export const MOBILE_BREAKPOINT = 820;
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const MENU_CLOSE_DURATION = { navigation: 225, language: 205, desktop: 200 };
export const COUNTER_TIMING = { duration: 1050, delay: 620 };

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
