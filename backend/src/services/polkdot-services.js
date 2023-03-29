import { ApiPromise, WsProvider } from '@polkadot/api';

import {Keyring} from '@polkadot/api';
import {mnemonicGenerate, mnemonicValidate, cryptoWaitReady} from '@polkadot/util-crypto';

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
    console.log(`Generated wallet Done`);
    const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });
    console.log(`Our client is connected: ${api.isConnected}`);
    const { data: { free } } = await api.query.system.account(address);
    const amount = free.toNumber();
    console.log(`Balance: ${amount}`)
}

getBalance('5EA7QP5eD7TEhtBtMK4PtH4pcbxtJXcgj1HoE2oMuiVPqV4V')

//transfer
export const transfer = async () => {

}










