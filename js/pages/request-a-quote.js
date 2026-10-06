import { initSubpage } from './subpage.js';

const root = initSubpage();
if (root) initQuoteForm(root);

/** Prefill the application and validate the optional email attachment. */
function initQuoteForm(root) {
  const quoteForm = root?.querySelector('[data-quote-form]');
  if (quoteForm) {
    const applicationSelect = quoteForm.querySelector('#application');
    const requestedApplication = new URLSearchParams(window.location.search).get('application');
    if (
      applicationSelect &&
      requestedApplication &&
      [...applicationSelect.options].some((option) => option.value === requestedApplication)
    ) {
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
          attachmentNote.textContent =
            'This file is larger than 10 MB. Please choose a smaller file.';
          return;
        }

        attachmentNote.classList.add('is-selected');
        attachmentNote.textContent = `${file.name} selected · attach it after your email client opens.`;
      });
    }
  }
}
