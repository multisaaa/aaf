export function initKpiCounter() {

  let reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let numericKpi = document.querySelector('[data-kpi-counter]');
  if(!numericKpi) return;

  numericKpi.setAttribute('aria-label','100 percent');
  if(reduceMotion){
    numericKpi.textContent = '100%';
    return;
  }

  numericKpi.textContent = '0%';
  let duration = 1050;
  let delay = 620;
  let started = false;

  function beginCount(){
    if(started) return;
    started = true;
    let startTime = null;
    function tick(now){
      if(startTime === null) startTime = now;
      let t = Math.min(1,(now-startTime)/duration);
      let eased = 1-Math.pow(1-t,3);
      numericKpi.textContent = Math.round(100*eased) + '%';
      if(t < 1) requestAnimationFrame(tick);
      else numericKpi.textContent = '100%';
    }
    requestAnimationFrame(tick);
  }
  setTimeout(beginCount,delay);
}
