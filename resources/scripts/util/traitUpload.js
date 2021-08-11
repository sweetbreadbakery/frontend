export async function traitUpload() {
  let traitHash = document.getElementById('trait-hash');

  try {
    traitHash.innerHTML = '';

    let upload = await window.Alpine.store('avime').s01Contract.methods
      .uploadTrait(
        window.Alpine.store('avime').nameData,
        window.Alpine.store('avime').descData,
        window.Alpine.store('avime').thumbData,
        window.Alpine.store('avime').maleData,
        window.Alpine.store('avime').femaleData
      )
      .send({ from: window.Alpine.store('avime').walletAddress });

    traitHash.innerHTML = upload.transactionHash;

    console.info(upload);
  } catch (err) {
    console.error(err);
  }
}
