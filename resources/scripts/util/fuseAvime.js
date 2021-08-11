export async function fuseAvime() {
  let mint;
  let mintCost = 40000000000000000;
  let sex = parseInt(this.getAttribute('sex'));

  try {
    mint = await window.Alpine.store('avime').fusionContract.methods
      .mint(
        window.Alpine.store('avime').selectedSeasons,
        window.Alpine.store('avime').selectedTraits,
        sex
      )
      .send({
        from: window.Alpine.store('avime').walletAddress,
        value: mintCost,
      });

    console.info(mint);
    window.Alpine.store('avime').updateMyAvime();
  } catch (err) {
    console.error(err);
  }
}
