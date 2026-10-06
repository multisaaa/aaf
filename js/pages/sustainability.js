import { initSubpage } from './subpage.js';
import { initKpiCounter } from '../kpi-counter.js';

initSubpage();
initKpiCounter();

// Native fragment navigation keeps deep links and browser history intact.
// Move focus after a jump so keyboard and screen-reader users follow it too.
function focusTopic() {
  const topic = document.getElementById(window.location.hash.slice(1));
  if (topic?.matches('section[tabindex]')) topic.focus({ preventScroll: true });
}
window.addEventListener('hashchange', focusTopic);
if (window.location.hash) focusTopic();
