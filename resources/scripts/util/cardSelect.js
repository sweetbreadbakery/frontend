export function cardSelect() {
  window.Alpine.store('avime').cardCurrent = this.value;
  document.getElementById('card-name').innerHTML = window.Alpine.store('avime').cardData[this.value][1];
  document.getElementById('card-description').innerHTML = window.Alpine.store('avime').cardData[this.value][2];
  document.getElementById('card-thumbnail').innerHTML = `<img src="${window.Alpine.store('avime').cardData[this.value][3]}" alt="">`;
  document.getElementById('card-card').innerHTML = `<img src="${window.Alpine.store('avime').cardData[this.value][4]}" alt="">`;
}
