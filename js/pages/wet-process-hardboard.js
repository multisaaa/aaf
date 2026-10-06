import { initSubpage } from './subpage.js';

const root = initSubpage();
if (root) {
  import('./manufacturing-story.js')
    .then(({ initManufacturingStory }) => initManufacturingStory(root))
    .catch((error) =>
      console.warn('Manufacturing motion unavailable; showing the complete story.', error),
    );
}
