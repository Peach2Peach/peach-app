import { DEV } from '@env'
import * as bitcoin from 'bitcoinjs-lib'
import * as bip39 from 'bip39'
import { getRandom } from './cryptoUtils'

export let wallet: bitcoin.bip32.BIP32Interface

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

/**
 * @description Method to get the public key for the peach escrow
 * @param offerId offer id
 * @returns public key for escrow address
 */
export const getPublicKeyForEscrow = (offerId: number) =>
  wallet.derivePath(`m/48'/${DEV ? '1' : '0'}'/0'/${offerId}'`).publicKey.toString('hex')