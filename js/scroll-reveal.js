import { prefersReducedMotion } from './config.js';

// [selector, initial delay in ms, stagger in ms], in the existing reveal order.
const REVEAL_GROUPS = [
  ['.home-company-intro > div', 0, 90],
  ['.home-evidence-heading > *', 0, 80],
  ['.home-evidence-grid > .evidence-card', 20, 90],

  ['.page-section > .section-header > *', 0, 70],
  ['.application-grid > .application-card', 20, 90],

  ['.material-grid > div:first-child', 0, 0],
  ['.process-steps > figure', 30, 90],

  /* Technical heading is nested inside .split-heading, so include it explicitly. */
  ['#technical-data .split-heading > .section-header > *', 0, 70],
  ['#technical-data .table-wrap', 20, 0],
  ['#technical-data .technical-actions > *', 30, 80],

  ['.cta-inner > div', 0, 0],
  ['.cta-inner > .button', 90, 0],

  // Subpages share Home's slide-up language, but their content is composed from
  // a wider set of reusable blocks than the homepage.
  ['.subpage-main .subpage-hero > div > .breadcrumbs', 0, 0],
  ['.subpage-main .subpage-hero > div > .eyebrow', 0, 0],
  ['.subpage-main > .proof-bar .proof-bar-inner > span', 0, 80],

  ['.subpage-main .section-intro > *', 0, 70],
  ['.subpage-main .section-header > .eyebrow', 0, 0],
  ['.subpage-main .section-header > h2', 70, 0],
  ['.subpage-main .section-header > p', 140, 0],
  ['.subpage-main .coil-evidence-intro > .eyebrow', 0, 0],
  ['.subpage-main .coil-evidence-intro > h2', 70, 0],
  ['.subpage-main .subpage-gallery > figure', 180, 90],
  ['.subpage-main .asset-gallery > .asset-card', 180, 90],
  ['.subpage-main .application-grid > .application-card', 180, 90],
  ['.subpage-main .automotive-evidence-grid > .application-card', 180, 90],
  ['.subpage-main .feature-grid > .feature-card', 180, 90],
  ['.subpage-main .document-grid > .document-card', 180, 90],
  ['.subpage-main .faq-grid > article', 180, 90],
  ['.subpage-main .faq-list > details', 180, 70],
  ['.subpage-main .workflow > *', 180, 90],
  ['.subpage-main .group-supply-story-grid > *', 0, 90],
  ['.subpage-main .group-supply-proof-grid > .group-supply-proof', 180, 90],
  ['.subpage-main .material-reference', 360, 0],
  ['.subpage-main .diagram-grid > *', 0, 90],
  ['.subpage-main .automotive-detail-grid > *', 0, 90],
  ['.subpage-main .manufacturing-stage', 180, 0],
  ['.subpage-main .manufacturing-step', 180, 80],
  ['.subpage-main .data-table-wrap', 180, 0],
  ['.subpage-main .contact-location-grid > .contact-location-card', 20, 90],
  ['.subpage-main .contact-request > *', 0, 90],
  ['.subpage-main .enquiry-layout > *', 0, 90],
  ['.subpage-main .privacy-copy > section', 0, 70],
  ['.sustainability-tree-content > .sustainability-split > *', 0, 90],
  ['.sustainability-tree-details > *', 0, 90],
  ['.sustainability-section-heading > *', 0, 70],
  ['.sustainability-community > .page-width > .sustainability-split > *', 0, 90],
  ['.sustainability-community-gallery > figure', 0, 90],
  ['.sustainability-solar-grid > article', 0, 90],
  ['.sustainability-impact-section', 0, 0],
  ['.sustainability-energy-gallery > figure', 0, 90],
  ['.sustainability-quote', 0, 0],
  ['.sustainability-nature > .page-width > .sustainability-split > *', 0, 90],
  ['.sustainability-pillars > article', 0, 90],
  ['.sustainability-model-section', 0, 0],
];

const OBSERVER_OPTIONS = { threshold: 0.1, rootMargin: '0px 0px -6% 0px' };

export function initScrollReveal() {
  let root = document.documentElement;
  let reduceMotion = prefersReducedMotion();

  function mark(selector, baseDelay, stagger) {
    let nodes = document.querySelectorAll(selector);
    nodes.forEach(function (el, index) {
      el.classList.add('aaf-reveal');
      let delay = (baseDelay || 0) + index * (stagger || 0);
      el.style.setProperty('--reveal-delay', delay + 'ms');
    });
  }

  // Opening text, proof statements and image use CSS first-load animations.
  // This module only reveals subsequent sections on scroll.

  REVEAL_GROUPS.forEach(([selector, delay, stagger]) => mark(selector, delay, stagger));

  // Content already visible below the hero needs a reliable opening entrance.
  // Excluding hero chrome keeps the page headline in control of the sequence.
  if (window.scrollY < 18) {
    let openingContent = Array.prototype.slice
      .call(document.querySelectorAll('main .aaf-reveal'))
      .filter(function (el) {
        return !el.closest('.hero, .subpage-hero');
      });
    let openingIndex = 0;
    openingContent.forEach(function (el) {
      let bounds = el.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight * 0.94) {
        el.classList.remove('aaf-reveal');
        el.classList.add('aaf-opening-content');
        let delay;
        delay = 480 + openingIndex * 120;
        openingIndex += 1;
        el.style.removeProperty('--reveal-delay');
        el.style.setProperty('--opening-content-delay', delay + 'ms');
      }
    });
  }

  let revealItems = Array.prototype.slice.call(document.querySelectorAll('.aaf-reveal'));
  let scrollRevealItems = revealItems;
  root.classList.add('aaf-motion-ready');

  // Relationship cards use one observer for the whole flow. Observing each
  // card independently lets the browser deliver entries in different frames,
  // which makes the stagger appear out of order while the section is entering.
  let relationshipFlow = document.querySelector('.subpage-main .group-relationship-flow');
  if (relationshipFlow) {
    let relationshipSteps = Array.prototype.slice.call(
      relationshipFlow.querySelectorAll('.group-relationship-step'),
    );
    relationshipSteps.forEach(function (step, index) {
      step.style.setProperty('--relationship-step-delay', index * 140 + 'ms');
    });

    let revealRelationshipFlow = function () {
      relationshipFlow.classList.add('aaf-relationship-visible');
    };

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealRelationshipFlow();
    } else {
      let relationshipObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealRelationshipFlow();
            relationshipObserver.unobserve(entry.target);
          }
        });
      }, OBSERVER_OPTIONS);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          relationshipObserver.observe(relationshipFlow);
        });
      });
    }
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) {
      el.classList.add('aaf-visible');
    });
  } else {
    // The CTA clips overflow, so its translated button can be entirely outside
    // the visible box. Observe the stationary shell to start that entrance.
    let revealTargets = new Map();
    scrollRevealItems.forEach(function (el) {
      let target = el.matches('.cta-inner > .button') ? el.parentElement : el;
      let items = revealTargets.get(target) || [];
      items.push(el);
      revealTargets.set(target, items);
    });

    let observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealTargets.get(entry.target).forEach(function (el) {
            el.classList.add('aaf-visible');
          });
          observer.unobserve(entry.target);
        }
      });
    }, OBSERVER_OPTIONS);

    // Let the initial hidden state paint before observing in-viewport content;
    // otherwise an immediate intersection can skip the slide-up transition.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        revealTargets.forEach(function (_items, target) {
          observer.observe(target);
        });
      });
    });
  }

  let ticking = false;
  function updateHeader() {
    document.body.classList.toggle('aaf-has-scrolled', window.scrollY > 18);
    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  }
  updateHeader();
  window.addEventListener('scroll', onScroll, { passive: true });
}
