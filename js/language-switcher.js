export function initLanguageSwitcher() {

  let switcher = document.querySelector('.language-switcher');
  if(!switcher) return;
  let trigger = switcher.querySelector('.language-trigger');
  let flagWrap = switcher.querySelector('.language-flag-wrap');
  let currentCode = switcher.querySelector('.language-current-code');
  let options = Array.prototype.slice.call(switcher.querySelectorAll('.language-option'));
  let closeTimer = null;

  function openLanguage(){
    window.clearTimeout(closeTimer);
    switcher.classList.remove('is-closing');
    switcher.setAttribute('open','');
  }

  function closeLanguage(immediate){
    if(!switcher.hasAttribute('open')) return;
    window.clearTimeout(closeTimer);
    if(immediate || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
      switcher.classList.remove('is-closing');
      switcher.removeAttribute('open');
      return;
    }
    switcher.classList.add('is-closing');
    closeTimer = window.setTimeout(function(){
      switcher.removeAttribute('open');
      switcher.classList.remove('is-closing');
    },205);
  }

  trigger.addEventListener('click', function(event){
    event.preventDefault();
    if(switcher.hasAttribute('open') && !switcher.classList.contains('is-closing')){
      closeLanguage(false);
    }else{
      openLanguage();
    }
  });

  let flags = {
    en: `<img class="circle-flag" src="${new URL('../assets/icons/flag-us.svg', import.meta.url).href}" alt="" aria-hidden="true"/>`,
    es: `<img class="circle-flag" src="${new URL('../assets/icons/flag-es.svg', import.meta.url).href}" alt="" aria-hidden="true"/>`,
    fr: `<img class="circle-flag" src="${new URL('../assets/icons/flag-fr.svg', import.meta.url).href}" alt="" aria-hidden="true"/>`,
    ja: `<img class="circle-flag" src="${new URL('../assets/icons/flag-jp.svg', import.meta.url).href}" alt="" aria-hidden="true"/>`,
    th: `<img class="circle-flag" src="${new URL('../assets/icons/flag-th.svg', import.meta.url).href}" alt="" aria-hidden="true"/>`,
    zh: `<img class="circle-flag" src="${new URL('../assets/icons/flag-cn.svg', import.meta.url).href}" alt="" aria-hidden="true"/>`
  };

  function setLanguage(option){
    let lang = option.getAttribute('data-lang');
    let code = option.getAttribute('data-code');
    let name = option.getAttribute('data-name');

    options.forEach(function(item){ item.classList.toggle('is-active', item === option); });
    currentCode.textContent = code;
    trigger.setAttribute('title', name);
    trigger.setAttribute('aria-label', 'Language: ' + name);
    document.documentElement.lang = lang;
    flagWrap.innerHTML = flags[lang] || flags.en;

    try{ localStorage.setItem('aaf-language', lang); }catch(e){}
    closeLanguage(false);
    try{
      window.dispatchEvent(new CustomEvent('aaf:language-change',{detail:{lang:lang,code:code,name:name}}));
    }catch(e){}
  }

  options.forEach(function(option){
    option.addEventListener('click', function(){ setLanguage(option); });
  });

  let saved = null;
  try{ saved = localStorage.getItem('aaf-language'); }catch(e){}
  if(saved){
    let selected = options.find(function(option){ return option.getAttribute('data-lang') === saved; });
    if(selected) setLanguage(selected);
  }

  document.addEventListener('click', function(event){
    if(!switcher.contains(event.target)) closeLanguage(false);
  });

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape') closeLanguage(false);
  });
}
