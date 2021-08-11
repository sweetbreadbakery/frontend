export async function traitUpdateHash() {
  let traitHash = document.getElementById('trait-hash');

  try {
    let upload = await window.Alpine.store('avime').s01Contract.methods
      .updateTraitHash(window.Alpine.store('avime').currentTraitNum, traitHash.innerHTML)
      .send({ from: window.Alpine.store('avime').walletAddress });

    traitHash.innerHTML = `Trait #${window.Alpine.store('avime').currentTraitNum} updated`;
    console.info(upload);
  } catch (err) {
    console.error(err);
  }
}
