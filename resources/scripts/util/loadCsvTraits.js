export function loadCsvTraits() {
  var csvString = document.getElementById('csv-data').value;
  var csvData = window.Papa.parse(csvString);

  document.getElementById('trait_title').innerHTML("Load " +  window.Alpine.store('avime')[this.getAttribute('data-id')] + "  -  traitNum:" + this.getAttribute('data-id'));

  window.Alpine.store('avime').currentTraitNum = parseInt(this.getAttribute('data-id'));

  document.getElementById('trait_table').empty();
  document.getElementById('trait_table').append(`
    <tr style="border-bottom:1px solid black">
      <td>Name</td>
      <td>Desc</td>
      <td>Thumb</td>
      <td>Male</td>
      <td>Female</td>
    </tr>
  `);

  for (var i = 0; i < 15; i++) {
    window.Alpine.store('avime').nameData.push(csvData.data[i + 1][1]);
    window.Alpine.store('avime').descData.push(csvData.data[i + 1][2]);
    window.Alpine.store('avime').thumbData.push(`<img src="${csvData.data[i + 1][3]}">`);
    window.Alpine.store('avime').maleData.push(`<img src="${csvData.data[i + 1][4]}">`);
    window.Alpine.store('avime').femaleData.push(csvData.data[i + 1][5] ? `<img src="${csvData.data[i + 1][5]}">` : '');

    document.getElementById('trait_table').append(`
      <tr style="border-bottom: 1px solid black;">
        <td>${window.Alpine.store('avime').nameData[i]}</td>
        <td>${window.Alpine.store('avime').descData[i]}</td>
        <td>${window.Alpine.store('avime').thumbData[i]}</td>
        <td>${window.Alpine.store('avime').maleData[i]}</td>
        <td>${window.Alpine.store('avime').femaleData[i]}</td>
      </tr>
    `);
  }
}
