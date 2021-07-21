/**
 * External Dependencies
 */
import Alpine from 'alpinejs';

/**
 * Init Alpine.js
 */
window.Alpine = Alpine;
Alpine.start();

/**
 * Everything else...
 */
document.addEventListener('DOMContentLoaded', () => {
  console.info('DOM Loaded.');
});
