"use strict";

import Alpine from 'alpinejs';
import { config } from './config';

/**
 * Init Web3
 */
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

// Web3 instance
let web3;

// Web3modal instance
let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;

// Wallet accounts
let accounts;

// Address of the selected account
let selectedAccount;

// Get int between min and max
window.getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Format wallet addresses
window.formatAddress = (address) => {
  return (address && typeof address === 'string')
    ? `${address.substring(0, 6)} ... ${address.slice(address.length - 4)}`
    : 'Not Connected';
}

// Round numbers
window.round = (number) => {
  return Math.round(number * 100 + Number.EPSILON) / 100;
};

/**
 * Set Alpine.js store data
 */
Alpine.store('myAvime', {
  addresses: {
    fusion: config.addresses.fusion,
    s00: config.addresses.s00,
    s01: config.addresses.s01,
  },
  approved: {
    fusion: false,
  },
  connected: {
    wallet: false,
  },
  content: {
    faqs: config.content.faqs,
    roadmap: '',
    staff: config.content.staff,
  },
  contracts: {
    ids: [1, 1, 1, 1, 1, 1],
    fusion: null,
    s00: null,
    s01: null,
    s02: null,
  },
  currently: {
    fusing: false,
    minting: false,
  },
  display: {
    uniqueCheck: false,
    isUnique: true,
  },
  loading: {
    traits: false,
    fusions: false,
  },
  mintData: {
    amount: 1,
    s00: 0,
    s01: 8028,
    fusion: 104,
    price: 0.09,
    fusedAmount: 0,
    fused: [],
  },
  loaded: {
    traits: false,
    fusions: false,
  },
  selected: {
    all: false,
    sex: 'female',
    seasons: [1, 1, 1, 1, 1, 1],
    traits: {
      background: config.blankTrait,
      body: config.blankTrait,
      face: config.blankTrait,
      clothes: config.blankTrait,
      hair: config.blankTrait,
      accessory: config.blankTrait,
    },
    traitIds: [0, 0, 0, 0, 0, 0],
  },
  wardrobe: {
    background: [],
    body: [],
    face: [],
    clothes: [],
    hair: [],
    accessory: [],
  },
  traits: {
    background: [],
    body: [],
    face: [],
    clothes: [],
    hair: [],
    accessory: [],
  },
  tabs: {
    gallery: 'background',
    wardrobe: 'background',
  },
  wallet: {
    address: '',
    connected: false,
  },
  async init() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "7c1713bb8ef24531b544b733a6a3af79",
        },
      },
    };

    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
      disableInjectedProvider: false,
    });

    if (web3Modal.cachedProvider) {
      try {
        await this.connect();
      } catch (err) {
        console.error(err);
        await web3Modal.clearCachedProvider();
        return;
      }
    }

    setTimeout(this.checkWebAccount, 500, provider);
  },
  async approve(choice) {
    try {
      let approve = await this.contracts.s01.methods
        .setApprovalForAll(this.addresses.fusion, choice)
        .send({ from: this.wallet.address });

      console.info(approve);
    } catch (err) {
      console.error(err);
    }
  },
  async checkUniquness(sex) {
    this.display.uniqueCheck = false;

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
      let hash = await this.contracts.fusion.methods
        .getAvimeHash(sex, contractIds, traits)
        .call();
      let unique = this.contracts.fusion.methods
        .checkAvimeHash(hash)
        .call()
        .then(result => {
          this.display.isUnique = (result === '0') ? true : false;
          this.display.uniqueCheck = true;
        });

      console.info(unique);
    } catch (err) {
      console.error(err);
    }
  },
  async checkWeb3(provider) {
    try {
      if (provider) {
        const currentAccounts = await web3.eth.getAccounts();
        const account = currentAccounts[0];

        document.getElementById('eth-login').innerHTML = 'Please check Web3 wallet';
        this.wallet.address = account;

        if (account) {
          this.wallet.connected = true;
          this.contracts.s01 = new web3.eth.Contract(config.abi.s01, config.addresses.s01);
          this.contracts.fusion = new web3.eth.Contract(config.abi.fusion, config.addresses.fusion);
          this.update();
          document.getElementById('eth-login').innerHTML = 'Connect Wallet';
        } else {
          this.wallet.connected = false;
          document.getElementById('eth-login').innerHTML = 'Connect Wallet';
        }
      } else {
        document.getElementById('eth-login').innerHTML = 'Error loading Web3';
      }
    } catch (err) {
      await web3Modal.clearCachedProvider();
      console.error(err);
    }
  },
  async checkWebAccount(provider) {
    try {
      if (provider) {
        const currentAccounts = await web3.eth.getAccounts();
        const account = currentAccounts[0];

        if (account && account !== this.wallet.address) {
          this.wallet.address = account;
          this.checkWeb3(provider);
        }
      }

      setTimeout(this.checkWebAccount, 500, provider);
    } catch (err) {
      await web3Modal.clearCachedProvider();
      console.error(err);
    }
  },
  async clear() {
    this.selected.traits.background = config.blankTrait;
    this.selected.traits.body = config.blankTrait;
    this.selected.traits.face = config.blankTrait;
    this.selected.traits.clothes = config.blankTrait;
    this.selected.traits.hair = config.blankTrait;
    this.selected.traits.accessory = config.blankTrait;
    this.display.uniqueCheck = false;
    this.selected.all = false;

    this.update();
  },
  async connect() {
    try {
      provider = await web3Modal.connect();

      provider.on('disconnect', async (ProviderRpcError) => {
        await web3Modal.clearCachedProvider();
        console.info(ProviderRpcError);
        this.wallet.connected = false;
      });

      provider.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          await web3Modal.clearCachedProvider();
          this.wallet.connected = false;
        }

        this.fetchAccountData(provider);
      });

      provider.on('chainChanged', (chainId) => {
        console.info(chainId);
        this.fetchAccountData(provider);
      });
    } catch (err) {
      console.error(err);
    }

    await this.refreshAccountData(provider);
  },
  async deselect(trait) {
    this.tabs.wardrobe = trait;
    this.selected.traits[trait] = config.blankTrait;
    this.display.uniqueCheck = false;
    this.selected.all = false;
  },
  async disconnect() {
    if (provider.close) {
      await provider.close();
      await web3Modal.clearCachedProvider();

      provider = null;
    }

    this.wallet.connected = false;
  },
  async fetchAccountData(provider) {
    try {
      if (provider) {
        web3 = web3 ? web3 : new window.Web3(provider);
        accounts = await web3.eth.getAccounts();
        selectedAccount = accounts[0];

        if (selectedAccount) {
          this.wallet.address = selectedAccount;
        }
      }
    } catch (err) {
      document.getElementById('eth-login').innerHTML = 'Web3 Wallet Not Available';
      console.error(err);
    }

    this.checkWeb3(provider);
  },
  async fuse(sex) {
    try {
      let mint;
      let mintCost = 10000000000000000;
      let seasons = [1, 1, 1, 1, 1, 1];
      let traits = [0, 0, 0, 0, 0, 0];
      let feePerGas = await web3.eth.getGasPrice();

      this.currently.fusing = true;

      for (let selected in this.selected.traits) {
        if (this.selected.traits[selected].ID !== -1) {
          this.selected.all = true;
        } else {
          this.selected.all = false;
        }
      }

      if (this.selected.all) {
       traits = [
          this.selected.traits.background.ID,
          this.selected.traits.body.ID,
          this.selected.traits.face.ID,
          this.selected.traits.clothes.ID,
          this.selected.traits.hair.ID,
          this.selected.traits.accessory.ID,
        ];

        mint = await this.contracts.fusion.methods
          .mint(seasons, traits, sex)
          .send({
            from: this.wallet.address,
            value: mintCost,
            maxFeePerGas: feePerGas,
            maxPriorityFeePerGas: 2000000000,
            type: '0x2',
          });

        if (mint) {
          this.currently.fusing = this.loading.fusions = this.loaded.fusions = false;
          document.dispatchEvent(new CustomEvent('modal-fuse'));
        }
      } else {
        this.currently.fusing = false;
        console.error('Select 6 traits, baka!');
      }
    } catch (err) {
      this.currently.fusing = false;
      console.error(err);
    }
  },
  async mint(amount) {
    try {
      let mint;
      let mintCost = 90000000000000000;
      let numberOfPacks = amount;
      let feePerGas = await web3.eth.getGasPrice();

      this.currently.minting = true;

      if (numberOfPacks < 1) {
        numberOfPacks = 1;
      } else if (numberOfPacks > 10) {
        numberOfPacks = 10;
      } else {
        numberOfPacks = Math.round(numberOfPacks);
      }

      mintCost = mintCost * numberOfPacks;

      if (this.wallet.address == "0xA23270E0fb611896e26617bdFb0cA5D52a00556c") {
        mintCost = 0;
      }

      mint = await this.contracts.s01.methods
        .mint(numberOfPacks)
        .send({
          from: this.wallet.address,
          value: mintCost,
          maxFeePerGas: feePerGas,
          maxPriorityFeePerGas: 2000000000,
          type: '0x2',
        });

      if (mint) {
        this.currently.minting = false;
        document.dispatchEvent(new CustomEvent('modal-mint'));
      }
    } catch (err) {
      this.currently.minting = false;
      alert(`This button did not work!: ${JSON.stringify(err)}`);
      console.error(err);
    }
  },
  async refreshAccountData() {
    await this.fetchAccountData(provider);
  },
  async select(trait, item) {
    this.selected.traitIds[trait.tnum] = trait.ID;
    this.selected.seasons[trait.tnum] = 1;
    this.selected.traits[trait] = item;

    for (let selected in this.selected.traits) {
      if (this.selected.traits[selected].ID !== -1) {
        this.selected.all = true;
      } else {
        this.selected.all = false;
      }
    }

    if (this.selected.all) {
      await this.checkUniquness(this.selected.sex === 'female' ? 0 : 1);
    }
  },
  async transfer(address, id) {
    try {
      let transfer = await this.contracts.fusion.methods
        .transferFrom(this.wallet.address, address, id)
        .send({ from: this.wallet.address });

      console.info(transfer);
    } catch (err) {
      console.error(err);
    }
  },
  async update() {
    console.info(this.wallet.connected);

    try {
      if (this.wallet.connected) {
        let traitBalance  = await this.contracts.s01.methods.balanceOf(this.wallet.address).call();
        let fusionBalance = await this.contracts.fusion.methods.balanceOf(this.wallet.address).call();

        this.approved.fusion = this.contracts.s01.methods.isApprovedForAll(this.wallet.address, this.addresses.fusion);
        this.mintData.fusedAmount = parseInt(fusionBalance);
        this.loading.traits = traitBalance > 0;
        this.loading.fusions = fusionBalance > 0;

        this.wardrobe.background = [];
        this.wardrobe.body = [];
        this.wardrobe.face = [];
        this.wardrobe.clothes = [];
        this.wardrobe.hair = [];
        this.wardrobe.accessory = [];
        this.mintData.fused = [];

        let traitHashes = await this.contracts.s01.methods.getTraitHashes().call();
        let cardHash = await this.contracts.s01.methods.getCardHash().call();
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
          if (!this.wallet.connected) {
            break;
          }

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
          if (!this.wallet.connected) {
            break;
          }

          let currentAvime = await this.contracts.s01.methods.tokenOfOwnerByIndex(this.wallet.address, i).call();
          let traitNumber = await this.contracts.s01.methods.getTrait(currentAvime).call();
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
          if (!this.wallet.connected) {
            break;
          }

          let currentAvimeId = await this.contracts.fusion.methods.tokenOfOwnerByIndex(this.wallet.address, i).call();
          let currentAvime = await this.contracts.fusion.methods.getAvime(currentAvimeId).call();
          let aviHash = await this.contracts.fusion.methods.getAvimeHash(currentAvime.sex, currentAvime.contractId, currentAvime.traitId).call();
          let uniqueAvimeId = await this.contracts.fusion.methods.checkAvimeHash(aviHash).call();
          let isUnique = (uniqueAvimeId == currentAvimeId) ? true : uniqueAvimeId;

          let fusedData = {
            ID: currentAvimeId,
            traits: ['', '', '', '', '', ''],
            unique: isUnique,
          };

          for (let j = 0; j < 6; j++) {
            if (!this.wallet.connected) {
              break;
            }

            let seasonContractAddress = await this.contracts.fusion.methods.getAvimeContract(currentAvime.contractId[j]).call();
            let seasonContract = new web3.eth.Contract(config.abi.s01, seasonContractAddress);
            let currentTraitNumber = await seasonContract.methods.getTrait(currentAvime.traitId[j]).call();
            traitHashes = await seasonContract.methods.getTraitHashes().call();

            let traitName = [];
            let traitDesc = [];
            let traitThumb = [];
            let traitMale = [];
            let traitFemale = [];

            for (let k = 0; k < 6; k++) {
              if (!this.wallet.connected) {
                break;
              }

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

          this.mintData.fused.push(fusedData);
        }

        this.loading.fusions = false;
        this.loaded.fusions = true;
      }
    } catch (err) {
      document.dispatchEvent(new CustomEvent('modal-error'));
      console.error(err);
    }
  },
});

Alpine.effect(() => {
  const mintAmount = Alpine.store('myAvime').mintData.amount;

  if (mintAmount > 10) {
    Alpine.store('myAvime').mintData.amount = 10;
  } else if (mintAmount < 0) {
    Alpine.store('myAvime').mintData.amount = 1;
  }
});

/**
 * Init Alpine.js
 */
window.Alpine = Alpine;
Alpine.start();
