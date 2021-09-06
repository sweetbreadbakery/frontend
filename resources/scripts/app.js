import Alpine from 'alpinejs';
import { config } from './config';
import { faqs } from './util/faqs';
import { staff } from './util/staff';
import { s01Abi } from './util/s01Abi';
import { fusionAbi } from './util/fusionAbi';
import { blankTrait } from './util/blankTrait';

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
  s00Address: "0x10fE2787a8a8d191fB4389A71083Fc0CC2dC1E35",
  s00Contract: null,
  s01Address: "0x6CD79b5fe03cf8Cb462fC8fA0914EBCfe5DD4C5f",
  s01Contract: new web3.eth.Contract(s01Abi, "0x6CD79b5fe03cf8Cb462fC8fA0914EBCfe5DD4C5f"),
  fusionAddress: "0xd92Cc219AcF2199DeadAC2b965B35B9e84FA7F0A",
  fusionContract: new web3.eth.Contract(fusionAbi, "0xd92Cc219AcF2199DeadAC2b965B35B9e84FA7F0A"),
  walletAddress: '',
  walletConnected: false,
  staff: staff,
  faqs: faqs,
  fusedAvime: 0,
  approved: false,
  myAvime: [],
  isUnique: true,
  selected: {
    sex: 'female',
    traits: {
      background: blankTrait,
      body: blankTrait,
      face: blankTrait,
      clothes: blankTrait,
      hair: blankTrait,
      accessory: blankTrait,
    },
  },
  minting: false,
  fusing: false,
  mintPrice: 0.09,
  mintAmount: 1,
  blankTrait: blankTrait,
  wardrobe: {
    background: [],
    body: [],
    face: [],
    clothes: [],
    hair: [],
    accessory: [],
  },
  fused: [],
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
  selectedSeasons: [1, 1, 1, 1, 1, 1],
  selectedTraits: [0, 0, 0, 0, 0, 0],
  contractIds: [1, 1, 1, 1, 1, 1],
  tab: 'background',
  async approve(choice) {
    try {
      let approve = await this.s01Contract.methods
        .setApprovalForAll(this.fusionAddress, choice)
        .send({ from: this.walletAddress });

      console.log(approve);
    } catch (err) {
      console.error(err);
    }
  },
  async checkUniquness(sex) {
    try {
      let traits = [
        this.selected.traits.background.ID,
        this.selected.traits.body.ID,
        this.selected.traits.face.ID,
        this.selected.traits.clothes.ID,
        this.selected.traits.hair.ID,
        this.selected.traits.accessory.ID,
      ];
      let contractIds = [1, 1, 1, 1, 1, 1];
      let hash = await this.fusionContract.methods
        .getAvimeHash(sex, contractIds, traits)
        .call();
      let unique = this.fusionContract.methods
        .checkAvimeHash(hash)
        .call()
        .then(result => {
          this.isUnique = (result === '0') ? true : false;
        });
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

      if (account !== window.Alpine.store('myAvime').walletAddress) {
        window.Alpine.store('myAvime').walletAddress = account;
        window.Alpine.store('myAvime').checkWeb3();
        window.Alpine.store('myAvime').update();
      }

      setTimeout(this.checkWebAccount, 500);
    } catch (err) {
      console.error(err);
    }
  },
  async clear() {
    this.selected.traits.background = blankTrait;
    this.selected.traits.body = blankTrait;
    this.selected.traits.face = blankTrait;
    this.selected.traits.clothes = blankTrait;
    this.selected.traits.hair = blankTrait;
    this.selected.traits.accessory = blankTrait;
  },
  async connect() {
    try {
      ethereum.request({ method: 'eth_requestAccounts' });
    } catch (err) {
      this.innerHTML = 'Web3 Wallet Not Available';
    }

    window.Alpine.store('myAvime').checkWeb3();
  },
  async deselect(type) {
    this.selectedTraits[type] = 0;
    this.selectedSeasons[type] = -1;
  },
  async fuse(sex, $dispatch) {
    try {
      this.fusing = true;

      let mint;
      let mintCost = 10000000000000000;
      let allSelected = false;
      let seasons = [1, 1, 1, 1, 1, 1];
      let traits = [0, 0, 0, 0, 0, 0];

      for (let selected in this.selected.traits) {
        if (this.selected.traits[selected].ID !== -1) {
          allSelected = true;
        } else {
          allSelected = false;
        }
      }

      if (allSelected) {
       traits = [
          this.selected.traits.background.ID,
          this.selected.traits.body.ID,
          this.selected.traits.face.ID,
          this.selected.traits.clothes.ID,
          this.selected.traits.hair.ID,
          this.selected.traits.accessory.ID,
        ];

        mint = await this.fusionContract.methods
          .mint(seasons, traits, sex)
          .send({ from: this.walletAddress, value: mintCost });

        if (mint) {
          this.fusing = false;
          $dispatch('modal-fuse');
        }

        this.update();
      } else {
        this.fusing = false;
        console.error('Select 6 traits, baka!');
      }
    } catch (err) {
      this.fusing = false;
      console.error(err);
    }
  },
  async mint(amount, $dispatch) {
    try {
      this.minting = true;

      let mint;
      let mintCost = 90000000000000000;
      let numberOfPacks = amount;

      if (numberOfPacks > 10) {
        numberOfPacks = 10;
      } else if (numberOfPacks < 1) {
        numberOfPacks = 1;
      }

      mintCost = mintCost * numberOfPacks;

      if (this.walletAddress == "0xA23270E0fb611896e26617bdFb0cA5D52a00556c") {
        mintCost = 0;
      }

      mint = await this.s01Contract.methods
        .mint(numberOfPacks)
        .send({
          from: this.walletAddress,
          value: mintCost,
        });

      if (mint) {
        this.minting = false;
        $dispatch('modal-mint');
      }

      this.update();
    } catch (err) {
      this.minting = false;
      console.error(err);
    }
  },
  round(number) {
    return Math.round(number * 100 + Number.EPSILON) / 100;
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
      this.approved = this.s01Contract.methods.isApprovedForAll(this.walletAddress, this.fusionAddress);

      this.wardrobe.background = [];
      this.wardrobe.body = [];
      this.wardrobe.face = [];
      this.wardrobe.clothes = [];
      this.wardrobe.hair = [];
      this.wardrobe.accessory = [];

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
              ID: parseInt(currentAvime),
              type: parseInt(currentAvime) % 6,
              tnum: parseInt(traitNumber),
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
              ID:  parseInt(currentAvime),
              type: parseInt(currentAvime) % 6,
              tnum:  parseInt(traitNumber),
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

      balance = await this.fusionContract.methods.balanceOf(this.walletAddress).call();
      this.fusedAvime = balance;

      for (let i = 0; i < balance; i++) {
        let currentAvimeId = await this.fusionContract.methods.tokenOfOwnerByIndex(this.walletAddress, i).call();
        let currentAvime = await this.fusionContract.methods.getAvime(currentAvimeId).call();

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
            this.fused.push({
              ID: currentAvimeId,
              something: traitMale[(currentAvime.traitId[j]) % 6][currentTraitNumber],
            });
          } else {
            this.fused.push({
              ID: currentAvimeId,
              something: (currentAvime.sex == 1 ? traitMale[(currentAvime.traitId[j])%6][currentTraitNumber] : traitFemale[(currentAvime.traitId[j])%6][currentTraitNumber]),
            });
          }
        }
      }
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
  hljs.highlightAll();

  setTimeout(window.Alpine.store('myAvime').checkWebAccount, 500);

  // let aviHash = await fusionContract.methods.getAvimeHash(currentAvime.sex, currentAvime.contractId, currentAvime.traitId).call();
  // let uniqueAvimeId = await fusionContract.methods.checkAvimeHash(aviHash).call();
  // let isUnique = uniqueAvimeId==currentAvimeId ? "Unique" : "Dupe #" + uniqueAvimeId;


  document.getElementById('eth-login').addEventListener('click', function () {
    try {
      ethereum.request({ method: 'eth_requestAccounts' });
    } catch (err) {
      this.innerHTML = 'Web3 Wallet Not Available';
    }

    window.Alpine.store('myAvime').checkWeb3();
  });
});
