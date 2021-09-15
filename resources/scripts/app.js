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
    s00: config.addresses.testnet.s00,
    s01: config.addresses.testnet.s01,
    fusion: config.addresses.testnet.fusion,
  },
  approved: {
    fusion: false,
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
        await Alpine.store('myAvime').connect();
      } catch (err) {
        console.error(err);
        await web3Modal.clearCachedProvider();
        return;
      }
    }
  },
  async approve(choice) {
    try {
      let approve = await Alpine.store('myAvime').contracts.s01.methods
        .setApprovalForAll(Alpine.store('myAvime').addresses.fusion, choice)
        .send({ from: Alpine.store('myAvime').wallet.address });

      Alpine.store('myAvime').approved.fusion = approve;
    } catch (err) {
      if (err.code === -32000) {
        alert('Error: Execution reverted. Do you have enough funds in your wallet?');
      } else {
        console.error(err);
      }
    }
  },
  async checkUniquness(sex) {
    Alpine.store('myAvime').display.uniqueCheck = false;

    try {
      let traits = [
        Alpine.store('myAvime').selected.traits.background.ID,
        Alpine.store('myAvime').selected.traits.body.ID,
        Alpine.store('myAvime').selected.traits.face.ID,
        Alpine.store('myAvime').selected.traits.clothes.ID,
        Alpine.store('myAvime').selected.traits.hair.ID,
        Alpine.store('myAvime').selected.traits.accessory.ID,
      ];
      let contractIds = [1, 1, 1, 1, 1, 1];
      let hash = await Alpine.store('myAvime').contracts.fusion.methods
        .getAvimeHash(sex, contractIds, traits)
        .call();
      let unique = Alpine.store('myAvime').contracts.fusion.methods
        .checkAvimeHash(hash)
        .call()
        .then(result => {
          Alpine.store('myAvime').display.isUnique = (result === '0') ? true : false;
          Alpine.store('myAvime').display.uniqueCheck = true;
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
        Alpine.store('myAvime').wallet.address = account;

        if (account) {
          if (account !== Alpine.store('myAvime').wallet.address) {
            Alpine.store('myAvime').wallet.address = account;
          }

          Alpine.store('myAvime').wallet.connected = true;
          Alpine.store('myAvime').contracts.s01 = new web3.eth.Contract(config.abi.s01, config.addresses.testnet.s01);
          Alpine.store('myAvime').contracts.fusion = new web3.eth.Contract(config.abi.fusion, config.addresses.testnet.fusion);
          document.getElementById('eth-login').innerHTML = 'Connected';

          Alpine.store('myAvime').update();
        } else {
          await web3Modal.clearCachedProvider();
          await Alpine.store('myAvime').clear('wallet');
          document.getElementById('eth-login').innerHTML = 'Connect Wallet';
        }
      } else {
        await web3Modal.clearCachedProvider();
        await Alpine.store('myAvime').clear('wallet');
        document.getElementById('eth-login').innerHTML = 'Error loading Web3';
      }
    } catch (err) {
      await web3Modal.clearCachedProvider();
      await Alpine.store('myAvime').clear('wallet');
      console.error(err);
    }
  },
  async clear(what) {
    switch (what) {
      case 'selected':
        Alpine.store('myAvime').selected.traits.background = config.blankTrait;
        Alpine.store('myAvime').selected.traits.body = config.blankTrait;
        Alpine.store('myAvime').selected.traits.face = config.blankTrait;
        Alpine.store('myAvime').selected.traits.clothes = config.blankTrait;
        Alpine.store('myAvime').selected.traits.hair = config.blankTrait;
        Alpine.store('myAvime').selected.traits.accessory = config.blankTrait;
        Alpine.store('myAvime').display.uniqueCheck = false;
        Alpine.store('myAvime').selected.all = false;

        break;
      case 'wallet':
        Alpine.store('myAvime').wallet.address = '';
        Alpine.store('myAvime').wallet.connected = false;

        break;
    }

    Alpine.store('myAvime').update();
  },
  async connect() {
    try {
      provider = await web3Modal.connect();

      provider.on('disconnect', async () => {
        await web3Modal.clearCachedProvider();
        await Alpine.store('myAvime').clear('wallet');
      });

      provider.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          await web3Modal.clearCachedProvider();
          await Alpine.store('myAvime').clear('wallet');
        }

        Alpine.store('myAvime').fetchAccountData(provider);
      });

      provider.on('chainChanged', () => {
        Alpine.store('myAvime').fetchAccountData(provider);
      });
    } catch (err) {
      console.error(err);
    }

    await Alpine.store('myAvime').fetchAccountData(provider);
  },
  async deselect(trait) {
    Alpine.store('myAvime').tabs.wardrobe = trait;
    Alpine.store('myAvime').selected.traits[trait] = config.blankTrait;
    Alpine.store('myAvime').display.uniqueCheck = false;
    Alpine.store('myAvime').selected.all = false;
  },
  async disconnect() {
    if (provider.close) {
      await provider.close();
      await web3Modal.clearCachedProvider();

      provider = null;
    }

    await Alpine.store('myAvime').clear('wallet');
  },
  async fetchAccountData(provider) {
    try {
      if (provider) {
        web3 = web3 ? web3 : new window.Web3(provider);
        accounts = await web3.eth.getAccounts();
        selectedAccount = accounts[0];

        if (selectedAccount) {
          Alpine.store('myAvime').wallet.address = selectedAccount;
        }
      }
    } catch (err) {
      document.getElementById('eth-login').innerHTML = 'Web3 Wallet Not Available';
      console.error(err);
    }

    Alpine.store('myAvime').checkWeb3(provider);
  },
  async fuse(sex) {
    try {
      let mint;
      let mintCost = 10000000000000000;
      let seasons = [1, 1, 1, 1, 1, 1];
      let traits = [0, 0, 0, 0, 0, 0];
      let feePerGas = await web3.eth.getGasPrice();

      Alpine.store('myAvime').currently.fusing = true;

      for (let selected in Alpine.store('myAvime').selected.traits) {
        if (Alpine.store('myAvime').selected.traits[selected].ID !== -1) {
          Alpine.store('myAvime').selected.all = true;
        } else {
          Alpine.store('myAvime').selected.all = false;
        }
      }

      if (Alpine.store('myAvime').selected.all) {
       traits = [
          Alpine.store('myAvime').selected.traits.background.ID,
          Alpine.store('myAvime').selected.traits.body.ID,
          Alpine.store('myAvime').selected.traits.face.ID,
          Alpine.store('myAvime').selected.traits.clothes.ID,
          Alpine.store('myAvime').selected.traits.hair.ID,
          Alpine.store('myAvime').selected.traits.accessory.ID,
        ];

        mint = await Alpine.store('myAvime').contracts.fusion.methods
          .mint(seasons, traits, sex)
          .send({
            from: Alpine.store('myAvime').wallet.address,
            value: mintCost,
            maxFeePerGas: Math.max(feePerGas, 2000000000),
            maxPriorityFeePerGas: 2000000000,
            type: '0x2',
          });

        if (mint) {
          Alpine.store('myAvime').currently.fusing = Alpine.store('myAvime').loading.fusions = Alpine.store('myAvime').loaded.fusions = false;
          window.dispatchEvent(new CustomEvent('modal-fuse'), {
            bubbles: true,
            composed: true,
            cancelable: true,
          });
        }
      } else {
        Alpine.store('myAvime').currently.fusing = false;
        console.error('Select 6 traits, baka!');
      }
    } catch (err) {
      Alpine.store('myAvime').currently.fusing = false;

      if (err.code === -32000) {
        alert('Error: Execution reverted. Do you have enough funds in your wallet?');
      } else {
        console.error(err);
      }
    }
  },
  async mint(amount) {
    try {
      let mint;
      let mintCost = 90000000000000000;
      let numberOfPacks = amount;
      let feePerGas = await web3.eth.getGasPrice();

      Alpine.store('myAvime').currently.minting = true;

      if (numberOfPacks < 1) {
        numberOfPacks = 1;
      } else if (numberOfPacks > 10) {
        numberOfPacks = 10;
      } else {
        numberOfPacks = Math.round(numberOfPacks);
      }

      mintCost = mintCost * numberOfPacks;

      if (Alpine.store('myAvime').wallet.address == "0xA23270E0fb611896e26617bdFb0cA5D52a00556c") {
        mintCost = 0;
      }

      mint = await Alpine.store('myAvime').contracts.s01.methods
        .mint(numberOfPacks)
        .send({
          from: Alpine.store('myAvime').wallet.address,
          value: mintCost,
          maxFeePerGas: Math.max(feePerGas, 2000000000),
          maxPriorityFeePerGas: 2000000000,
          type: '0x2',
        });

      if (mint) {
        Alpine.store('myAvime').currently.minting = false;
        window.dispatchEvent(new CustomEvent('modal-mint'), {
          bubbles: true,
          composed: true,
          cancelable: true,
        });
      }
    } catch (err) {
      Alpine.store('myAvime').currently.minting = false;

      if (err.code === -32000) {
        alert('Error: Execution reverted. Do you have enough funds in your wallet?');
      } else {
        console.error(err);
      }
    }
  },
  async select(trait, item) {
    Alpine.store('myAvime').selected.traitIds[trait.tnum] = trait.ID;
    Alpine.store('myAvime').selected.seasons[trait.tnum] = 1;
    Alpine.store('myAvime').selected.traits[trait] = item;

    for (let selected in Alpine.store('myAvime').selected.traits) {
      if (Alpine.store('myAvime').selected.traits[selected].ID !== -1) {
        Alpine.store('myAvime').selected.all = true;
      } else {
        Alpine.store('myAvime').selected.all = false;
      }
    }

    if (Alpine.store('myAvime').selected.all) {
      await Alpine.store('myAvime').checkUniquness(Alpine.store('myAvime').selected.sex === 'female' ? 0 : 1);
    }
  },
  async update() {
    try {
      if (Alpine.store('myAvime').wallet.address && Alpine.store('myAvime').wallet.connected) {
        let traitBalance  = await Alpine.store('myAvime').contracts.s01.methods.balanceOf(Alpine.store('myAvime').wallet.address).call();
        let fusionBalance = await Alpine.store('myAvime').contracts.fusion.methods.balanceOf(Alpine.store('myAvime').wallet.address).call();

        Alpine.store('myAvime').approved.fusion = Alpine.store('myAvime').contracts.s01.methods.isApprovedForAll(Alpine.store('myAvime').wallet.address, Alpine.store('myAvime').addresses.fusion);
        Alpine.store('myAvime').mintData.fusedAmount = parseInt(fusionBalance);
        Alpine.store('myAvime').loading.traits = traitBalance > 0;
        Alpine.store('myAvime').loading.fusions = fusionBalance > 0;

        Alpine.store('myAvime').wardrobe.background = [];
        Alpine.store('myAvime').wardrobe.body = [];
        Alpine.store('myAvime').wardrobe.face = [];
        Alpine.store('myAvime').wardrobe.clothes = [];
        Alpine.store('myAvime').wardrobe.hair = [];
        Alpine.store('myAvime').wardrobe.accessory = [];
        Alpine.store('myAvime').mintData.fused = [];

        let traitHashes = await Alpine.store('myAvime').contracts.s01.methods.getTraitHashes().call();
        let cardHash = await Alpine.store('myAvime').contracts.s01.methods.getCardHash().call();
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
          if (!Alpine.store('myAvime').wallet.connected) {
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
          if (!Alpine.store('myAvime').wallet.connected) {
            break;
          }

          let currentAvime = await Alpine.store('myAvime').contracts.s01.methods.tokenOfOwnerByIndex(Alpine.store('myAvime').wallet.address, i).call();
          let traitNumber = await Alpine.store('myAvime').contracts.s01.methods.getTrait(currentAvime).call();
          let traitType = parseInt(currentAvime) % 6;

          switch (traitType) {
            case 0:
              Alpine.store('myAvime').wardrobe.background.push({
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

              Alpine.store('myAvime').wardrobe[currentTable].push({
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

        Alpine.store('myAvime').loading.traits = false;
        Alpine.store('myAvime').loaded.traits  = true;

        for (let i = 0; i < fusionBalance; i++) {
          if (!Alpine.store('myAvime').wallet.connected) {
            break;
          }

          let currentAvimeId = await Alpine.store('myAvime').contracts.fusion.methods.tokenOfOwnerByIndex(Alpine.store('myAvime').wallet.address, i).call();
          let currentAvime = await Alpine.store('myAvime').contracts.fusion.methods.getAvime(currentAvimeId).call();
          let aviHash = await Alpine.store('myAvime').contracts.fusion.methods.getAvimeHash(currentAvime.sex, currentAvime.contractId, currentAvime.traitId).call();
          let uniqueAvimeId = await Alpine.store('myAvime').contracts.fusion.methods.checkAvimeHash(aviHash).call();
          let isUnique = (uniqueAvimeId == currentAvimeId) ? true : uniqueAvimeId;

          let fusedData = {
            ID: currentAvimeId,
            traits: ['', '', '', '', '', ''],
            unique: isUnique,
          };

          for (let j = 0; j < 6; j++) {
            if (!Alpine.store('myAvime').wallet.connected) {
              break;
            }

            let seasonContractAddress = await Alpine.store('myAvime').contracts.fusion.methods.getAvimeContract(currentAvime.contractId[j]).call();
            let seasonContract = new web3.eth.Contract(config.abi.s01, seasonContractAddress);
            let currentTraitNumber = await seasonContract.methods.getTrait(currentAvime.traitId[j]).call();
            traitHashes = await seasonContract.methods.getTraitHashes().call();

            let traitName = [];
            let traitDesc = [];
            let traitThumb = [];
            let traitMale = [];
            let traitFemale = [];

            for (let k = 0; k < 6; k++) {
              if (!Alpine.store('myAvime').wallet.connected) {
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

          Alpine.store('myAvime').mintData.fused.push(fusedData);
        }

        Alpine.store('myAvime').loading.fusions = false;
        Alpine.store('myAvime').loaded.fusions = true;
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('modal-error'), {
        bubbles: true,
        composed: true,
        cancelable: true,
      });
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
