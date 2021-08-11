export async function cardUpload() {
  let upload;
  let cardHash = document.getElementById('#card-hash');

  try {
    cardHash.innerHTML = '';

    upload = await window.Alpine.store('avime').s01Contract.methods
      .uploadCard(
        window.Alpine.store('avime').nameData,
        window.Alpine.store('avime').descData,
        window.Alpine.store('avime').thumbData,
        window.Alpine.store('avime').cardData
      )
      .send({ from: window.Alpine.store('avime').walletAddress });

    cardHash.innerHTML = upload.transactionHash;
  } catch (err) {
    console.error(err);
  }
}
