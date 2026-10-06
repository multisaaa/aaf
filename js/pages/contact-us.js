import { initSubpage } from './subpage.js';

const root = initSubpage();
if (root) initContact(root);

/** Enhance the authored contact cards and map placeholders. */
function initContact(root) {
  root.querySelectorAll('.contact-location-contact').forEach((group) => {
    group.classList.add('contact-info-grid');
    [...group.children].forEach((link) => {
      if (link.tagName !== 'A') return;
      const icon = link.querySelector('.lucide');
      const value = link.querySelector('span');
      if (!icon || !value) return;

      link.classList.add('contact-info-card');

      const iconWrap = document.createElement('span');
      iconWrap.className = 'contact-info-icon';
      icon.replaceWith(iconWrap);
      iconWrap.append(icon);

      const copy = document.createElement('span');
      copy.className = 'contact-info-copy';
      const label = document.createElement('span');
      label.className = 'contact-info-label';
      label.textContent = link.getAttribute('href')?.startsWith('tel:') ? 'Phone' : 'Email';
      value.className = 'contact-info-value';
      value.replaceWith(copy);
      copy.append(label, value);
    });
  });

  root.querySelectorAll('.contact-map-link').forEach((mapLink) => {
    const map = mapLink.querySelector('.contact-map');
    const { mapSrc, mapTitle } = mapLink.dataset;
    if (!map || !mapSrc || !mapTitle) return;

    const iframe = document.createElement('iframe');
    iframe.src = mapSrc;
    iframe.title = mapTitle;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    map.querySelector('img')?.replaceWith(iframe);
    map.querySelector('.contact-map-pin')?.remove();
    map.querySelector('.contact-map-attribution')?.remove();

    const mapContainer = document.createElement('div');
    mapContainer.className = mapLink.className;

    mapLink.replaceWith(mapContainer);
    mapContainer.append(map);
  });
}
