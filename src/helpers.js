import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import cbbcFactory from './abis/CbbcFactory.json'
import cbbcLiquidityToken from './abis/CbbcLiquidityToken.json'
import cbbcRouter from './abis/CbbcRouter.json'

const cbbcFactoryAddress = "0xa3B21B4e4a6CC5dF7f32a998610E0684bFf44289";
const tradeTokenAddress = "0x1749eB4fa5650ef0575f0aC195e7f41d9465ec5A";
const settleTokenAdress = "0x3193d3e6392338919D16278Ec9f2846371591d6d";
const cbbcRouterAddress = "0x5DB5A86aa9A2eD77bb23C50DBCf3e43afD02bE64";

let web3 = new Web3(Web3.givenProvider);
let cbbcFactoryInstance = new web3.eth.Contract(cbbcFactory.abi, cbbcFactoryAddress);
let tradeTokenInstance = new web3.eth.Contract(cbbcLiquidityToken.abi, tradeTokenAddress);
let settleTokenInstance = new web3.eth.Contract(cbbcLiquidityToken.abi, settleTokenAdress);
let cbbcRouterInstance = new web3.eth.Contract(cbbcRouter.abi, cbbcRouterAddress);


(async () => {
    let cbbcAddresses = [];
    const cbbcLength = await cbbcFactoryInstance.methods.allCbbcsLength().call();
    for(let i=0;i<cbbcLength;i++) {  //拿持仓
        cbbcAddresses.push(await cbbcFactoryInstance.methods.allCbbcs(i).call())  
    }

    //拿所有标的名
    console.log(await settleTokenInstance.methods.name().call());
    
    // cbbcRouterInstance.methods.buyCbbcETH(lastPrice, tradeTokenAddress, 0, 0, web3.utils.toBN('1'), "0xfFCDC69320928d609F656a335a1598592F039592", 0).call();
})();

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

