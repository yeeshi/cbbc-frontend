import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import cbbcFactory from './abis/CbbcFactory.json'
import cbbcToken from './abis/CbbcToken.json'
import cbbcRouter from './abis/CbbcRouter.json'
import liquidityToken from './abis/CbbcLiquidityToken.json'
import axios from 'axios'

const cbbcFactoryAddress = "0x76183De81825a2e53E258D1e14334A92f061aC51";
const cbbcRouterAddress = "0x2cd07277df88cb8AC76847aA87baAB9A08e5c944";
const cbbcTokenAddress = "0xC09EF3F3E8B196368A4C503B6e327D967098eF1F";
const liquidityTokenAddress = "0x6398b2bAC8f6AcC8A4726669b37a7473Ea34ce19";
const priceDataServer = "http://34.212.231.157";//"http://localhost:8000/pricedata";

let web3 = new Web3(Web3.givenProvider);
let cbbcFactoryInstance = new web3.eth.Contract(cbbcFactory.abi, cbbcFactoryAddress);
let cbbcRouterInstance = new web3.eth.Contract(cbbcRouter.abi, cbbcRouterAddress);
let liquidityTokenInstance = new web3.eth.Contract(liquidityToken.abi, liquidityTokenAddress);

const settleTokenList = getSettleTokenList();
const tradeTokenList = getTradeTokenList();
let cbbc = [];  //[{string name,string address,object instance}]

(async () => {

})();

ethereum.on('accountsChanged', handleAccountsChanged);
ethereum.on('chainChanged', handleChainChanged);
async function handleChainChanged(id) {
    console.log(id);
}

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

function toWei(amount) {
    return BigInt(amount * Math.pow(10, 18)).toString();
}

function toEth(amount) {
    return (parseFloat(amount) / Math.pow(10, 18)).toString();
}

//string settleTokenAddr, string amount, string ownerAddress
async function approveToken(settleTokenAddr, amount, ownerAddress) { 
    let tokenInstance = new web3.eth.Contract(cbbcToken.abi, settleTokenAddr);
    tokenInstance.methods.approve(cbbcRouterAddress, toWei(amount)).send({from:ownerAddress}, async function(error, transactionHash){
        return {
            error: error,
            transactionHash: transactionHash
        };
    });
}

//string string amount, string ownerAddress
async function approveLiquidityToken(amount, ownerAddress) { 
    liquidityTokenInstance.methods.approve(cbbcRouterAddress, toWei(amount)).send({from:ownerAddress}, async function(error, transactionHash){
        return {
            error: error,
            transactionHash: transactionHash
        };
    });
}

//string settleTokenAddr, string tradeTokenAddr, int leverage, int type, string amount, string ownerAddress
async function buyCbbc(settleTokenAddr, tradeTokenAddr, leverage, type, amount, ownerAddress) {
    axios.get(priceDataServer)
    .then(function(response) {
        if(response.status == 200) {
            let priceData = response.data;
                cbbcRouterInstance.methods.buyCbbc([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], settleTokenAddr, tradeTokenAddr, leverage, type, toWei(amount), ownerAddress, getDeadline())
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


async function getCbbc() {
    if(cbbc.length == 0) { //lazy loading for cbbc
        const cbbcLength = await cbbcFactoryInstance.methods.allCbbcsLength().call();
        for(let i=0;i<cbbcLength;i++) {
            let cbbcAddress = await cbbcFactoryInstance.methods.allCbbcs(i).call();
            let instance = new web3.eth.Contract(cbbcToken.abi, cbbcAddress);
            let name = await instance.methods.name().call();
            cbbc.push({
                name: name,
                address: cbbcAddress,
                instance: instance
            });
        }
    }

    return cbbc;
}


//arguments: string ownerAddress
//return: [{string name,int amount}]
async function getPositions(ownerAddress) {
    cbbc = await getCbbc();
    let positions = [];
    for(let i=0;i<cbbc.length;i++) {
        let amount = await cbbc[i].instance.methods.balanceOf(ownerAddress).call();
        positions.push({
            name: cbbc[i].name,
            amount: toEth(amount)
        });
    }

    return positions;
}


//return: string
async function getTotalLiabilities() {
    let liabilities = await liquidityTokenInstance.methods.getTotalLiabilities().call()
    return toEth(liabilities);
}

//arguments: string settleTokenAddress, int amount, string ownerAddress
//return: {string error, string transactionHash}
async function addLiquidity(settleTokenAddr, amount, ownerAddress) {
    cbbcRouterInstance.methods.addLiquidity(settleTokenAddr, toWei(amount), ownerAddress, getDeadline())
    .send({from: ownerAddress}, async function(error, transactionHash){
        return {
            error: error,
            transactionHash: transactionHash
        }
    });
}

//arguments: string settleTokenAddress, int amount, string ownerAddress
//return: {string error, string transactionHash}
async function removeLiquidity(settleTokenAddr, amount, ownerAddress) {
    //TODO: add advance mode for user to choose amountMin instead of 0
    cbbcRouterInstance.methods.removeLiquidity(settleTokenAddr, toWei(amount), 0, ownerAddress, getDeadline())
    .send({from: ownerAddress}, async function(error, transactionHash){
        return {
            error: error,
            transactionHash: transactionHash
        }
    });
}

//连接用户钱包
//arguments: fcuntion accountHandler, function chainIdHandler
async function connectWallet(accountHandler,chainIdHandler) { 
    const provider = await detectEthereumProvider();

    if(!provider) {
        console.log('Please install MetaMask!');
    } else if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
    } else {
        ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result)=>{
            handleAccountsChanged(result);
            accountHandler(result);
        })
        .catch((err) => {
            if (err.code === 4001) {
                console.log('Please connect to MetaMask.');
            } else {
                console.error(err);
            }
        });
        ethereum
            .request({ method: 'eth_chainId' })
            .then((result)=>{
                handleChainChanged(result);
                chainIdHandler(result)
            })
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
    approveToken,  //授权通证
    approveLiquidityToken, //授权流动性通证
    buyCbbc,  //购买牛熊证
    getTotalLiabilities, //显示流动性收益
    addLiquidity, //添加流动性
    removeLiquidity, //移除流动性
    connectWallet, //连接钱包
    getAccount
}

