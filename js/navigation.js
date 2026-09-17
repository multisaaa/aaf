export function initNavigation() {


  let nav = document.querySelector('.mobile-nav');
  if (!nav) return;

  let summary = nav.querySelector(':scope > summary');
  let closeTimer = null;

  function setExpanded(expanded){
    summary.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    summary.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('aaf-mobile-menu-open', expanded);
  }

  function openMenu(){
    window.clearTimeout(closeTimer);
    nav.classList.remove('is-closing');
    nav.setAttribute('open', '');
    setExpanded(true);
  }

  function closeMenu(immediate){
    if (!nav.hasAttribute('open')) return;
    window.clearTimeout(closeTimer);

    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      nav.classList.remove('is-closing');
      nav.removeAttribute('open');
      setExpanded(false);
      return;
    }

    nav.classList.add('is-closing');
    setExpanded(false);
    closeTimer = window.setTimeout(function(){
      nav.removeAttribute('open');
      nav.classList.remove('is-closing');
    }, 225);
  }

  summary.addEventListener('click', function(event){
    if (window.innerWidth > 820) return;
    event.preventDefault();
    if (nav.hasAttribute('open') && !nav.classList.contains('is-closing')){
      closeMenu(false);
    }else{
      openMenu();
    }
  });

  nav.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){ closeMenu(true); });
  });

  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape') closeMenu(false);
  });

  document.addEventListener('click', function(event){
    if (window.innerWidth > 820 || !nav.hasAttribute('open')) return;
    if (nav.contains(event.target)) return;
    closeMenu(false);
  });

  window.addEventListener('resize', function(){
    if (window.innerWidth > 820) closeMenu(true);
  });
}
