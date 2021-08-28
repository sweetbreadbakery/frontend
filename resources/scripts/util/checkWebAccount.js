export async function checkWebAccount(ethereum, web3) {
  try {
    const currentAccounts = await web3.eth.getAccounts();
    const account = currentAccounts[0];

    if (account != window.Alpine.store('avime').walletAddress) {
      window.Alpine.store('avime').walletAddress = account;
      window.Alpine.store('avime').checkWeb3(ethereum, web3);
      // window.Alpine.store('avime').updateMyAvime(ethereum, web3);
    }

    setTimeout(checkWebAccount, 500, ethereum, web3);
  } catch (err) {
    console.error(err);
  }
}
