import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import cbbcFactory from './abis/CbbcFactory.json'
import cbbcToken from './abis/CbbcToken.json'
import cbbcRouter from './abis/CbbcRouter.json'
import liquidityToken from './abis/CbbcLiquidityToken.json'
import orchestrator from './abis/Orchestrator.json'
import axios from 'axios'

const cbbcFactoryAddress = "0x76183De81825a2e53E258D1e14334A92f061aC51";
const cbbcRouterAddress = "0x2cd07277df88cb8AC76847aA87baAB9A08e5c944";
const cbbcTokenAddress = "0xC09EF3F3E8B196368A4C503B6e327D967098eF1F";
const liquidityTokenAddress = "0x6398b2bAC8f6AcC8A4726669b37a7473Ea34ce19";
const orchestratorAddress = "0x48A6455D399c77193424C23E1349aC11445f2c7a";
const priceDataServer = "http://34.212.231.157";//"http://localhost:8000/pricedata";

let web3 = new Web3(Web3.givenProvider);
const cbbcFactoryInstance = new web3.eth.Contract(cbbcFactory.abi, cbbcFactoryAddress);
const cbbcRouterInstance = new web3.eth.Contract(cbbcRouter.abi, cbbcRouterAddress);
const liquidityTokenInstance = new web3.eth.Contract(liquidityToken.abi, liquidityTokenAddress);
const orchestratorInstance = new web3.eth.Contract(orchestrator.abi, orchestratorAddress);

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

//arguments: string tokenAddr, string amount, string ownerAddress, function callback(error, transactionHash)
async function approveToken(tokenAddr, amount, ownerAddress, callback) { 
    let tokenInstance = new web3.eth.Contract(cbbcToken.abi, tokenAddr);
    tokenInstance.methods.approve(cbbcRouterAddress, toWei(amount)).send({from:ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    });
}

//string string amount, string ownerAddress, function callback(error, transactionHash)
async function approveLiquidityToken(amount, ownerAddress, callback) { 
    liquidityTokenInstance.methods.approve(cbbcRouterAddress, toWei(amount)).send({from:ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    });
}

//arguments: string tokenAddr, string ownerAddress
//return: string
async function getBalance(tokenAddr, ownerAddress) {
    let instance = new web3.eth.Contract(cbbcToken.abi, tokenAddr);
    let amount =await instance.methods.balanceOf(ownerAddress).call();
    return toEth(amount);
}

async function getLiquilityBalance(ownerAddress) {
    let amount = await liquidityTokenInstance.methods.balanceOf(ownerAddress).call();
    return toEth(amount);
}

//string settleTokenAddr, string tradeTokenAddr, int leverage, int type, string amount, string ownerAddress, function callback(error, transactionHash)
async function buyCbbc(settleTokenAddr, tradeTokenAddr, leverage, type, amount, ownerAddress, callback) {
    axios.get(priceDataServer)
    .then(function(response) {
        if(response.status == 200) {
            let priceData = response.data;
                cbbcRouterInstance.methods.buyCbbc([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], settleTokenAddr, tradeTokenAddr, leverage, type, toWei(amount), ownerAddress, getDeadline())
                .send({from: ownerAddress}, async function(error, transactionHash){
                    callback(error, transactionHash);
                });
        }
        else {
            console.error(response);
            callback(response.status, transactionHash);
        }
    });
}


//string cbbcAddr, string amount, string ownerAddress, function callback(error, transactionHash)
async function sellCbbc(cbbcAddr, amount, ownerAddress, callback) {
    let cbbcInstance = new web3.eth.Contract(cbbcToken.abi, cbbcAddr);
    let settleTokenAddr = await cbbcInstance.methods.settleToken().call();
    let tradeTokenAddr = await cbbcInstance.methods.tradeToken().call();
    let leverage = await cbbcInstance.methods.leverage().call();
    let cbbcType = await cbbcInstance.methods.cbbcType().call();

    axios.get(priceDataServer)
    .then(function(response) {
        if(response.status == 200) {
            let priceData = response.data;
                cbbcRouterInstance.methods.sellCbbc([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], settleTokenAddr, tradeTokenAddr, leverage, cbbcType, toWei(amount), 0, ownerAddress, getDeadline())
                .send({from: ownerAddress}, async function(error, transactionHash){
                    callback(error, transactionHash);
                });
        }
        else {
            console.error(response);
            callback(response.status, transactionHash);
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
        let type = await cbbc[i].instance.methods.cbbcType().call();
        positions.push({
            address: cbbc[i].address,
            name: cbbc[i].name,
            type: type,
            amount: toEth(amount)
        });
    }

    return positions;
}


//string cbbcAddr, string ownerAddress
async function rebase(cbbcAddr, ownerAddress) {
    orchestratorInstance.methods.rebase(cbbcAddr).send({from: ownerAddress});
}

//return: string
async function getTotalLiabilities() {
    let liabilities = await liquidityTokenInstance.methods.getTotalLiabilities().call()
    return toEth(liabilities);
}

//arguments: string settleTokenAddress, int amount, string ownerAddress, function callback(error, transactionHash)
//return: {string error, string transactionHash}
async function addLiquidity(settleTokenAddr, amount, ownerAddress) {
    cbbcRouterInstance.methods.addLiquidity(settleTokenAddr, toWei(amount), ownerAddress, getDeadline())
    .send({from: ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    });
}

//arguments: string settleTokenAddress, int amount, string ownerAddress, function callback(error, transactionHash)
//return: {string error, string transactionHash}
async function removeLiquidity(settleTokenAddr, amount, ownerAddress, callback) {
    //TODO: add advance mode for user to choose amountMin instead of 0
    cbbcRouterInstance.methods.removeLiquidity(settleTokenAddr, toWei(amount), 0, ownerAddress, getDeadline())
    .send({from: ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
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
    getBalance, //获取通证数量
    buyCbbc,  //购买牛熊证
    sellCbbc, //出售牛熊证
    getPositions, //获取用户持仓列表
    rebase, //rebase
    getTotalLiabilities, //显示流动性收益
    getLiquilityBalance, //获取流动性份额
    addLiquidity, //添加流动性
    removeLiquidity, //移除流动性
    connectWallet, //连接钱包
    getAccount
}

