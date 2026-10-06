import { COUNTER_TIMING, prefersReducedMotion } from './config.js';
import { whenPageRevealed } from './utils/page-reveal.js';
export function initKpiCounter() {
  whenPageRevealed(startKpiCounter);
}

function startKpiCounter() {
  const counters = [...document.querySelectorAll('[data-kpi-counter]')];
  if (!counters.length) return;

  const reduceMotion = prefersReducedMotion();
  const { duration, delay } = COUNTER_TIMING;

  counters.forEach((counter) => {
    if (counter.dataset.counterInitialized) return;
    const target = Number(counter.dataset.kpiCounter);
    if (!Number.isFinite(target)) return;
    counter.dataset.counterInitialized = 'true';

    const decimals = Math.min(3, Math.max(0, Number(counter.dataset.kpiDecimals) || 0));
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    const suffix = counter.dataset.kpiSuffix || '';
    const formattedTarget = formatter.format(target);
    counter.setAttribute(
      'aria-label',
      counter.dataset.kpiLabel || (suffix === '%' ? `${formattedTarget} percent` : formattedTarget),
    );

    const render = (value) => {
      counter.textContent = `${formatter.format(value)}${suffix}`;
    };

    if (reduceMotion) {
      render(target);
      return;
    }

    render(0);
    let started = false;

    function beginCount() {
      if (started) return;
      started = true;
      let startTime = null;

      function tick(now) {
        if (startTime === null) startTime = now;
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        render(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else render(target);
      }

      setTimeout(() => requestAnimationFrame(tick), delay);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            beginCount();
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(counter);
    } else {
      beginCount();
    }
  });
}
