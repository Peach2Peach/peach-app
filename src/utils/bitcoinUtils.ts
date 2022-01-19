import { DEV } from '@env'
import * as bitcoin from 'bitcoinjs-lib'
import * as bip39 from 'bip39'
const { randomBytes } = require('react-native-randombytes')

export let wallet: bitcoin.bip32.BIP32Interface

/**
 * @description Method to generate random bytes
 * @param count length of random bytes
 * @returns random bytes
 */
const getRandom = (count: number): Promise<Buffer> => new Promise((resolve, reject) =>
  randomBytes(count, (err: any, bytes: Buffer) => {
    if (err) reject(err)
    else resolve(bytes)
  }))

/**
 * @description Method to randomly create a new wallet or from seed phrase
 * @param mnemonic bitcoin seed phrase
 * @returns bip32 HD wallet
*/
export const createWallet = async (mnemonic? :string): Promise<PeachWallet> => {
  mnemonic = mnemonic || bip39.entropyToMnemonic(await getRandom(16))
  const seed = bip39.mnemonicToSeedSync(mnemonic)

  return {
    wallet: bitcoin.bip32.fromSeed(
      seed,
      DEV ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
    ),
    mnemonic
  }
}


export const setWallet = (wllt: bitcoin.bip32.BIP32Interface) => wallet = wllt