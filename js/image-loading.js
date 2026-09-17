const IMAGE_HOST_SELECTOR = [
  '.hero-media',
  '.home-company-network-image',
  '.evidence-card',
  '.application-actual-media',
  '.process-steps figure',
].join(',');

export function initImageLoading() {
  const images = document.querySelectorAll('img[src$=".webp"]');

  images.forEach(image => {
    const host = image.closest(IMAGE_HOST_SELECTOR);
    if (!host) return;

    host.classList.remove('is-image-loaded', 'is-image-error');
    host.setAttribute('aria-busy', 'true');

    const finish = () => {
      host.classList.add('is-image-loaded');
      host.removeAttribute('aria-busy');
    };

    const fail = () => {
      host.classList.add('is-image-loaded', 'is-image-error');
      host.removeAttribute('aria-busy');
    };

    if (image.complete) {
      image.naturalWidth ? finish() : fail();
      return;
    }

    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', fail, { once: true });
  });
}
