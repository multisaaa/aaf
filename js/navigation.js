import { MOBILE_BREAKPOINT, MENU_CLOSE_DURATION, prefersReducedMotion } from './config.js';
import { createDetailsDisclosure } from './utils/details-disclosure.js';

export function initNavigation() {
  initDesktopMenus();
  initHeaderScroll();
  let nav = document.querySelector('.mobile-nav');
  if (!nav) return;

  let summary = nav.querySelector(':scope > summary');

  function setExpanded(expanded) {
    summary.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    summary.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('aaf-mobile-menu-open', expanded);
  }

  const menu = createDetailsDisclosure(nav, {
    closeDuration: MENU_CLOSE_DURATION.navigation,
    onChange: setExpanded,
  });

  summary.addEventListener('click', function (event) {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;
    event.preventDefault();
    menu.toggle();
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.close(true);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') menu.close(false);
  });

  document.addEventListener('click', function (event) {
    if (window.innerWidth > MOBILE_BREAKPOINT || !nav.hasAttribute('open')) return;
    if (nav.contains(event.target)) return;
    menu.close(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > MOBILE_BREAKPOINT) menu.close(true);
  });
}

/** Reveal the sticky header when the reader changes scroll direction. */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const scrollPosition = () =>
    Math.max(
      0,
      Math.min(
        window.scrollY,
        Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
      ),
    );
  let previousY = scrollPosition();
  let travel = 0;
  let frame = null;

  function update() {
    frame = null;
    const y = scrollPosition();
    const delta = y - previousY;
    previousY = y;
    if (delta * travel < 0) travel = 0;
    travel += delta;

    const isInteracting =
      header.querySelector('.nav-menu.is-open, .language-switcher[open], .mobile-nav[open]') ||
      (header.contains(document.activeElement) && document.activeElement.matches(':focus-visible'));
    if (y <= header.offsetHeight || isInteracting) {
      header.classList.remove('is-scroll-hidden');
      travel = 0;
    } else if (Math.abs(travel) >= 8) {
      header.classList.toggle('is-scroll-hidden', travel > 0);
      travel = 0;
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    },
    { passive: true },
  );
  header.addEventListener('focusin', () => header.classList.remove('is-scroll-hidden'));
  window.addEventListener('resize', () => {
    previousY = scrollPosition();
    travel = 0;
    header.classList.remove('is-scroll-hidden');
  });
}

/** Add click/touch and keyboard controls to the existing hover dropdowns. */
function initDesktopMenus() {
  const menus = [...document.querySelectorAll('.main-nav .nav-menu')];
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const closeTimers = new WeakMap();
  function setOpen(menu, open) {
    if (!open && menu.classList.contains('is-closing')) return;
    window.clearTimeout(closeTimers.get(menu));
    const wasOpen = menu.classList.contains('is-open');
    menu.classList.remove('is-closing');
    menu.classList.toggle('is-open', open);
    if (!open && wasOpen && !prefersReducedMotion()) {
      menu.classList.add('is-closing');
      closeTimers.set(
        menu,
        window.setTimeout(() => {
          menu.classList.remove('is-closing');
          closeTimers.delete(menu);
        }, MENU_CLOSE_DURATION.desktop),
      );
    }
    menu.querySelector('.nav-dropdown').inert = !open;
    if (!open) menu.classList.remove('is-pinned');
    menu.querySelector('.nav-trigger').setAttribute('aria-expanded', String(open));
  }
  function closeAll(except) {
    menus.forEach((menu) => {
      if (menu !== except) setOpen(menu, false);
    });
  }
  menus.forEach((menu, index) => {
    const trigger = menu.querySelector('.nav-trigger');
    const dropdown = menu.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;
    dropdown.id ||= `nav-dropdown-${index}`;
    trigger.setAttribute('aria-controls', dropdown.id);
    trigger.setAttribute('aria-expanded', 'false');
    dropdown.inert = true;
    menu.dataset.navEnhanced = 'true';
    function open() {
      closeAll(menu);
      setOpen(menu, true);
    }
    if (trigger.tagName !== 'A') {
      trigger.addEventListener('click', () => {
        const wasPinned = menu.classList.contains('is-pinned');
        closeAll(menu);
        setOpen(menu, !wasPinned);
        menu.classList.toggle('is-pinned', !wasPinned);
      });
    }
    menu.addEventListener('pointerenter', () => {
      if (hover.matches) open();
    });
    menu.addEventListener('pointerleave', () => {
      if (
        hover.matches &&
        !menu.classList.contains('is-pinned') &&
        !menu.contains(document.activeElement)
      )
        setOpen(menu, false);
    });
    menu.addEventListener('focusin', (event) => {
      if (event.target !== trigger) open();
    });
    menu.addEventListener('focusout', (event) => {
      if (!menu.contains(event.relatedTarget)) setOpen(menu, false);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        open();
        dropdown.querySelector('a')?.focus();
      }
    });
    dropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(menu, false));
    });
    if (
      menu.classList.contains('nav-sustainability') &&
      document.body.dataset.page === 'sustainability'
    ) {
      trigger.classList.add('is-current');
    }
  });
  document.addEventListener('click', (event) => {
    if (!menus.some((menu) => menu.contains(event.target))) closeAll();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const activeMenu = menus.find(
      (menu) => menu.classList.contains('is-open') && menu.contains(document.activeElement),
    );
    closeAll();
    activeMenu?.querySelector('.nav-trigger').focus();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) closeAll();
  });
}
