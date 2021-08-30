export async function checkWeb3(ethereum, web3) {
  const currentAccounts = await web3.eth.getAccounts();
  const account = currentAccounts[0];
  window.Alpine.store('avime').walletAddress = account;

  try {
    if (ethereum) {
      document.getElementById('eth-login').classList.add('is-disabled');
      document.getElementById('eth-login').innerHTML = 'Please check Web3 wallet';

      if (account) {
        window.Alpine.store('avime').connect();
        document.getElementById('eth-login').classList.remove('is-disabled');
        document.getElementById('eth-login').innerHTML = `Wallet: ${account.substring(0, 6)}...${account.slice(account.length - 4)}`;
        document.getElementById('eth-login').classList.add('is-success');
      } else {
        window.Alpine.store('avime').disconnect();
        document.getElementById('eth-login').classList.remove('is-disabled');
        document.getElementById('eth-login').innerHTML = 'Connect Wallet';
      }
    } else {
      document.getElementById('eth-login').innerHTML = 'Error loading Web3';
      document.getElementById('eth-login').classList.add('is-disabled');
    }
  } catch (err) {
    console.error(err);
  }
}
