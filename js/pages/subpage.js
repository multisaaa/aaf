import { initHeroHeading } from '../hero-heading.js';

/** Start behavior for an authored static subpage. */
export function initSubpage() {
  const root = document.querySelector('[data-subpage-root]');
  if (!root) return null;
  if (root.dataset.pageInitialized) return root;
  root.dataset.pageInitialized = 'true';
  initHeroHeading();
  return root;
}
