export async function mintAvimeS01() {
  try {
    let mint;
    let mintCost = 60000000000000000;
    let numberOfPacks = parseInt(document.getElementById('s01_number_of_packs').value);

    mintCost = mintCost * numberOfPacks;
    mint = await window.Alpine.store('avime').s01Contract.methods
      .mint(numberOfPacks)
      .send({ from: window.Alpine.store('avime').walletAddress, value: mintCost });

    console.info(mint);
    window.Alpine.store('avime').updateMyAvime();
  } catch (err) {
    console.error(err);
  }
}
