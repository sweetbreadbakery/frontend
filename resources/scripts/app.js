/**
 * External dependencies
 */
import Alpine from 'alpinejs';

/**
 * Init Alpine.js
 */
window.Alpine = Alpine;
Alpine.store('loaded', false);
Alpine.start();

/**
 * Init everything else...
 */
document.addEventListener('DOMContentLoaded', () => {
  console.info($store);
});
