export async function updateCardHash() {
  let cardHash = document.getElementById('card-hash');

  try {
    let upload = await window.Alpine.store('avime').s01Contract.methods
      .updateCardHash(cardHash.innerHTML)
      .send({ from: window.Alpine.store('avime').walletAddress });

    cardHash.innerHTML = 'card hash updated';

    console.info(upload);
  } catch (err) {
    console.error(err);
  }
}
