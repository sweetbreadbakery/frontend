/**
 * Init Web3
 */
// const web3 = new window.Web3(window.Web3.givenProvider || 'https://ropsten.infura.io/v3/aefe6ab3ce96433ba12fa12cd1c37988');

// async function getBlockNumber() {
//   return await web3.eth.getBlockNumber();
// }

/**
 * Init Alpine.js
 */
window.Alpine.store('avime', {
  loaded: false,
  complete() {
    this.loaded = true
  },
});

/**
 * Init everything else...
 */
document.addEventListener('DOMContentLoaded', () => {
  window.Alpine.store('avime').complete();

  console.info('Alpine.js Loaded: ' + window.Alpine.store('avime').loaded);
  // console.info(getBlockNumber());
});
