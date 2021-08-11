export async function loadTrait() {
  document.getElementById('trait_table').empty();

  let currentId = this.getAttribute('data-id');
  let tx;
  let traitHash;
  let hashHex;
  let input_data;
  let params;

  if (currentId < 6) {
    traitHash = await window.Alpine.store('avime').s01Contract.methods.getTraitHashes().call();
    traitHash = traitHash[currentId];
  } else {
    traitHash = await window.Alpine.store('avime').s01Contract.methods.getCardHash().call();
  }

  console.log(traitHash);

  switch (currentId) {
    //0-5 load traits, 6 loads cards
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
      hashHex = window.web3.utils.numberToHex(traitHash);
      hashHex = window.web3.utils.padLeft(hashHex, 64);
      tx = await window.web3.eth.getTransaction(hashHex);

      input_data = '0x' + tx.input.slice(10);  // get only data without function selector
      params = window.web3.eth.abi.decodeParameters(['string[15]', 'string[15]', 'string[15]', 'string[15]', 'string[15]'], input_data);
      window.Alpine.store('avime').nameData = params[0];
      window.Alpine.store('avime').descData = params[1];
      window.Alpine.store('avime').thumbData = params[2];
      window.Alpine.store('avime').maleData = params[3];
      window.Alpine.store('avime').femaleData = params[4];

      document.getElementById('trait_table').empty();
      document.getElementById('trait_table').append('<tr style="border-bottom:1px solid black"> <td>Name</td> <td>Desc</td> <td>Thumb</td> <td>Male</td> <td>Female</td> </tr>');

      for (let i = 0; i < 15; i++) {
        document.getElementById('trait_table').append('<tr style="border-bottom:1px solid black"> <td>' + window.Alpine.store('avime').nameData[i] + '</td> <td>' + window.Alpine.store('avime').descData[i] + '</td> <td>' + window.Alpine.store('avime').yhumbData[i] + '</td> <td>' + window.Alpine.store('avime').maleData[i] + '</td> <td>' + window.Alpine.store('avime').femaleData[i] + '</td> </tr>');
      }

      break;
    case "6":
      hashHex = window.web3.utils.numberToHex(traitHash);
      hashHex = window.web3.utils.padLeft(hashHex, 64);
      tx = await window.web3.eth.getTransaction(hashHex);

      input_data = '0x' + tx.input.slice(10);  // get only data without function selector
      params = window.web3.eth.abi.decodeParameters(['string[6]', 'string[6]', 'string[6]', 'string[6]'], input_data);
      window.Alpine.store('avime').nameData = params[0];
      window.Alpine.store('avime').descData = params[1];
      window.Alpine.store('avime').thumbData = params[2];
      window.Alpine.store('avime').maleData = params[3];

      document.getElementById('trait_table').empty();
      document.getElementById('trait_table').append('<tr style="border-bottom:1px solid black"> <td>Name</td> <td>Desc</td> <td>Thumb</td> <td>Card</td>  </tr>');

      for (let i = 0; i < 6; i++) {
        document.getElementById('trait_table').append('<tr style="border-bottom:1px solid black"> <td>' + window.Alpine.store('avime').nameData[i] + '</td> <td>' + window.Alpine.store('avime').descData[i] + '</td> <td>' + window.Alpine.store('avime').thumbData[i] + '</td> <td>' + window.Alpine.store('avime').maleData[i] + '</td>  </tr>');
      }

      break;
  }
}
