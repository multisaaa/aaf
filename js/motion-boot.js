// Runs before first paint so entrances and image placeholders start cleanly.
document.documentElement.classList.add('aaf-motion', 'aaf-image-skeletons');

// Keep unsplit headings out of the first paint, including the loader wipe.
// Release the fallback if the page module or animation dependencies fail to load.
document.documentElement.classList.add('aaf-heading-pending');
setTimeout(() => {
  document.documentElement.classList.remove('aaf-heading-pending');
}, 10000);

// Shared, dependency-free entry sequence. Runs from the head on every page.
(() => {
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let firstVisit = true;
  try {
    firstVisit = sessionStorage.getItem('aaf:intro-seen') !== 'true';
    sessionStorage.setItem('aaf:intro-seen', 'true');
  } catch {
    // Internal navigation stays quick even when session storage is unavailable.
    try {
      firstVisit = new URL(document.referrer).origin !== location.origin;
    } catch {}
  }
  if (motion.matches) return;

  root.classList.add('aaf-loading');
  if (!firstVisit) root.classList.add('aaf-page-fading');
  let loader;
  let shell;
  let originallyInert = false;
  let finished = false;
  let frame;
  let revealTimer;
  let readyTimer;
  const timers = [];
  const wait = (ms) => new Promise((resolve) => timers.push(setTimeout(resolve, ms)));

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    clearTimeout(revealTimer);
    clearTimeout(readyTimer);
    clearTimeout(safetyTimer);
    timers.forEach(clearTimeout);
    root.classList.remove('aaf-loading', 'aaf-page-fading', 'aaf-intro-revealing');
    loader?.remove();
    if (shell) shell.inert = originallyInert;
    motion.removeEventListener('change', onMotionChange);
    window.removeEventListener('pageshow', onPageShow);
    window.dispatchEvent(new Event('aaf:page-reveal'));
  }

  function onMotionChange(event) {
    if (event.matches) finish();
  }
  function onPageShow(event) {
    if (event.persisted) finish();
  }
  motion.addEventListener('change', onMotionChange);
  window.addEventListener('pageshow', onPageShow);
  // Also release the page if an asset or initialization unexpectedly stalls.
  const safetyTimer = setTimeout(finish, firstVisit ? 9000 : 2000);

  async function start() {
    if (finished) return;
    shell = document.querySelector('.site-shell');
    if (!shell) {
      finish();
      return;
    }
    originallyInert = shell.inert;
    shell.inert = true;
    if (!firstVisit) {
      loader = document.createElement('div');
      loader.className = 'aaf-page-transition';
      loader.setAttribute('aria-hidden', 'true');
      document.body.prepend(loader);
      // Reveal the ready document through a short fade, without waiting on images.
      root.classList.remove('aaf-loading', 'aaf-page-fading');
      window.dispatchEvent(new Event('aaf:page-reveal'));
      const fade = loader.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 700,
        easing: 'cubic-bezier(.4, 0, .2, 1)',
        fill: 'forwards',
      });
      await fade.finished.catch(() => {});
      finish();
      return;
    }
    loader = document.createElement('div');
    loader.className = 'aaf-preloader';
    loader.dataset.mode = 'intro';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'Loading Triple A Hardboard');
    // Exact three A silhouettes from the existing AAF logo, in monochrome.
    loader.innerHTML = `
      <svg class="aaf-preloader-curtain" aria-hidden="true" preserveAspectRatio="none"><path fill-rule="evenodd"/></svg>
      <div class="aaf-preloader-brand" aria-hidden="true">
        <svg class="aaf-preloader-logo" viewBox="0 0 708.35 690">
          <path pathLength="1" d="M354.32 25.64 156.19 422.72H269.5l22.35-50.5 124.89.15 21.88 50.1h113.53L354.32 25.64ZM316.26 292.43l38.09-84.51 37.58 84.51h-75.67Z"/>
          <path pathLength="1" d="m269.54 422.37-113.36.07L33.19 667.5l103.81-.06 13.38-29.82h87.73l10.71 30.15H357.7l-88.16-245.4Zm-94.46 166.3 24.15-52.3 19.7 52.3h-43.85Z"/>
          <path pathLength="1" d="m552.15 422.41-113.53.08-87.64 245.59h108.7l10.91-30.16h87.26l14.25 29.83 104.51.06-124.46-245.4Zm-62.22 165.9 19.57-51.58 23.9 51.58H489.93Z"/>
        </svg>
        <div class="aaf-preloader-wordmark"><strong>TRIPLE A</strong><span>HARDBOARD</span></div>
        <div class="aaf-preloader-track"></div>
      </div>`;
    document.body.prepend(loader);
    const curtain = loader.querySelector('.aaf-preloader-curtain');
    const path = curtain.querySelector('path');
    function draw(progress = 0, origin) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      curtain.setAttribute('viewBox', `0 0 ${width} ${height}`);
      let shape = `M0 0H${width}V${height}H0Z`;
      if (origin) {
        // Size the triangle to cover every corner without ending the wipe early.
        const coverSize =
          Math.max(
            3 * Math.max(origin.x, width - origin.x) + 1.5 * origin.y,
            3 * (height - origin.y),
          ) + 8;
        const size = origin.size + progress * (coverSize - origin.size);
        shape += `M${origin.x} ${origin.y - (size * 2) / 3}L${origin.x - size / 2} ${origin.y + size / 3}H${origin.x + size / 2}Z`;
      }
      path.setAttribute('d', shape);
    }
    draw();
    if (firstVisit) {
      // Only the first visit waits for opening assets and the full logo animation.
      const images = [...document.images].filter(
        (image) =>
          image.loading !== 'lazy' && image.getBoundingClientRect().top < window.innerHeight,
      );
      const assets = Promise.allSettled([
        document.fonts?.ready,
        ...images.map((image) => image.decode()),
      ]);
      await Promise.all([
        wait(1500),
        Promise.race([
          assets,
          new Promise((resolve) => {
            readyTimer = setTimeout(resolve, 5500);
          }),
        ]),
      ]);
    }
    clearTimeout(readyTimer);
    if (finished) return;
    const bounds = loader.querySelector('.aaf-preloader-logo').getBoundingClientRect();
    // Open from the triangular counter inside the top A, then fill the viewport.
    const origin = {
      x: bounds.left + bounds.width * 0.5,
      y: bounds.top + bounds.height * (264.26 / 690),
      size: bounds.height * (84.51 / 690),
    };
    loader.classList.add('is-revealing');
    revealTimer = setTimeout(() => {
      if (finished) return;
      // Expose the page beneath the triangle while its entrances stay paused.
      root.classList.add('aaf-intro-revealing');
      let entrancesStarted = false;
      const started = performance.now();
      function expand(now) {
        const progress = Math.min(1, (now - started) / 1150);
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        draw(eased, origin);
        if (!entrancesStarted && progress >= 0.82) {
          entrancesStarted = true;
          root.classList.remove('aaf-loading', 'aaf-intro-revealing');
          window.dispatchEvent(new Event('aaf:page-reveal'));
        }
        if (progress < 1) frame = requestAnimationFrame(expand);
        else finish();
      }
      frame = requestAnimationFrame(expand);
    }, 180);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else start();
})();
