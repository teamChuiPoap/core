import { ApiPromise, WsProvider } from '@polkadot/api';

import { Keyring} from '@polkadot/api';
import {mnemonicGenerate, mnemonicValidate, cryptoWaitReady, randomAsU8a } from '@polkadot/util-crypto';


const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
const explorerUrl = 'https://westend.subscan.io/';

// const connect = async () => {
//   const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
//   const api = await ApiPromise.create({ provider: wsProvider });
//   return api.isReady;
// };

// (async () => {
//   try {
//     const api = await connect();
//     console.log(`Our client is connected: ${api.isConnected}`);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     process.exit();
//   }
// })();

export const createWallet = async ()  => {
    await cryptoWaitReady();
    const keyring = new Keyring({type: 'sr25519'});
    const mnemonic = mnemonicGenerate();
    console.log(`Generated mnemonic: ${mnemonic}`);
    
    // add an account derived from the mnemonic
    const account = keyring.addFromUri(mnemonic);
    const address = account.address;
    
    console.log(`Generated address: ${address}`);
    // Add an account derived from the mnemonic
    // const jsonWallet = JSON.stringify(keyring.toJson(account.address), null, 2)
    // console.log(`Generated wallet: ${jsonWallet}`);

    return { mnemonic, address }
}

//getBalance 
export const getBalance  = async (address) => {
    //console.log(`Generated wallet Done`);
    const api = await ApiPromise.create({ provider: wsProvider });
    console.log(`Our client is connected: ${api.isConnected}`);
    const { data: { free } } = await api.query.system.account(address);
    const amount = free.toNumber();
    console.log(`Balance: ${amount}`)

    return amount
}

// func transferDot
export const transferDot = async (senderPKEY, recipientPKEY, txAmount) => {
    
    const api = await ApiPromise.create({ provider: wsProvider });

    // Initialize account from the mnemonic
    const keyring = new Keyring({type: 'sr25519'});
    const sender = keyring.addFromMnemonic(senderPKEY);
    const senderAddr = sender.address
    const balance = await getBalance(senderAddr)
    console.log("sender wallet address")
    console.log("sender balance", balance)

    // Initialize recipient account
    const recipient = keyring.addFromMnemonic(recipientPKEY);
    const recipientAddr = recipient.address;
    console.log("recipient wallet address", recipientAddr)

    // Transfer tokens
    const transfer = api.tx.balances.transfer(recipientAddr, txAmount);

    // Sign and send transaction using sender account
    const hash = await transfer.signAndSend(sender);

    console.log("Transaction hash:", hash.toHex());
    console.log("Explorer link:", `${explorerUrl}extrinsic/${hash.toHex()}`);

    // // Return transaction hash and link to explorer
    // return {
    //     hash: hash.toHex(),
    //     explorerLink: `${explorerUrl}extrinsic/${hash.toHex()}`
    // };
}





/*
const senderPKEY = 'truck crouch expect disagree change kidney jar clerk biology ride layer trick' // 5GVsTbfQZiShuJaC88iPmbgoDWaVdvduzHmL1dG9TwUB75XP
const recipientPKEY = 'buffalo gym buyer twenty exhaust interest cost nice good kit legal snack' // 5DtcCvkkv1i41v8kK3EfZxGSbPbAxqQMrbuV2QjR9Q8bUjbh
const txAmount = 1;
// createWallet()
console.log("recipient Balance before tx")
getBalance('5DtcCvkkv1i41v8kK3EfZxGSbPbAxqQMrbuV2QjR9Q8bUjbh')

console.log("transfer dot")
transferDot(senderPKEY, recipientPKEY, txAmount)

console.log("recipient Balance after tx")
getBalance('5DtcCvkkv1i41v8kK3EfZxGSbPbAxqQMrbuV2QjR9Q8bUjbh')
*/






