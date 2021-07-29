/**
 * Init Web3
 */
const web3 = new window.Web3(window.Web3.givenProvider || 'https://ropsten.infura.io/v3/aefe6ab3ce96433ba12fa12cd1c37988');

/**
 * Init Alpine.js
 */
window.Alpine.store('avime', {
  loaded: false,
  complete() {
    this.loaded = true;
    web3.eth.getBlockNumber().then(console.info);
  },
});

/**
 * Init everything else...
 */
document.addEventListener('DOMContentLoaded', () => {
  window.Alpine.store('avime').complete();
});
