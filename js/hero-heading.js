import { whenPageRevealed } from './utils/page-reveal.js';
const HEADING_SELECTOR = '.hero h1, .subpage-hero h1';
const LINE_DURATION = 0.88;
const LINE_STAGGER = 0.09;
const LINE_EASE = 'power4.out';

/** Animate every Hero Heading with one responsive SplitText implementation. */
export function initHeroHeading() {
  whenPageRevealed(startHeroHeading);
}

function startHeroHeading() {
  const heading = document.querySelector(HEADING_SELECTOR);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gsap = window.gsap;
  const SplitText = window.SplitText;

  if (
    !heading ||
    motion.matches ||
    !document.documentElement.classList.contains('aaf-motion') ||
    heading.classList.contains('hero-heading-split') ||
    !gsap ||
    !SplitText
  ) {
    heading?.classList.add('hero-heading-ready');
    return;
  }

  gsap.registerPlugin(SplitText);

  let tween;
  const split = SplitText.create(heading, {
    type: 'lines',
    mask: 'lines',
    // SplitText appends "-mask" to this value for each line mask.
    linesClass: 'heroHeadingLine',
    // tag: 'span',
    aria: 'auto',
    autoSplit: true,
    deepSlice: true,
    onSplit(self) {
      if (motion.matches) {
        gsap.set(self.lines, { yPercent: 0 });
        heading.classList.add('hero-heading-ready');
        return;
      }

      tween = gsap.fromTo(
        self.lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: LINE_DURATION,
          stagger: LINE_STAGGER,
          ease: LINE_EASE,
          overwrite: 'auto',
        },
      );
      // fromTo has now positioned the lines below their masks; reveal only then.
      heading.classList.add('hero-heading-ready');
      return tween;
    },
  });

  if (!split?.lines?.length) return;
  heading.classList.add('hero-heading-split');

  const stopForReducedMotion = (event) => {
    if (!event.matches) return;
    tween?.kill();
    gsap.set(split.lines, { yPercent: 0 });
    motion.removeEventListener('change', stopForReducedMotion);
  };
  motion.addEventListener('change', stopForReducedMotion);
}
