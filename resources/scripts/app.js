import Alpine from 'alpinejs';
import { faqs } from './util/faqs';
import { staff } from './util/staff';
import { getRandomIntInclusive } from './util/getRandomIntInclusive';

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
  clear() {
    this.traits.background = 'default';
    this.traits.body = 'default';
    this.traits.face = 'default';
    this.traits.clothes = 'default';
    this.traits.hair = 'default';
    this.traits.accessory = 'default';
  },
  randomize(gender) {
    this.traits.background = getRandomIntInclusive(1, 12);
    this.traits.body = getRandomIntInclusive(1, 12);
    this.traits.face = getRandomIntInclusive(1, 12);
    this.traits.clothes = getRandomIntInclusive(1, 12);
    this.traits.hair = getRandomIntInclusive(1, 12);
    this.traits.accessory = getRandomIntInclusive(1, 12);
    this.gender = (gender === 'female') ? 'male' : 'female';
  },
});

/**
 * Init Alpine.js
 */
window.Alpine = Alpine;
Alpine.start();
