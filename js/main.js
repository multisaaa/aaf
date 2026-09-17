import { initNavigation } from './navigation.js';
import { initLanguageSwitcher } from './language-switcher.js';
import { initScrollReveal } from './scroll-reveal.js?v=20260916-opening-reveal-v4';
import { initImageLoading } from './image-loading.js';

initNavigation();
initLanguageSwitcher();
initScrollReveal();
initImageLoading();

document.querySelectorAll('.footer-socials a[data-placeholder]').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});
