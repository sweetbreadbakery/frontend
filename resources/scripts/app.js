import Alpine from 'alpinejs';
import { config } from './config';
import { faqs } from './util/faqs';
import { staff } from './util/staff';
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
  s01Abi: config.abi.s01,
  fusionAbi: config.abi.fusion,
  s00Address: config.addresses.s00,
  s00Contract: null,
  s01Address: config.addresses.s01,
  s01Contract: null,
  fusionAddress: config.addresses.fusion,
  fusionContract: null,
  walletAddress: '',
  walletConnected: false,
  staff: staff,
  faqs: faqs,
  approved: false,
  showUniqueCheck: false,
  isUnique: true,
  loading: {
    traits: false,
    fusions: false,
  },
  galleryTab: 'background',
  mintData: {
    s00: 0,
    s01: 8028,
    fusion: 104,
  },
  loaded: {
    traits: false,
    fusions: false,
  },
  allSelected: false,
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
  totalMinted: 0,
  totalFused: 0,
  wardrobe: {
    background: [],
    body: [],
    face: [],
    clothes: [],
    hair: [],
    accessory: [],
  },
  fusedAmount: 0,
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

      console.info(approve);
    } catch (err) {
      console.error(err);
    }
  },
  async checkUniquness(sex) {
    this.showUniqueCheck = false;

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
          this.showUniqueCheck = true;
        });

      console.info(unique);
    } catch (err) {
      console.error(err);
    }
  },
  async checkWeb3() {
    try {
      if (ethereum) {
        const currentAccounts = await web3.eth.getAccounts();
        const account = currentAccounts[0];

        document.getElementById('eth-login').innerHTML = 'Please check Web3 wallet';
        window.Alpine.store('myAvime').walletAddress = account;

        if (account) {
          window.Alpine.store('myAvime').walletConnected = true;
          window.Alpine.store('myAvime').s01Contract = new web3.eth.Contract(config.abi.s01, config.addresses.s01);
          window.Alpine.store('myAvime').fusionContract = new web3.eth.Contract(config.abi.fusion, config.addresses.fusion);
          window.Alpine.store('myAvime').update();
          document.getElementById('eth-login').innerHTML = 'Connect Wallet';
        } else {
          window.Alpine.store('myAvime').walletConnected = false;
          document.getElementById('eth-login').innerHTML = 'Connect Wallet';
        }
      } else {
        document.getElementById('eth-login').innerHTML = 'Error loading Web3';
      }
    } catch (err) {
      console.error(err);
    }
  },
  async checkWebAccount() {
    try {
      const currentAccounts = await web3.eth.getAccounts();
      const account = currentAccounts[0];

      if (account && account !== window.Alpine.store('myAvime').walletAddress) {
        window.Alpine.store('myAvime').walletAddress = account;
        window.Alpine.store('myAvime').checkWeb3();
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
    this.showUniqueCheck = false;
    this.allSelected = false;

    this.update();
  },
  async connect() {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      if (account) {
        window.Alpine.store('myAvime').walletAddress = account;
      }
    } catch (err) {
      document.getElementById('eth-login').innerHTML = 'Web3 Wallet Not Available';
      console.error(err);
    }

    window.Alpine.store('myAvime').checkWeb3();
  },
  async deselect(trait) {
    this.tab = trait;
    this.selected.traits[trait] = this.blankTrait;
    this.showUniqueCheck = false;
    this.allSelected = false;
  },
  async fuse(sex) {
    try {
      let mint;
      let mintCost = 10000000000000000;
      let seasons = [1, 1, 1, 1, 1, 1];
      let traits = [0, 0, 0, 0, 0, 0];
      let feePerGas = await web3.eth.getGasPrice();

      this.fusing = true;

      for (let selected in this.selected.traits) {
        if (this.selected.traits[selected].ID !== -1) {
          this.allSelected = true;
        } else {
          this.allSelected = false;
        }
      }

      if (this.allSelected) {
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
          .send({
            from: this.walletAddress,
            value: mintCost,
            maxFeePerGas: feePerGas,
            maxPriorityFeePerGas: 2000000000,
            type: '0x2',
          });

        if (mint) {
          this.fusing = this.loading.fusions = this.loaded.fusions = false;
          document.dispatchEvent(new CustomEvent('modal-fuse'));
        }
      } else {
        this.fusing = false;
        console.error('Select 6 traits, baka!');
      }
    } catch (err) {
      this.fusing = false;
      console.error(err);
    }
  },
  async init() {
    setTimeout(this.checkWebAccount, 500);
  },
  async mint(amount) {
    try {
      let mint;
      let mintCost = 90000000000000000;
      let numberOfPacks = amount;
      let feePerGas = await web3.eth.getGasPrice();

      this.minting = true;

      if (numberOfPacks < 1) {
        numberOfPacks = 1;
      } else if (numberOfPacks > 10) {
        numberOfPacks = 10;
      } else {
        numberOfPacks = Math.round(numberOfPacks);
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
          maxFeePerGas: feePerGas,
          maxPriorityFeePerGas: 2000000000,
          type: '0x2',
        });

      if (mint) {
        this.minting = false;
        document.dispatchEvent(new CustomEvent('modal-mint'));
      }
    } catch (err) {
      this.minting = false;
      console.error(err);
    }
  },
  round(number) {
    return Math.round(number * 100 + Number.EPSILON) / 100;
  },
  async select(trait, item) {
    this.selectedTraits[trait.tnum] = trait.ID;
    this.selectedSeasons[trait.tnum] = 1;
    this.selected.traits[trait] = item;

    for (let selected in this.selected.traits) {
      if (this.selected.traits[selected].ID !== -1) {
        this.allSelected = true;
      } else {
        this.allSelected = false;
      }
    }

    if (this.allSelected) {
      this.checkUniquness(this.sex === 'female' ? 0 : 1);
    }
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
      let traitBalance  = await this.s01Contract.methods.balanceOf(this.walletAddress).call();
      let fusionBalance = await this.fusionContract.methods.balanceOf(this.walletAddress).call();

      this.approved = this.s01Contract.methods.isApprovedForAll(this.walletAddress, this.fusionAddress);
      this.fusedAmount = parseInt(fusionBalance);
      this.loading.traits = traitBalance > 0;
      this.loading.fusions = fusionBalance > 0;

      this.wardrobe.background = [];
      this.wardrobe.body = [];
      this.wardrobe.face = [];
      this.wardrobe.clothes = [];
      this.wardrobe.hair = [];
      this.wardrobe.accessory = [];
      this.fused = [];

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

      for (let i = 0; i < traitBalance; i++) {
        let currentAvime = await this.s01Contract.methods.tokenOfOwnerByIndex(this.walletAddress, i).call();
        let traitNumber = await this.s01Contract.methods.getTrait(currentAvime).call();
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

      this.loading.traits = false;
      this.loaded.traits  = true;

      for (let i = 0; i < fusionBalance; i++) {
        let currentAvimeId = await this.fusionContract.methods.tokenOfOwnerByIndex(this.walletAddress, i).call();
        let currentAvime = await this.fusionContract.methods.getAvime(currentAvimeId).call();
        let aviHash = await this.fusionContract.methods.getAvimeHash(currentAvime.sex, currentAvime.contractId, currentAvime.traitId).call();
        let uniqueAvimeId = await this.fusionContract.methods.checkAvimeHash(aviHash).call();
        let isUnique = uniqueAvimeId==currentAvimeId ? true : uniqueAvimeId;

        let fusedData = {
          ID: currentAvimeId,
          traits: ['', '', '', '', '', ''],
          unique: isUnique,
        };

        for (let j = 0; j < 6; j++) {
          let seasonContractAddress = await this.fusionContract.methods.getAvimeContract(currentAvime.contractId[j]).call();
          let seasonContract = new web3.eth.Contract(config.abi.s01, seasonContractAddress);
          let currentTraitNumber = await seasonContract.methods.getTrait(currentAvime.traitId[j]).call();
          traitHashes = await seasonContract.methods.getTraitHashes().call();

          let traitName = [];
          let traitDesc = [];
          let traitThumb = [];
          let traitMale = [];
          let traitFemale = [];

          for (let k = 0; k < 6; k++) {
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

          if ((currentAvime.traitId[j]) % 6 == 0) {
            fusedData.traits[(currentAvime.traitId[j]) % 6] = traitMale[currentAvime.traitId[j] % 6][currentTraitNumber];
          } else {
            fusedData.traits[(currentAvime.traitId[j]) % 6] = (currentAvime.sex == 1 ? traitMale[(currentAvime.traitId[j])%6][currentTraitNumber] : traitFemale[(currentAvime.traitId[j])%6][currentTraitNumber]);
          }
        }

        this.fused.push(fusedData);
      }

      this.loading.fusions = false;
      this.loaded.fusions = true;
    } catch (err) {
      document.dispatchEvent(new CustomEvent('modal-error'));
      console.error(err);
    }
  },
});

Alpine.effect(() => {
  const mintAmount = Alpine.store('myAvime').mintAmount;

  if (mintAmount > 10) {
    Alpine.store('myAvime').mintAmount = 10;
  } else if (mintAmount < 0) {
    Alpine.store('myAvime').mintAmount = 1;
  }
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
  // If you await the return of the mint function, you will see that events->transfer has one transfer for each erc721 token.
  // mint.events.Transfer[index].returnValues[2] is where the tokenId is located
  // Iterate over index for i < (mintQuantity*6)

  ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      window.Alpine.store('myAvime').walletConnected = false;
    }
  });
});
