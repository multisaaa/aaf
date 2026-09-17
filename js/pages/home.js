import { initHeroHeading } from '../hero-heading.js?v=20260917-gsap-splittext-v3';
import { initHeroParallax } from '../hero-parallax.js';
import { initKpiCounter } from '../kpi-counter.js';

if (document.querySelector('.hero')) {
  initHeroHeading();
  initHeroParallax();
  initKpiCounter();
}
