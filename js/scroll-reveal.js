export function initScrollReveal() {


  let root = document.documentElement;
  let reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mark(selector, baseDelay, stagger){
    let nodes = document.querySelectorAll(selector);
    nodes.forEach(function(el, index){
      el.classList.add('aaf-reveal');
      let delay = (baseDelay || 0) + (index * (stagger || 0));
      el.style.setProperty('--reveal-delay', delay + 'ms');
    });
  }

  // Opening text, proof statements and image use CSS first-load animations.
  // This module only reveals subsequent sections on scroll.

  mark('.home-company-intro > div', 0, 90);
  mark('.home-evidence-heading > *', 0, 80);
  mark('.home-evidence-grid > .evidence-card', 20, 90);

  mark('.page-section > .section-header > *', 0, 70);
  mark('.application-grid > .application-card', 20, 90);

  mark('.material-grid > div:first-child', 0, 0);
  mark('.process-steps > figure', 30, 90);

  /* Technical heading is nested inside .split-heading, so include it explicitly. */
  mark('#technical-data .split-heading > .section-header > *', 0, 70);
  mark('#technical-data .table-wrap', 20, 0);
  mark('#technical-data .technical-actions > *', 30, 80);

  mark('.cta-inner > div', 0, 0);
  mark('.cta-inner > .button', 90, 0);

  // Subpages share Home's slide-up language, but their content is composed from
  // a wider set of reusable blocks than the homepage.
  mark('.subpage-main .subpage-hero > div > .breadcrumbs', 0, 0);
  mark('.subpage-main .subpage-hero > div > .eyebrow', 0, 0);
  mark('.subpage-main > .proof-bar .proof-bar-inner > span', 0, 80);

  mark('.subpage-main .section-intro > *', 0, 70);
  mark('.subpage-main .section-header > .eyebrow', 0, 0);
  mark('.subpage-main .section-header > h2', 70, 0);
  mark('.subpage-main .section-header > p', 140, 0);
  mark('.subpage-main .coil-evidence-intro > .eyebrow', 0, 0);
  mark('.subpage-main .coil-evidence-intro > h2', 70, 0);
  mark('.subpage-main .subpage-gallery > figure', 180, 90);
  mark('.subpage-main .asset-gallery > .asset-card', 180, 90);
  mark('.subpage-main .application-grid > .application-card', 180, 90);
  mark('.subpage-main .automotive-evidence-grid > .application-card', 180, 90);
  mark('.subpage-main .feature-grid > .feature-card', 180, 90);
  mark('.subpage-main .document-grid > .document-card', 180, 90);
  mark('.subpage-main .faq-grid > article', 180, 90);
  mark('.subpage-main .faq-list > details', 180, 70);
  mark('.subpage-main .workflow > *', 180, 90);
  mark('.subpage-main .group-relationship-shell', 0, 0);
  mark('.subpage-main .group-relationship-flow > .group-relationship-step', 960, 90);
  mark('.subpage-main .group-supply-story-grid > *', 0, 90);
  mark('.subpage-main .group-supply-proof-grid > .group-supply-proof', 180, 90);
  mark('.subpage-main .material-reference', 360, 0);
  mark('.subpage-main .diagram-grid > *', 0, 90);
  mark('.subpage-main .automotive-detail-grid > *', 0, 90);
  mark('.subpage-main .manufacturing-stage', 180, 0);
  mark('.subpage-main .manufacturing-step', 180, 80);
  mark('.subpage-main .data-table-wrap', 180, 0);
  mark('.subpage-main .contact-location-grid > .contact-location-card', 20, 90);
  mark('.subpage-main .contact-request > *', 0, 90);
  mark('.subpage-main .enquiry-layout > *', 0, 90);
  mark('.subpage-main .privacy-copy > section', 0, 70);

  // Content already visible below the hero needs a reliable opening entrance.
  // Excluding hero chrome keeps the page headline in control of the sequence.
  if(window.scrollY < 18){
    let openingContent = Array.prototype.slice.call(document.querySelectorAll('main .aaf-reveal'))
      .filter(function(el){ return !el.closest('.hero, .subpage-hero'); });
    let openingIndex = 0;
    openingContent.forEach(function(el){
      let bounds = el.getBoundingClientRect();
      if(bounds.bottom > 0 && bounds.top < window.innerHeight * .94){
        el.classList.remove('aaf-reveal');
        el.classList.add('aaf-opening-content');
        let frame = el.closest('.group-relationship-shell.aaf-opening-content');
        let delay;
        if(frame && el.classList.contains('group-relationship-step')){
          let frameDelay = parseInt(frame.style.getPropertyValue('--opening-content-delay'), 10) || 0;
          let steps = Array.prototype.slice.call(frame.querySelectorAll('.group-relationship-step'));
          let stepIndex = steps.indexOf(el);
          delay = frameDelay + 960 + stepIndex * 120;
          openingIndex = Math.max(openingIndex + 1, Math.ceil((delay - 480) / 120) + 1);
        }else{
          delay = 480 + openingIndex * 120;
          openingIndex += 1;
        }
        el.style.removeProperty('--reveal-delay');
        el.style.setProperty('--opening-content-delay', delay + 'ms');
      }
    });
  }

  let revealItems = Array.prototype.slice.call(document.querySelectorAll('.aaf-reveal'));
  let scrollRevealItems = revealItems;
  root.classList.add('aaf-motion-ready');

  if(reduceMotion || !('IntersectionObserver' in window)){
    revealItems.forEach(function(el){ el.classList.add('aaf-visible'); });
  }else{
    let observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('aaf-visible');
          observer.unobserve(entry.target);
        }
      });
    },{
      threshold:0.10,
      rootMargin:'0px 0px -6% 0px'
    });

    // Let the initial hidden state paint before observing in-viewport content;
    // otherwise an immediate intersection can skip the slide-up transition.
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        scrollRevealItems.forEach(function(el){ observer.observe(el); });
      });
    });
  }

  let ticking = false;
  function updateHeader(){
    document.body.classList.toggle('aaf-has-scrolled', window.scrollY > 18);
    ticking = false;
  }
  function onScroll(){
    if(!ticking){
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  }
  updateHeader();
  window.addEventListener('scroll', onScroll, {passive:true});
}
