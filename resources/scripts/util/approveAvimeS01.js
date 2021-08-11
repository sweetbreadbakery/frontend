export async function approveAvimeS01() {
  let approve;

  try {
    approve = await window.Alpine.store('avime').s01Contract.methods
      .setApprovalForAll(window.Alpine.store('avime').fusionAddress, 1)
      .send({ from: window.Alpine.store('avime').walletAddress });

    console.info(approve);
  } catch (err) {
    console.error(err);
  }
}
