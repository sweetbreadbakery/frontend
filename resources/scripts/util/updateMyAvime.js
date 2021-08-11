export async function updateMyAvime(ethereum, web3) {
  let tx;

  try {
    let balance = await window.Alpine.store('avime').s01Contract.methods
      .balanceOf(window.Alpine.store('avime').walletAddress)
      .call();

    document.getElementById("trait_table_background").innerHTML = null;
    document.getElementById("trait_table_body").innerHTML = null;
    document.getElementById("trait_table_face").innerHTML = null;
    document.getElementById("trait_table_hair").innerHTML = null;
    document.getElementById("trait_table_clothes").innerHTML = null;
    document.getElementById("trait_table_accessory").innerHTML = null;


    let traitHashes = await window.Alpine.store('avime').s01Contract.methods.getTraitHashes().call();
    let cardHash = await window.Alpine.store('avime').s01Contract.methods.getCardHash().call();
    let hashHex;
    let input_data;
    let params;
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

    let cardName = params[0];
    let cardDesc = params[1];
    let cardThumb = params[2];
    let cardImg = params[3];

    for (let i = 0; i < balance; i++) {
      let currentAvime = await window.Alpine.store('avime').s01Contract.methods.tokenOfOwnerByIndex(window.Alpine.store('avime').walletAddress, i).call();
      let traitNumber = await window.Alpine.store('avime').s01Contract.methods.getTrait(currentAvime).call();

      window.Alpine.store('avime').myAvime.push(currentAvime);

      document.getElementById('trait_table_background').append('<tr style="border-bottom:1px solid black">');
      let traitType = parseInt(currentAvime) % 6;

      switch (traitType) {
        case 0:
          document.getElementById('trait_table_background').append(`
            <td>
              <div style="position: relative;font-size: 10px;">
                ${cardImg[traitType]}
                <div style="position: absolute; top:76px; left:100px;">${traitMale[traitType][traitNumber]}</div>
                <div style="position: absolute; top:20px; left:30px;">${traitName[traitType][traitNumber]}</div>
                <div style="position: absolute; top:20px; left:300px;">${traitThumb[traitType][traitNumber]}</div>
                <div style="position: absolute; top:20px; left:200px;">ID:${currentAvime}</div>
                <div style="position: absolute; top:40px; left:200px;">Tnum:${traitNumber}</div>
                <div style="position: absolute; top:250px; left:30px;width: 300px;">${traitDesc[traitType][traitNumber]}</div>
                <button data-trait-type="${parseInt(currentAvime) % 6}" data-trait-id="${currentAvime}" style="position: absolute; top:310px; left:135px;" type="button" class="select_trait">Select</button>
              </div>
            </td>
          `);
          document.getElementById('trait_table_background').append('</tr>');
          break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          currentTable = "trait_table_body";

          if (parseInt(currentAvime) % 6 == 2)
            currentTable = "#trait_table_face";
          else if (parseInt(currentAvime) % 6 == 3)
            currentTable = "#trait_table_clothes";
          else if (parseInt(currentAvime) % 6 == 4)
            currentTable = "#trait_table_hair";
          else if (parseInt(currentAvime) % 6 == 5)
            currentTable = "#trait_table_accessory";

          document.getElementById(currentTable).append('<td>' +
            '<div style="position: relative;font-size: 10px;">' + cardImg[traitType] +
            '<div style="position: absolute; top:76px; left:20px;">' + traitFemale[traitType][traitNumber] + '</div>' +
            '<div style="position: absolute; top:76px; left:180px;">' + traitMale[traitType][traitNumber] + '</div>' +
            '<div style="position: absolute; top:20px; left:30px;">' + traitName[traitType][traitNumber] + '</div>' +
            '<div style="position: absolute; top:20px; left:300px;">' + traitThumb[traitType][traitNumber] + '</div>' +
            '<div style="position: absolute; top:20px; left:200px;">ID:' + currentAvime + '</div>' +
            '<div style="position: absolute; top:40px; left:200px;">Tnum:' + traitNumber + '</div>' +
            '<div style="position: absolute; top:250px; left:30px;width: 300px;">' + traitDesc[traitType][traitNumber] + '</div>' +
            '<button traitType="' + parseInt(currentAvime) % 6 + '" traitId="' + currentAvime + '" style="position: absolute; top:310px; left:135px;" type="button" class="nes-btn select_trait">Select</button>' +
            '</div>' +
            '</td>');
          document.getElementById(currentTable).append('</tr>');
          break;
      }

      console.info(currentAvime + "\t" + parseInt(currentAvime) % 6 + "\t" + traitNumber);
    }

    balance = await window.Alpine.store('avime').fusionContract.methods.balanceOf(window.Alpine.store('avime').walletAddress).call();
    document.getElementById("fused_avime_table").innerHTML = null;

    for (var i = 0; i < balance; i++) {
      let currentAvimeId = await window.Alpine.store('avime').fusionContract.methods.tokenOfOwnerByIndex(window.Alpine.store('avime').walletAddress, i).call();
      let currentAvime = await window.Alpine.store('avime').fusionContract.methods.getAvime(currentAvimeId).call();
      console.info(currentAvime);
      console.info(i, balance);
      let avimeDom = "";
      avimeDom += '<td><div style="width:160px;"><div style="position:relative;">';

      for (var j = 0; j < 6; j++) {
        let seasonContractAddress = await window.Alpine.store('avime').fusionContract.methods.getAvimeContract(currentAvime.contractId[j]).call();
        let seasonContract = new web3.eth.Contract(window.Alpine.store('avime').s01Abi, seasonContractAddress);
        let currentTraitNumber = await seasonContract.methods.getTrait(currentAvime.traitId[j]).call();
        traitHashes = await seasonContract.methods.getTraitHashes().call();

        let traitName = [];
        let traitDesc = [];
        let traitThumb = [];
        let traitMale = [];
        let traitFemale = [];

        for (var k = 0; k < 6; k++) {
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
          avimeDom += '<div style="position:absolute;">' + traitMale[(currentAvime.traitId[j]) % 6][currentTraitNumber] + "</div>";
        }
        else {
          avimeDom += '<div style="position:absolute;">' + (currentAvime.sex == 1 ? traitMale[(currentAvime.traitId[j]) % 6][currentTraitNumber] : traitFemale[(currentAvime.traitId[j]) % 6][currentTraitNumber]) + "</div>";
        }
      }

      avimeDom += '</div></div></td>';
      document.getElementById('fused_avime_table').append(avimeDom);
    }

    console.info("Fused Avime: " + balance);
  } catch (err) {
    console.error(err);
  }
}
