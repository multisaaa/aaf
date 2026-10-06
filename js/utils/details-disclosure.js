import { prefersReducedMotion } from '../config.js';

/** Shared close choreography for <details>; callers own input events and accessibility. */
export function createDetailsDisclosure(element, { closeDuration, onChange = () => {} }) {
  let closeTimer;

  function open() {
    clearTimeout(closeTimer);
    element.classList.remove('is-closing');
    element.open = true;
    onChange(true);
  }

  function close(immediate = false) {
    if (!element.open) return;
    clearTimeout(closeTimer);
    onChange(false);
    if (immediate || prefersReducedMotion()) {
      element.classList.remove('is-closing');
      element.open = false;
      return;
    }
    element.classList.add('is-closing');
    closeTimer = setTimeout(() => {
      element.open = false;
      element.classList.remove('is-closing');
    }, closeDuration);
  }

  function toggle() {
    if (element.open && !element.classList.contains('is-closing')) close();
    else open();
  }

  return { open, close, toggle };
}
