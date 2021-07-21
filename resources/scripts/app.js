/**
 * External dependencies
 */
import Alpine from 'alpinejs';

/**
 * Init Alpine.js
 */
window.Alpine = Alpine;
Alpine.store('avime', {
  loaded: false,
  complete() {
    this.loaded = true
  },
});
Alpine.start();

/**
 * Init everything else...
 */
document.addEventListener('DOMContentLoaded', () => {
  Alpine.store('avime').complete();
  console.info('Alpine.js Loaded: ' + Alpine.store('avime').loaded);
});
