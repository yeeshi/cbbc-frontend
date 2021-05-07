import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import cbbcFactory from './abis/CbbcFactory.json'
import cbbcToken from './abis/CbbcToken.json'
import cbbcRouter from './abis/CbbcRouter.json'
import liquidityToken from './abis/CbbcLiquidityToken.json'
import orchestrator from './abis/Orchestrator.json'
import axios from 'axios'
import {splitSignature} from '@ethersproject/bytes'

const cbbcFactoryAddress = "0x9AE915DA96117094E0e06880c8e5Ec23551c7c82";
const cbbcRouterAddress = "0xeE32eFAACe4a95d93376E0F9B5fe3AB642630ce3";
const wethAddress = "0x9F4B99590B6577C4515BF314597B6D4dCA8af45A";
const liquidityTokenAddress = "0x53ccFB76825F02D3c065AdE948BCfB7b5653A7d6";
const ETHLiquidityTokenAddress = "0xd1925E05999a26BD616A6B40471D964A874a969c";
const orchestratorAddress = "0x48A6455D399c77193424C23E1349aC11445f2c7a";
const priceDataServer = "http://34.212.231.157";//"http://localhost:8000/pricedata";
const wethDataServer = priceDataServer+"?settletoken=eth";

let web3 = new Web3(Web3.givenProvider);
const cbbcFactoryInstance = new web3.eth.Contract(cbbcFactory.abi, cbbcFactoryAddress);
const cbbcRouterInstance = new web3.eth.Contract(cbbcRouter.abi, cbbcRouterAddress);
const liquidityTokenInstance = new web3.eth.Contract(liquidityToken.abi, liquidityTokenAddress);
const ETHLiquidityTokenInstance = new web3.eth.Contract(liquidityToken.abi, ETHLiquidityTokenAddress);
const orchestratorInstance = new web3.eth.Contract(orchestrator.abi, orchestratorAddress);

const settleTokenList = getSettleTokenList();
const tradeTokenList = getTradeTokenList();
let cbbc = [];  //[{string name,string address,object instance}]
    
(async () => {
    // let amount = 10;
    // let ownerAddress = "0xa28A56bbD2b9ede5A006dBb2CA2B4Fd52b086250";
    // let settleTokenAddr = "0x3193d3e6392338919D16278Ec9f2846371591d6d";
    // console.log(await liquidityTokenInstance.methods.nonces(ownerAddress).call());
    // getSignature(amount, ownerAddress, function(signature, deadline){
    //     console.log(deadline);
    //     console.log(signature);
        // liquidityTokenInstance.methods.permit(
        //     ownerAddress, cbbcRouterAddress, toWei(amount), deadline,
        //     signature.v, signature.r, signature.s
        // ).send({from:ownerAddress});
        // removeLiquidityWithPermit(settleTokenAddr, amount, ownerAddress, signature, deadline, function(){}, function(){});
    // });
    
})();
window.addEventListener('load', function() {
    if (typeof ethereum !== 'undefined') {
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
    }else{
    }
});


async function handleChainChanged(id) {
    
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

function IsWalletInstalled(){
    return typeof ethereum !== 'undefined';
}
//argument: string ownerAddress
async function getETHBalance(ownerAddress,callback) {
    web3.eth.getBalance(ownerAddress, (err, balance) => {
        callback(toEth(balance));
    });
    
}


//arguments: string tokenAddr, string amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function approveToken(tokenAddr, amount, ownerAddress, callback, onConfirm) { 
    let tokenInstance = new web3.eth.Contract(cbbcToken.abi, tokenAddr);
    tokenInstance.methods.approve(cbbcRouterAddress, toWei(amount)).send({from:ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    }).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}

//arguments: string tokenAddr, string ownerAddress
async function allowance(tokenAddr, ownerAddress) {
    let tokenInstance = new web3.eth.Contract(cbbcToken.abi, tokenAddr);
    return toEth(await tokenInstance.methods.allowance(ownerAddress, cbbcRouterAddress).call());
}

//string string amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function approveLiquidityToken(amount, ownerAddress, callback, onConfirm) { 
    liquidityTokenInstance.methods.approve(cbbcRouterAddress, toWei(amount)).send({from:ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    }).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}

//string string amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function approveETHLiquidityToken(amount, ownerAddress, callback, onConfirm) { 
    ETHLiquidityTokenInstance.methods.approve(cbbcRouterAddress, toWei(amount)).send({from:ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    }).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}


//arguments: string amount, string ownerAddress, function callback(obj signature, string deadline)
async function getSignature(amount, ownerAddress, callback) {
    let deadline = getDeadline();
    const msgParams = JSON.stringify({
        domain: {
            chainId: await ethereum.request({ method: 'eth_chainId' }),
            name: 'CBBC Liquidity Token',
            verifyingContract: liquidityTokenAddress,
            version: '1',
        },
    
        message: {
            owner: ownerAddress,
            spender: cbbcRouterAddress,
            value: toWei(amount),
            nonce: 0,
            deadline: deadline
        },
        primaryType: 'Permit',
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            Permit: [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
                { name: 'value', type: 'uint256' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' }
            ]
        },
    });
    
    web3.currentProvider.send(
        {method: 'eth_signTypedData_v4', params: [ownerAddress, msgParams], from:ownerAddress}, 
        function (err, result) {
            let permitData = splitSignature(result.result);
            callback(permitData, deadline);
    });
}

//arguments: string tokenAddr, string ownerAddress
//return: string
async function getBalance(tokenAddr, ownerAddress) {
    let instance = new web3.eth.Contract(cbbcToken.abi, tokenAddr);
    let amount =await instance.methods.balanceOf(ownerAddress).call();
    return toEth(amount);
}


//arguments: string settleTokenAddr, string tradeTokenAddr, int leverage, int type, int amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function buyCbbc(settleTokenAddr, tradeTokenAddr, leverage, type, amount, ownerAddress, callback, onConfirm) {
    axios.get(priceDataServer)
    .then(function(response) {
        if(response.status == 200) {
            let priceData = response.data;
                cbbcRouterInstance.methods.buyCbbc([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], settleTokenAddr, tradeTokenAddr, leverage, type, toWei(amount), ownerAddress, getDeadline())
                .send({from: ownerAddress}, async function(error, transactionHash){
                    callback(error, transactionHash);
                }).once('confirmation', function(confNumber, receipt){
                    onConfirm(confNumber, receipt);
                });
        }
        else {
            console.error(response);
            callback(response.status, transactionHash);
        }
    });
}

//arguments: string tradeTokenAddr, int leverage, int type, int amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function buyCbbcETH(tradeTokenAddr, leverage, type, amount, ownerAddress, callback, onConfirm) {
    axios.get(wethDataServer)
    .then(function(response) {
        if(response.status == 200) {
            let priceData = response.data;
            let data = cbbcRouterInstance.methods.buyCbbcETH([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], 
                                                                tradeTokenAddr, leverage, type, ownerAddress, getDeadline()).encodeABI();
            web3.eth.sendTransaction({to:cbbcRouterAddress, from:ownerAddress, data: data, value: toWei(amount)}, async function(error, transactionHash){
                callback(error, transactionHash);
            }).once('confirmation', function(confNumber, receipt){
                onConfirm(confNumber, receipt);
            });
        }
        else {
            console.error(response);
            callback(response.status, transactionHash);
        }
    });
}


//string cbbcAddr, string amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function sellCbbc(cbbcAddr, amount, ownerAddress, callback, onConfirm) {
    let cbbcInstance = new web3.eth.Contract(cbbcToken.abi, cbbcAddr);
    let settleTokenAddr = await cbbcInstance.methods.settleToken().call();
    let tradeTokenAddr = await cbbcInstance.methods.tradeToken().call();
    let leverage = await cbbcInstance.methods.leverage().call();
    let cbbcType = await cbbcInstance.methods.cbbcType().call();

    if(settleTokenAddr == wethAddress) {
        axios.get(wethDataServer)
        .then(function(response) {
            if(response.status == 200) {
                let priceData = response.data;
                    cbbcRouterInstance.methods.sellCbbcETH([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], tradeTokenAddr, leverage, cbbcType, toWei(amount), 0, ownerAddress, getDeadline())
                    .send({from: ownerAddress}, async function(error, transactionHash){
                        callback(error, transactionHash);
                    }).once('confirmation', function(confNumber, receipt){
                        onConfirm(confNumber, receipt);
                    });
            }
            else {
                console.error(response);
                callback(response.status, transactionHash);
            }
        });
    }
    else {
        axios.get(priceDataServer)
        .then(function(response) {
            if(response.status == 200) {
                let priceData = response.data;
                    cbbcRouterInstance.methods.sellCbbc([priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], settleTokenAddr, tradeTokenAddr, leverage, cbbcType, toWei(amount), 0, ownerAddress, getDeadline())
                    .send({from: ownerAddress}, async function(error, transactionHash){
                        callback(error, transactionHash);
                    }).once('confirmation', function(confNumber, receipt){
                        onConfirm(confNumber, receipt);
                    });
            }
            else {
                console.error(response);
                callback(response.status, transactionHash);
            }
        });
    }
}


async function sellCbbcWithPermit(cbbcAddr, amount, ownerAddress, deadline, permit, callback, onConfirm) {
    let cbbcInstance = new web3.eth.Contract(cbbcToken.abi, cbbcAddr);
    let settleTokenAddr = await cbbcInstance.methods.settleToken().call();
    let tradeTokenAddr = await cbbcInstance.methods.tradeToken().call();
    let leverage = await cbbcInstance.methods.leverage().call();
    let cbbcType = await cbbcInstance.methods.cbbcType().call();

    if(settleTokenAddr == wethAddress) {
        axios.get(wethDataServer)
        .then(function(response) {
            if(response.status == 200) {
                let priceData = response.data;
                    cbbcRouterInstance.methods.sellCbbcETHWithPermit(
                        [priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], 
                        tradeTokenAddr, leverage, cbbcType, toWei(amount), 0, ownerAddress, deadline,
                        [false, permit.v, permit.r, permit.s]
                    ).send({from: ownerAddress}, async function(error, transactionHash){
                        callback(error, transactionHash);
                    }).once('confirmation', function(confNumber, receipt){
                        onConfirm(confNumber, receipt);
                    });
            }
            else {
                console.error(response);
                callback(response.status, transactionHash);
            }
        });
    }
    else {
        axios.get(priceDataServer)
        .then(function(response) {
            if(response.status == 200) {
                let priceData = response.data;
                    cbbcRouterInstance.methods.sellCbbcWithPermit(
                        [priceData.settlePrice,priceData.tradePrice,priceData.nonce,priceData.signature], 
                        settleTokenAddr, tradeTokenAddr, leverage, cbbcType, toWei(amount), 0, ownerAddress, deadline,
                        [false, permit.v, permit.r, permit.s]
                    ).send({from: ownerAddress}, async function(error, transactionHash){
                        callback(error, transactionHash);
                    }).once('confirmation', function(confNumber, receipt){
                        onConfirm(confNumber, receipt);
                    });
            }
            else {
                console.error(response);
                callback(response.status, transactionHash);
            }
        });
    }
}


// return: [{address: string, name: string}]
async function getTradeTokenList() { 
    let addresses = await cbbcFactoryInstance.methods.getAllowedTradeTokenList().call();
    let list = [];
    for(let i=0;i<addresses.length;i++) {
        list.push({
            address: addresses[i],
            name: await cbbcFactoryInstance.methods.tokenSymbols(addresses[i]).call()
        })
    }
    return list;
}


// return: [{address: string, name: string}]
async function getSettleTokenList() { 
    let addresses = await cbbcFactoryInstance.methods.getAllowedSettleTokenList().call();
    let list = [];
    for(let i=0;i<addresses.length;i++) {
        list.push({
            address: addresses[i],
            name: await cbbcFactoryInstance.methods.tokenSymbols(addresses[i]).call()
        })
    }
    return list;
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
    let positions = new Map();
    
    for(let i=0;i<cbbc.length;i++) {
        let amount = await cbbc[i].instance.methods.balanceOf(ownerAddress).call();
        let type = await cbbc[i].instance.methods.cbbcType().call();
        let cbbcprice = await cbbc[i].instance.methods.currentPrice().call();
        
        positions.set(cbbc[i].address, {
            address: cbbc[i].address,
            name: cbbc[i].name,
            type: type,
            cbbcprice: toEth(cbbcprice),
            amount: toEth(amount)
        });
    }
    return positions;
}


//string cbbcAddr, string ownerAddress
async function rebase(cbbcAddr, ownerAddress,onConfirm) {
    orchestratorInstance.methods.rebase(cbbcAddr).send({from: ownerAddress}).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}

//return: string
async function getTotalLiabilities() {
    let liabilities = await liquidityTokenInstance.methods.getTotalLiabilities().call()
    return toEth(liabilities);
}

//arguments: string settleTokenAddress, int amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
//return: {string error, string transactionHash}
async function addLiquidity(settleTokenAddr, amount, ownerAddress,callback, onConfirm) {
    cbbcRouterInstance.methods.addLiquidity(settleTokenAddr, toWei(amount), ownerAddress, getDeadline())
    .send({from: ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    }).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}

async function addLiquidityETH(amount, ownerAddress,callback, onConfirm) {
    cbbcRouterInstance.methods.addLiquidityETH(ownerAddress, getDeadline())
    .send({from: ownerAddress, value:toWei(amount)}, async function(error, transactionHash){
        callback(error, transactionHash);
    }).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}


//arguments: int amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function removeLiquidity(settleTokenAddr, amount, ownerAddress, callback, onConfirm) {
    //TODO: add advance mode for user to choose amountMin instead of 0
    cbbcRouterInstance.methods.removeLiquidity(settleTokenAddr, toWei(amount), 0, ownerAddress, getDeadline())
    .send({from: ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    }).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}

//arguments: int amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function removeLiquidityWithPermit(settleTokenAddr, amount, ownerAddress, permit, deadline, callback, onConfirm) {
    //TODO: add advance mode for user to choose amountMin instead of 0
    cbbcRouterInstance.methods.removeLiquidityWithPermit(
        settleTokenAddr, toWei(amount), 0, ownerAddress, deadline,
        false, permit.v, permit.r, permit.s
    ).send({from: ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    }).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}

//arguments: int amount, string ownerAddress, function callback(error, transactionHash), function onConfirm()
async function removeLiquidityETH(amount, ownerAddress, callback, onConfirm) {
    //TODO: add advance mode for user to choose amountMin instead of 0
    cbbcRouterInstance.methods.removeLiquidityETH(toWei(amount), 0, ownerAddress, getDeadline())
    .send({from: ownerAddress}, async function(error, transactionHash){
        callback(error, transactionHash);
    }).once('confirmation', function(confNumber, receipt){
        onConfirm(confNumber, receipt);
    });
}


async function getLiquilityBalance(ownerAddress) {
    let amount = await liquidityTokenInstance.methods.balanceOf(ownerAddress).call();
    return toEth(amount);
}

async function getETHLiquilityBalance(ownerAddress) {
    let amount = await ETHLiquidityTokenInstance.methods.balanceOf(ownerAddress).call();
    return toEth(amount);
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

function getAccount(accountHandler) { //获取用户账户
    ethereum
    .request({ method: 'eth_accounts' })
    .then((result)=>{
        handleAccountsChanged(result);
        accountHandler(result);
    })
    .catch((err) => {
        console.error(err);
    });
}


export default {
    settleTokenList,
    tradeTokenList,
    IsWalletInstalled,
    getETHBalance, //获取用户ETH数量
    allowance, //获取授权通证数量
    approveToken,  //授权通证
    approveLiquidityToken, //授权cbbcRouter流动性通证调用权
    approveETHLiquidityToken, //授权cbbcRouter ETH流动性通证调用权
    getBalance, //获取通证数量
    buyCbbc,  //购买牛熊证
    buyCbbcETH, //用ETH购买牛熊证
    sellCbbc, //出售牛熊证
    getPositions, //获取用户持仓列表
    rebase, //rebase
    getTotalLiabilities, //显示流动性收益
    getLiquilityBalance, //获取流动性份额
    getETHLiquilityBalance, //获取ETH流动性份额
    addLiquidity, //添加流动性
    addLiquidityETH, //用ETH添加流动性
    removeLiquidity, //移除流动性
    removeLiquidityETH, //eth移除流动性
    connectWallet, //连接钱包
    getAccount,
}

