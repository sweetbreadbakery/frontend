export function traitSelect() {
  window.Alpine.store('avime').T0_current = this.value;

  document.getElementById('T0_name').innerHTML = window.Alpine.store('avime').T0_data[this.value][1];
  document.getElementById('T0_description').innerHTML = window.Alpine.store('avime').T0_data[this.value][2];
  document.getElementById('T0_thumbnail').innerHTML = `<img src="${window.Alpine.store('avime').T0_data[this.value][3]}" />`;
  document.getElementById('T0_background').innerHTML = `<img src="${window.Alpine.store('avime').T0_data[this.value][4]}" />`;
}
