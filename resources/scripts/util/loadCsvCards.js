export function loadCsv() {
  var csvString = document.getElementById('csv_data').value;
  var csvData = window.Papa.parse(csvString);

  document.getElementById('card-table').empty();

  document.getElementById('card-table').append(`
    <tr style="border-bottom:1px solid black">
      <td>Name</td>
      <td>Desc</td>
      <td>Thumb</td>
      <td>Card</td>
    </tr>
  `);

  for (var i = 0; i < 6; i++) {
    window.Alpine.store('avime').nameData.push(csvData.data[i + 1][1]);
    window.Alpine.store('avime').descData.push(csvData.data[i + 1][2]);
    window.Alpine.store('avime').thumbData.push(`<img src="${csvData.data[i + 1][3]}">`);
    window.Alpine.store('avime').cardData.push(`<img src="${csvData.data[i + 1][4]}">`);

    document.getElementById('card-table').append(`
      <tr style="border-bottom:1px solid black">
      <td>${window.Alpine.store('avime').nameData[i]}</td>
      <td>${window.Alpine.store('avime').descData[i]}</td>
      <td>${window.Alpine.store('avime').thumbData[i]}</td>
      <td>${window.Alpine.store('avime').cardData[i]}</td>
      </tr>
    `);
  }
}
