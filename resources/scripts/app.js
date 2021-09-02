import Alpine from 'alpinejs';
import { faqs } from './util/faqs';
import { staff } from './util/staff';
import { s01Abi } from './util/s01Abi';
import { fusionAbi } from './util/fusionAbi';

/**
 * Init Web3
 */
const ethereum = window.ethereum;
const web3 = new window.Web3(ethereum);

/**
 * Set Alpine.js store data
 */
Alpine.store('myAvime', {
  s01Abi: s01Abi,
  fusionAbi: fusionAbi,
  s00Address: '0x10fE2787a8a8d191fB4389A71083Fc0CC2dC1E35',
  s00Contract: null,
  s01Address: '0x6CD79b5fe03cf8Cb462fC8fA0914EBCfe5DD4C5f',
  s01Contract: new web3.eth.Contract(s01Abi, '0x6CD79b5fe03cf8Cb462fC8fA0914EBCfe5DD4C5f'),
  fusionAddress: '0xd92Cc219AcF2199DeadAC2b965B35B9e84FA7F0A',
  fusionContract: new web3.eth.Contract(fusionAbi, '0xd92Cc219AcF2199DeadAC2b965B35B9e84FA7F0A'),
  walletAddress: '',
  walletConnected: false,
  staff: staff,
  faqs: faqs,
  fusedAvime: 0,
  myAvime: [],
  selected: {
    sex: 'female',
    traits: {
      background: 'default',
      body: 'default',
      face: 'default',
      clothes: 'default',
      hair: 'default',
      accessory: 'default',
    },
  },
  wardrobe: {
    background: [],
    body: [],
    face: [],
    clothes: [],
    hair: [],
    accessory: [],
  },
  sex: 'female',
  traits: {
    background: [],
    body: [],
    face: [],
    clothes: [],
    hair: [],
    accessory: [],
  },
  selectedSex: 0,
  selectedSeasons: [-1, -1, -1, -1, -1, -1],
  selectedTraits: [0, 0, 0, 0, 0, 0],
  async approve() {
    try {
      let approve = await this.s01Contract.methods
        .setApprovalForAll(this.fusionAddress, 1)
        .send({ from: this.walletAddress });

      console.log(approve);
    } catch (err) {
      console.error(err);
    }
  },
  async checkWeb3() {
    try {
      if (ethereum) {
        document.getElementById('eth-login').classList.add('is-disabled');
        document.getElementById('eth-login').innerHTML = 'Please check Web3 wallet';

        const currentAccounts = await web3.eth.getAccounts();
        const account = currentAccounts[0];
        window.Alpine.store('myAvime').walletAddress = account;

        if (account) {
          window.Alpine.store('myAvime').walletConnected = true;
          document.getElementById('eth-login').classList.remove('is-disabled');
          document.getElementById('eth-login').innerHTML = `Wallet: ${account.substring(0, 6)}...${account.slice(account.length - 4)}`;
          document.getElementById('eth-login').classList.add('is-success');
        } else {
          window.Alpine.store('myAvime').walletConnected = false;
          document.getElementById('eth-login').classList.remove('is-disabled');
          document.getElementById('eth-login').innerHTML = 'Connect Wallet';
        }
      } else {
        document.getElementById('eth-login').innerHTML = 'Error loading Web3';
        document.getElementById('eth-login').classList.add('is-disabled');
      }
    } catch (err) {
      console.error(err);
    }
  },
  async checkWebAccount() {
    try {
      const currentAccounts = await web3.eth.getAccounts();
      const account = currentAccounts[0];

      if (account != window.Alpine.store('myAvime').walletAddress) {
        window.Alpine.store('myAvime').walletAddress = account;
        window.Alpine.store('myAvime').checkWeb3();
        window.Alpine.store('myAvime').update();
      }

      setTimeout(this.checkWebAccount);
    } catch (err) {
      console.error(err);
    }
  },
  async deselect(type) {
    this.selectedTraits[type] = 0;
    this.selectedSeasons[type] = -1;
  },
  async fuse() {
    try {
      let cost = 10000000000000000;
      let mint = await this.fusionContract.methods
        .mint(this.selectedSeasons, this.selectedTraits, this.selectedSex)
        .send({ from: this.walletAddress, value: cost });

      this.update();

      console.info(mint);
    } catch (err) {
      console.error(err);
    }
  },
  async mint(amount) {
    let cost = null;
    let mint = 90000000000000000;

    if (this.walletAddress === '0xA23270E0fb611896e26617bdFb0cA5D52a00556c') {
      cost = cost * amount;
      mint = await this.s01Contract.methods
        .mint( amount )
        .send({from: this.walletAddress, value: cost});

      console.info(mint);
    }
  },
  async select(trait) {
    this.selectedTraits[trait.tnum] = trait.ID;
    this.selectedSeasons[trait.tnum] = 1;

    console.log(this.selectedTraits, this.selectedSeasons);
  },
  async transfer(address, id) {
    try {
      let transfer = await this.fusionContract.methods
        .transferFrom(this.walletAddress, address, id)
        .send({ from: this.walletAddress });

      console.info(transfer);
    } catch (err) {
      console.error(err);
    }
  },
  async update() {
    try {
      let balance = await this.s01Contract.methods.balanceOf(this.walletAddress).call();

      this.myAvime = [];

      let traitHashes = await this.s01Contract.methods.getTraitHashes().call();
      let cardHash = await this.s01Contract.methods.getCardHash().call();
      let hashHex;
      let input_data;
      let params;
      let tx;
      let cardImg;
      let currentTable;

      let traitName = [];
      let traitDesc = [];
      let traitThumb = [];
      let traitMale = [];
      let traitFemale = [];

      for (let i = 0; i < 6; i++) {
        hashHex = web3.utils.numberToHex(traitHashes[i]);
        hashHex = web3.utils.padLeft(hashHex, 64);
        tx = await web3.eth.getTransaction(hashHex);

        input_data = '0x' + tx.input.slice(10);  // get only data without function selector
        params = web3.eth.abi.decodeParameters(['string[15]', 'string[15]', 'string[15]', 'string[15]', 'string[15]'], input_data);

        traitName.push(params[0]);
        traitDesc.push(params[1]);
        traitThumb.push(params[2]);
        traitMale.push(params[3]);
        traitFemale.push(params[4]);
      }

      hashHex = web3.utils.numberToHex(cardHash);
      hashHex = web3.utils.padLeft(hashHex, 64);
      tx = await web3.eth.getTransaction(hashHex);

      input_data = '0x' + tx.input.slice(10);  // get only data without function selector
      params = web3.eth.abi.decodeParameters(['string[6]', 'string[6]', 'string[6]', 'string[6]'], input_data);
      cardImg = params[3];

      for (let i = 0; i < balance; i++) {
        let currentAvime = await this.s01Contract.methods.tokenOfOwnerByIndex(this.walletAddress, i).call();
        let traitNumber = await this.s01Contract.methods.getTrait(currentAvime).call();

        this.myAvime.push(currentAvime);

        let traitType = parseInt(currentAvime) % 6;

        switch (traitType) {
          case 0:
            this.wardrobe.background.push({
              ID: currentAvime,
              type: parseInt(currentAvime) % 6,
              tnum: traitNumber,
              name: traitName[traitType][traitNumber],
              desc:  traitDesc[traitType][traitNumber],
              female: traitMale[traitType][traitNumber],
              male: traitMale[traitType][traitNumber],
              thumb: traitThumb[traitType][traitNumber],
              cardImg: cardImg[traitType],
            });

            break;
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            currentTable = 'body';

            if (parseInt(currentAvime) % 6 === 2) {
              currentTable = 'face';
            } else if (parseInt(currentAvime) % 6 === 3) {
              currentTable = 'clothes';
            } else if (parseInt(currentAvime) % 6 === 4) {
              currentTable = 'hair';
            } else if (parseInt(currentAvime) % 6 === 5) {
              currentTable = 'accessory';
            }

            this.wardrobe[currentTable].push({
              ID: currentAvime,
              type: parseInt(currentAvime) % 6,
              tnum: traitNumber,
              name: traitName[traitType][traitNumber],
              desc:  traitDesc[traitType][traitNumber],
              female: traitFemale[traitType][traitNumber],
              male: traitMale[traitType][traitNumber],
              thumb: traitThumb[traitType][traitNumber],
              cardImg: cardImg[traitType],
            });

            break;
        }
      }

      console.info(this.wardrobe);

      balance = await this.fusionContract.methods.balanceOf(this.walletAddress).call();

      for (let i = 0; i < balance; i++) {
        let currentAvimeId = await this.fusionContract.methods.tokenOfOwnerByIndex(this.walletAddress, i).call();
        let currentAvime = await this.fusionContract.methods.getAvime(currentAvimeId).call();

        console.log(currentAvime);
        console.log(i, balance);

        let avimeDom = "";

        avimeDom += '<td><div style="width:160px;"><div style="position:relative;">';

        for (let j = 0; j < 6; j++) {
          let seasonContractAddress = await this.fusionContract.methods.getAvimeContract(currentAvime.contractId[j]).call();
          let seasonContract = new web3.eth.Contract(this.s01Abi, seasonContractAddress);
          let currentTraitNumber = await seasonContract.methods.getTrait(currentAvime.traitId[j]).call();

          traitHashes = await seasonContract.methods.getTraitHashes().call();

          let traitName = [];
          let traitDesc = [];
          let traitThumb = [];
          let traitMale = [];
          let traitFemale = [];

          for (let k =0; k < 6; k++) {
            hashHex = web3.utils.numberToHex(traitHashes[k]);
            hashHex = web3.utils.padLeft(hashHex, 64);
            tx = await web3.eth.getTransaction(hashHex);

            input_data = '0x' + tx.input.slice(10);  // get only data without function selector
            params = web3.eth.abi.decodeParameters(['string[15]', 'string[15]', 'string[15]', 'string[15]', 'string[15]'], input_data);
            traitName.push(params[0]);
            traitDesc.push(params[1]);
            traitThumb.push(params[2]);
            traitMale.push(params[3]);
            traitFemale.push(params[4]);
          }

          input_data = '0x' + tx.input.slice(10);  // get only data without function selector

          if ((currentAvime.traitId[j]) % 6 === 0) {
            avimeDom += '<div style="position:absolute;">' + traitMale[(currentAvime.traitId[j]) % 6][currentTraitNumber] + "</div>" +
                        '<div style="position: absolute; top:-20px; left:50px;">ID:'+ currentAvimeId + '</div>';
          } else {
            avimeDom += '<div style="position:absolute;">' +  (currentAvime.sex == 1 ? traitMale[(currentAvime.traitId[j])%6][currentTraitNumber] : traitFemale[(currentAvime.traitId[j])%6][currentTraitNumber]) + "</div>";
          }
        }

        avimeDom += '</div></div></td>';

        console.log(avimeDom);
      }

      this.fusedAvime = balance;

      console.log('Fused Avime: ' + this.fusedAvime);
    } catch (err) {
      console.error(err);
    }
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
  let hljs = require('highlight.js');
  let hljsDefineSolidity = require('highlightjs-solidity');

  hljsDefineSolidity(hljs);
  hljs.initHighlightingOnLoad();

  setTimeout(window.Alpine.store('myAvime').checkWebAccount, 500);

  document.getElementById('eth-login').addEventListener('click', function () {
    try {
      ethereum.request({ method: 'eth_requestAccounts' });
    } catch (err) {
      this.innerHTML = 'Web3 Wallet Not Available';
    }

    window.Alpine.store('myAvime').checkWeb3();
  });
});
