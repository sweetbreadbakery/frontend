import Alpine from 'alpinejs';
import { faqs } from './util/faqs';
import { staff } from './util/staff';
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
  s00Address: '0xbB814A990E7f6c6854777B396dc1814A12202357',
  s01Address: '0x25fCAcDF36a647DA97c8F214b8331caEaD0c66ac',
  fusionAddress: '0x03bcA6278A4c3e1231D41EC98a66cF06dF2C4797',
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
  s00Contact: null,
  s01Contract: null,
  fusionContact: null,
  walletAddress: '',
  checkWeb3: checkWeb3,
  checkWebAccount: checkWebAccount,
  updateMyAvime: updateMyAvime,
  T0_current: null,
  T0_data: [],
  staff: staff,
  faqs: faqs,
  season0Data: null,
  fusion: {
    selected: {
      count: 6,
      gender: 'Female',
      traits: {
        background: null,
        body: null,
        face: null,
        clothes: null,
        hair: null,
        accessory: null,
      },
    },
  },
  complete() {
    this.loaded = true;
    this.s00Contract = new web3.eth.Contract(s01Abi, this.s00Address);
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
