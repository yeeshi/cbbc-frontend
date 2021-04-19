import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import cbbcFactory from './abis/CbbcFactory.json'

const cbbcFactoryAddress = "0xa3B21B4e4a6CC5dF7f32a998610E0684bFf44289";
let web3 = new Web3(Web3.givenProvider);


ethereum.on('accountsChanged', handleAccountsChanged);

async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== web3.eth.defaultAccount) {
        web3.eth.defaultAccount = accounts[0];
    }
}

export default {
    async connectWallet() { //连接用户钱包
        const provider = await detectEthereumProvider();

        if(!provider) {
            console.log('Please install MetaMask!');
        } else if (provider !== window.ethereum) {
            console.error('Do you have multiple wallets installed?');
        } else {
            ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                if (err.code === 4001) {
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
            });
        }
    },
    getAccount() { //获取用户账户
        ethereum
        .request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
            console.error(err);
        });
    }
}

