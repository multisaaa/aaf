export function initManufacturingStory(root = document) {
  const story = root.querySelector('.manufacturing-story');
  if (!story || story.dataset.motionInitialized) return;

  const steps = [...story.querySelectorAll('.manufacturing-step')];
  const links = [...story.querySelectorAll('.manufacturing-navigation a')];
  const images = [...story.querySelectorAll('[data-manufacturing-image]')];
  const photo = story.querySelector('.manufacturing-photo');
  const photoNumber = story.querySelector('.manufacturing-photo-number');
  const photoStatus = story.querySelector('.manufacturing-photo-status');
  const photoCaption = story.querySelector('.manufacturing-photo-caption');
  const header = document.querySelector('.site-header');
  const media = window.matchMedia('(min-width: 821px) and (min-height: 651px) and (prefers-reduced-motion: no-preference)');
  if (!steps.length || images.length !== steps.length || links.length !== steps.length) return;

  let active = -1;
  let frame = 0;
  let headerHeight = 72;
  let enabled = false;
  let request = 0;
  const loads = new Map();

  function loadImage(index) {
    if (!images[index]) return Promise.resolve(false);
    if (loads.has(index)) return loads.get(index);
    const image = images[index];
    const loaded = new Promise(resolve => {
      const finish = async () => {
        if (!image.naturalWidth) return resolve(false);
        try { await image.decode(); } catch { /* A loaded image can still be displayed. */ }
        resolve(true);
      };
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', () => resolve(false), { once: true });
      image.src = image.dataset.src;
      if (image.complete) finish();
    });
    loads.set(index, loaded);
    return loaded;
  }

  async function showPhoto(index) {
    const currentRequest = ++request;
    photoNumber.textContent = `${String(index + 1).padStart(2, '0')} / 08`;
    photo.classList.remove('has-error');
    const image = images[index];
    const stepTitle = steps[index].querySelector('h3')?.textContent || '';
    const stepState = steps[index].querySelector('.manufacturing-inline-image figcaption span')?.textContent || '';
    if (photoCaption) {
      photoCaption.querySelector('span').textContent = stepState;
      photoCaption.querySelector('strong').textContent = stepTitle;
    }
    const isReady = image.complete && image.naturalWidth > 0;
    photo.classList.toggle('is-loading', !isReady);
    photoStatus.textContent = 'Loading photograph…';
    const loaded = await loadImage(index);
    if (currentRequest !== request || !enabled) return;
    images.forEach((item, i) => item.classList.toggle('is-current', loaded && i === index));
    photo.classList.remove('is-loading');
    photo.classList.toggle('has-error', !loaded);
    if (!loaded) photoStatus.textContent = 'Photograph unavailable';
    // Prepare adjacent stages for either direction without delaying the current one.
    loadImage(index + 1);
    loadImage(index - 1);
  }

  function select(index) {
    if (active === index) return;
    active = index;
    steps.forEach((step, i) => step.classList.toggle('is-current', i === index));
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
      link.classList.toggle('is-complete', i < index);
    });
    story.style.setProperty('--manufacturing-progress', String(index / (steps.length - 1)));
    showPhoto(index);
  }

  function update() {
    frame = 0;
    if (!enabled) return;
    const bounds = story.getBoundingClientRect();
    const inRange = bounds.top < window.innerHeight * 2 && bounds.bottom > -window.innerHeight;
    if (!inRange) return;
    const readingLine = headerHeight + (window.innerHeight - headerHeight) / 2;
    let current = 0;
    steps.forEach((step, index) => {
      const rect = step.querySelector('.manufacturing-step-content').getBoundingClientRect();
      if (rect.top <= readingLine) current = index;
    });
    select(current);
  }

  function schedule() {
    if (enabled && !frame) frame = requestAnimationFrame(update);
  }

  function measure() {
    headerHeight = Math.ceil(header?.getBoundingClientRect().height || 72);
    story.style.setProperty('--manufacturing-header', `${headerHeight}px`);
    schedule();
  }

  function configure() {
    enabled = media.matches;
    active = -1;
    request++;
    story.classList.toggle('is-enhanced', enabled);
    measure();
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    if (!enabled || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const rect = steps[index].getBoundingClientRect();
    const readingLine = headerHeight + (window.innerHeight - headerHeight) / 2;
    window.scrollTo({ top: window.scrollY + rect.top + rect.height / 2 - readingLine, behavior: 'smooth' });
  }));

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', measure);
  media.addEventListener('change', configure);
  // The shared hero can resize after its hidden reference frame has loaded.
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(measure);
    observer.observe(root === document ? document.body : root);
    if (header) observer.observe(header);
  }
  story.dataset.motionInitialized = 'true';
  configure();
}
