import { initNavigation } from './navigation.js';
import { initLanguageSwitcher } from './language-switcher.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initImageLoading } from './image-loading.js';
import { initPageTransition } from './page-transition.js';

initNavigation();
initLanguageSwitcher();
initScrollReveal();
initImageLoading();
initPageTransition();

document.querySelectorAll('.footer-socials a[data-placeholder]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});
