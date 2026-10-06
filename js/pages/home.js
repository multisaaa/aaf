import { initHeroHeading } from '../hero-heading.js';
import { initHeroParallax } from '../hero-parallax.js';
import { initKpiCounter } from '../kpi-counter.js';

if (document.querySelector('.hero')) {
  initHeroHeading();
  initHeroParallax();
  initKpiCounter();
}
