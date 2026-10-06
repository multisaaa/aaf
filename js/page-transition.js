import { prefersReducedMotion } from './config.js';

// Fade the current document before following ordinary internal page links.
export function initPageTransition() {
  let curtain;
  let fade;
  let destination;

  document.addEventListener('click', async (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      prefersReducedMotion()
    )
      return;
    const link = event.target.closest?.('a[href]');
    if (
      !link ||
      link.hasAttribute('download') ||
      link.hasAttribute('data-placeholder') ||
      (link.target && link.target !== '_self')
    )
      return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    // Preserve native in-page anchors, including back-to-top links.
    if (url.pathname === location.pathname && url.search === location.search) return;

    event.preventDefault();
    if (destination) return;
    destination = url.href;
    curtain = document.createElement('div');
    curtain.className = 'aaf-page-transition';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.append(curtain);
    fade = curtain.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      easing: 'cubic-bezier(.4, 0, .2, 1)',
      fill: 'forwards',
    });
    await fade.finished.catch(() => {});
    if (destination) location.assign(destination);
  });

  // A restored history entry must not retain its outgoing white curtain.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    destination = null;
    fade?.cancel();
    curtain?.remove();
    curtain = null;
  });
}
