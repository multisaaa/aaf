/** Page-specific behavior after the shared subpage markup has been rendered. */
export function initSubpageInteractions(root, page) {
  if (page === 'contact-us' && root) {
    root.querySelectorAll('.contact-location-contact').forEach(group => {
      group.classList.add('contact-info-grid');
      [...group.children].forEach(link => {
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

    const contactMapEmbeds = [
      {
        src: 'https://www.google.com/maps?q=13.726796380054976,100.52815767116405&output=embed',
        title: 'Google Maps location for the AAF Sales office in Bangkok'
      },
      {
        src: 'https://www.google.com/maps?q=14.757355480969595,102.20001532098938&output=embed',
        title: 'Google Maps location for the AAF factory in Chok Chai'
      }
    ];

    root.querySelectorAll('.contact-map-link').forEach((mapLink, index) => {
      const map = mapLink.querySelector('.contact-map');
      const embed = contactMapEmbeds[index];
      if (!map || !embed) return;

      const iframe = document.createElement('iframe');
      iframe.src = embed.src;
      iframe.title = embed.title;
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

  const quoteForm = root?.querySelector('[data-quote-form]');
  if (quoteForm) {
    const applicationSelect = quoteForm.querySelector('#application');
    const requestedApplication = new URLSearchParams(window.location.search).get('application');
    if (applicationSelect && requestedApplication && [...applicationSelect.options].some(option => option.value === requestedApplication)) {
      applicationSelect.value = requestedApplication;
    }

    const attachmentInput = quoteForm.querySelector('[data-attachment-input]');
    const attachmentNote = quoteForm.querySelector('#attachment-note');
    const maxAttachmentSize = 10 * 1024 * 1024;
    if (attachmentInput && attachmentNote) {
      attachmentInput.addEventListener('change', () => {
        const file = attachmentInput.files?.[0];
        attachmentNote.classList.remove('is-error', 'is-selected');

        if (!file) {
          attachmentNote.textContent = 'Optional · PDF, XLSX, DOCX, JPG or PNG · maximum 10 MB';
          return;
        }

        if (file.size > maxAttachmentSize) {
          attachmentInput.value = '';
          attachmentNote.classList.add('is-error');
          attachmentNote.textContent = 'This file is larger than 10 MB. Please choose a smaller file.';
          return;
        }

        attachmentNote.classList.add('is-selected');
        attachmentNote.textContent = `${file.name} selected · attach it after your email client opens.`;
      });
    }
  }

  if (page === 'wet-process-hardboard' && root) {
    import('./pages/manufacturing-story.js')
      .then(({ initManufacturingStory }) => initManufacturingStory(root))
      .catch(error => console.warn('Manufacturing motion unavailable; showing the complete story.', error));
  }

}
