import Alpine from 'alpinejs';
import { s01Abi } from './util/s01Abi';
import { fusionAbi } from './util/fusionAbi';
import { checkWeb3 } from './util/checkWeb3';
import { checkWebAccount } from './util/checkWebAccount';
import { updateMyAvime } from './util/updateMyAvime';

/**
 * Init Web3
 */
const ethereum = window.ethereum;
const web3 = new window.Web3(ethereum);

/**
 * Set Alpine.js store data
 */
Alpine.store('avime', {
  loaded: false,
  walletConnected: false,
  s00Address: '0x103c044cc93Dd1cDac816B9d886ca1F3F7f5D623',
  s01Address: '0xf250E5827Aa59eB6F82bf60d153bC79197DAb0F7',
  fusionAddress: '0x0Cd2D6c0eb6bf5d92751cB2eA73DA643256E5678',
  myAvime: [],
  traitName: ['Background', 'Body', 'Face', 'Clothes', 'Hair', 'Accessory'],
  selectedTraits: [0, 0, 0, 0, 0, 0],
  selectedSeasons: [-1, -1, -1, -1, -1, -1],
  cardCurrent: null,
  cardData: [],
  nameData: [],
  descData: [],
  thumbData: [],
  maleData: [],
  femaleData: [],
  currentTraitNum: null,
  s01Contract: null,
  fusionContact: null,
  walletAddress: '',
  checkWeb3: checkWeb3,
  checkWebAccount: checkWebAccount,
  updateMyAvime: updateMyAvime,
  T0_current: null,
  T0_data: [],
  complete() {
    this.loaded = true;
    this.s01Contract = new web3.eth.Contract(s01Abi, this.s01Address);
    this.fusionContract = new web3.eth.Contract(fusionAbi, this.fusionAddress);
    setTimeout(this.checkWebAccount, 500, ethereum, web3);
  },
  connect() {
    this.walletConnected = true;
  },
  disconnect() {
    this.walletConnected = false;
  },
});

/**
 * Init Alpine.js
 */
window.Alpine = Alpine;
Alpine.start();

/**
 * Init everything else...
 */
document.addEventListener('DOMContentLoaded', () => {
  window.Alpine.store('avime').complete();

  document.getElementById('eth-login').addEventListener('click', function () {
    try {
      ethereum.request({ method: 'eth_requestAccounts' });
    } catch (err) {
      this.innerHTML = 'Web3 Wallet Not Available';
    }

    window.Alpine.store('avime').checkWeb3(ethereum, web3);
  });
});
