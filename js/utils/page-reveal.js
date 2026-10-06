const pending = new Set();

/** Run once the preloader permits entrances, including when reveal has already happened. */
export function whenPageRevealed(callback) {
  if (!document.documentElement.classList.contains('aaf-loading')) {
    callback();
    return;
  }
  if (pending.has(callback)) return;
  pending.add(callback);
  window.addEventListener(
    'aaf:page-reveal',
    () => {
      pending.delete(callback);
      callback();
    },
    { once: true },
  );
}
