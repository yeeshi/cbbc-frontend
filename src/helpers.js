import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import cbbcFactory from './abis/CbbcFactory.json'
import cbbcToken from './abis/CbbcToken.json'
import cbbcRouter from './abis/CbbcRouter.json'
import axios from 'axios'

const cbbcFactoryAddress = "0x76183De81825a2e53E258D1e14334A92f061aC51";
const tradeTokenAddress = "0x1749eB4fa5650ef0575f0aC195e7f41d9465ec5A";
const settleTokenAdress = "0x3193d3e6392338919D16278Ec9f2846371591d6d";
const cbbcRouterAddress = "0x2cd07277df88cb8AC76847aA87baAB9A08e5c944";
const cbbcTokenAddress = "0xC09EF3F3E8B196368A4C503B6e327D967098eF1F";

let web3 = new Web3(Web3.givenProvider);
let cbbcFactoryInstance = new web3.eth.Contract(cbbcFactory.abi, cbbcFactoryAddress);
let tradeTokenInstance = new web3.eth.Contract(cbbcToken.abi, tradeTokenAddress);
let settleTokenInstance = new web3.eth.Contract(cbbcToken.abi, settleTokenAdress);
let cbbcRouterInstance = new web3.eth.Contract(cbbcRouter.abi, cbbcRouterAddress);


(async () => {
    let cbbcAddresses = [];
    const cbbcLength = await cbbcFactoryInstance.methods.allCbbcsLength().call();
    for(let i=0;i<cbbcLength;i++) {  //拿持仓
        cbbcAddresses.push(await cbbcFactoryInstance.methods.allCbbcs(i).call())  
    }

    // 拿所有标的名字
    // console.log(await settleTokenInstance.methods.name().call());
    
    axios.get("http://localhost:8000/pricedata")
    .then(function(response) {
        if(response.status == 200) {
            let priceData = response.data;
            console.log(priceData);
            cbbcRouterInstance.methods.buyCbbc([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], settleTokenAdress, tradeTokenAddress, 10, 1, "1000000000000000000", "0xCDC15F917788E0cB7BB125F222B6124Fd8a6ef4C", "1819976221")
                .send({from: '0xCDC15F917788E0cB7BB125F222B6124Fd8a6ef4C'}, async function(error, transactionHash){
                    if(error) {
                        console.log("has error");
                        console.log(error);
                    }
                    console.log(transactionHash);
                });
        }
        else
            console.error(response.status);
    });
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
    cbbcRouterInstance: cbbcRouterInstance,
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

