import Alpine from 'alpinejs';
import { faqs } from './util/faqs';
import { staff } from './util/staff';

/**
 * Set Alpine.js store data
 */

Alpine.store('myAvime', {
  showWardrobe: false,
  gender: 'female',
  staff: staff,
  faqs: faqs,
  traits: {
    background: 'default',
    body: 'default',
    face: 'default',
    clothes: 'default',
    hair: 'default',
    accessory: 'default',
  },
});

/**
 * Init Alpine.js
 */
window.Alpine = Alpine;
Alpine.start();
