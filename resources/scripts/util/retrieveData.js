export async function retrieveData(season, web3) {
  try {
    let traitHashes;
    let cardHash;
    let hashHex;
    let input_data;
    let params;
    let tx;
    let seasonData = {
      traitName: [],
      traitDesc: [],
      traitThumb: [],
      traitMale: [],
      traitFemale: [],
      traitHashes: [],
      cardName: [],
      cardDesc: [],
      cardThumb: [],
      cardData: [],
    };

    switch (season) {
      case 0:
        traitHashes = await window.Alpine.store('avime').s00Contract.methods.getTraitHashes().call();
        cardHash = await window.Alpine.store('avime').s00Contract.methods.getCardHash().call();
        break;
      default:
        traitHashes = await window.Alpine.store('avime').s01Contract.methods.getTraitHashes().call();
        cardHash = await window.Alpine.store('avime').s01Contract.methods.getCardHash().call();

    }

    seasonData.traitHashes = traitHashes;

    for (let i = 0; i < 6; i++) {
      console.info(`Loading trait ${i}`);

      hashHex = web3.utils.numberToHex(traitHashes[i]);
      hashHex = web3.utils.padLeft(hashHex, 64);
      tx = await web3.eth.getTransaction(hashHex);
      input_data = '0x' + tx.input.slice(10);  // get only data without function selector
      params = web3.eth.abi.decodeParameters(['string[15]', 'string[15]', 'string[15]', 'string[15]', 'string[15]'], input_data);

      seasonData.traitName.push(params[0]);
      seasonData.traitDesc.push(params[1]);
      seasonData.traitThumb.push(params[2]);
      seasonData.traitMale.push(params[3]);
      seasonData.traitFemale.push(params[4]);
    }

    hashHex = web3.utils.numberToHex(cardHash);
    hashHex = web3.utils.padLeft(hashHex, 64);
    tx = await web3.eth.getTransaction(hashHex);

    input_data = '0x' + tx.input.slice(10);  // get only data without function selector
    params = web3.eth.abi.decodeParameters(['string[6]', 'string[6]', 'string[6]', 'string[6]'], input_data);

    seasonData.cardName = params[0];
    seasonData.cardDesc = params[1];
    seasonData.cardThumb = params[2];
    seasonData.cardImg = params[3];

    return seasonData;
  } catch (err) {
    console.error(err.message);
  }
}
