export function initHeroParallax() {


  let hero = document.querySelector('.hero');
  let media = hero && hero.querySelector('.hero-media');
  let image = media && media.querySelector(':scope > img');
  if(!hero || !media || !image || !window.matchMedia) return;

  let desktopPointer = window.matchMedia('(min-width:821px) and (hover:hover) and (pointer:fine)');
  let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let raf = 0;
  let MAX_X = 7;
  let MAX_Y = 4;
  let EASE = 0.07;

  function render(){
    currentX += (targetX - currentX) * EASE;
    currentY += (targetY - currentY) * EASE;

    image.style.setProperty('--aaf-hero-parallax-x', currentX.toFixed(2) + 'px');
    image.style.setProperty('--aaf-hero-parallax-y', currentY.toFixed(2) + 'px');

    if(Math.abs(targetX-currentX) > 0.05 || Math.abs(targetY-currentY) > 0.05){
      raf = requestAnimationFrame(render);
    }else{
      currentX = targetX;
      currentY = targetY;
      image.style.setProperty('--aaf-hero-parallax-x', currentX.toFixed(2) + 'px');
      image.style.setProperty('--aaf-hero-parallax-y', currentY.toFixed(2) + 'px');
      raf = 0;
    }
  }

  function startRender(){
    if(!raf) raf = requestAnimationFrame(render);
  }

  hero.addEventListener('pointermove', function(event){
    if(!desktopPointer.matches || reduceMotion.matches || event.pointerType === 'touch') return;
    let rect = hero.getBoundingClientRect();
    if(!rect.width || !rect.height) return;

    let nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    let ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    /* Move slightly opposite to the pointer for a natural depth/parallax feel. */
    targetX = -nx * MAX_X;
    targetY = -ny * MAX_Y;
    startRender();
  }, {passive:true});

  hero.addEventListener('pointerleave', function(){
    if(!desktopPointer.matches || reduceMotion.matches) return;
    targetX = 0;
    targetY = 0;
    startRender();
  }, {passive:true});
  function resetMotion(){
    cancelAnimationFrame(raf); raf = 0;
    targetX = targetY = currentX = currentY = 0;
    image.style.removeProperty('--aaf-hero-parallax-x');
    image.style.removeProperty('--aaf-hero-parallax-y');
  }
  desktopPointer.addEventListener('change', resetMotion);
  reduceMotion.addEventListener('change', resetMotion);

}
