import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import cbbcFactory from './abis/CbbcFactory.json'
import cbbcToken from './abis/CbbcToken.json'
import cbbcRouter from './abis/CbbcRouter.json'
import axios from 'axios'

const cbbcFactoryAddress = "0x76183De81825a2e53E258D1e14334A92f061aC51";
const cbbcRouterAddress = "0x2cd07277df88cb8AC76847aA87baAB9A08e5c944";
const cbbcTokenAddress = "0xC09EF3F3E8B196368A4C503B6e327D967098eF1F";
const priceDataServer = "http://localhost:8000/pricedata";

let web3 = new Web3(Web3.givenProvider);
let cbbcFactoryInstance = new web3.eth.Contract(cbbcFactory.abi, cbbcFactoryAddress);
let tradeTokenInstance = new web3.eth.Contract(cbbcToken.abi, tradeTokenAddress);
let settleTokenInstance = new web3.eth.Contract(cbbcToken.abi, settleTokenAdress);
let cbbcRouterInstance = new web3.eth.Contract(cbbcRouter.abi, cbbcRouterAddress);

const settleTokenList = getSettleTokenList();
const tradeTokenList = getTradeTokenList();

(async () => {
    // let cbbcAddresses = [];
    // const cbbcLength = await cbbcFactoryInstance.methods.allCbbcsLength().call();
    // for(let i=0;i<cbbcLength;i++) {  //拿持仓
    //     cbbcAddresses.push(await cbbcFactoryInstance.methods.allCbbcs(i).call())  
    // }

})();

ethereum.on('accountsChanged', handleAccountsChanged);

async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== web3.eth.defaultAccount) {
        web3.eth.defaultAccount = accounts[0];
    }
}

function getDeadline() {
    return (Math.floor(Date.now() / 1000) + 1800).toString();
}

//string amount, string ownerAddress, function callback
async function approveToken(amount, ownerAddress) { 
    //TODO: should be able to choose the settle token type
    settleTokenInstance.methods.approve(cbbcRouterAddress, amount).send({from:ownerAddress}, async function(error, transactionHash){
        return {
            error: error,
            transactionHash: transactionHash
        };
    });
}

//string amount, string ownerAddress, function callback
async function buyCbbc(settleTokenAddr, tradeTokenAddr, amount, ownerAddress, callback) {
    axios.get(priceDataServer)
    .then(function(response) {
        if(response.status == 200) {
            let priceData = response.data;
                cbbcRouterInstance.methods.buyCbbc([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], settleTokenAddr, tradeTokenAddr, 10, 1, amount, ownerAddress, getDeadline())
                .send({from: ownerAddress}, async function(error, transactionHash){
                    return {
                        error: error,
                        transactionHash: transactionHash
                    };
                });
        }
        else {
            console.error(response.status);
            console.error(response);

            return {
                error: response.status,
                transactionHash: transactionHash
            };
        }
    });
}

// return: [{address: string, name: string}]
async function getTradeTokenList() { 
    let addresses = await cbbcFactoryInstance.methods.getAllowedTradeTokenList().call();
    return getTokenList(addresses);
}


// return: [{address: string, name: string}]
async function getSettleTokenList() { 
    let addresses = await cbbcFactoryInstance.methods.getAllowedSettleTokenList().call();
    return getTokenList(addresses);
}


//arguments: [string] addresses
//return: []
async function getTokenList(addresses) {
    let list = [];
    for(let i=0;i<addresses.length;i++) {
        let tokenInstance = new web3.eth.Contract(cbbcToken.abi, addresses[i]);
        list.push({
            address: addresses[i],
            name: await tokenInstance.methods.name().call()
        })
    }
    return list;
}


//连接用户钱包
async function connectWallet() { 
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
}

function getAccount() { //获取用户账户
    ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
        console.error(err);
    });
}


export default {
    settleTokenList,
    tradeTokenList,
    approveToken,
    buyCbbc,
    connectWallet,
    getAccount
}

