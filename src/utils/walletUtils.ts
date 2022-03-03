import { NETWORK } from '@env'
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
      NETWORK === 'testnet'
        ? bitcoin.networks.testnet
        : NETWORK === 'regtest'
          ? bitcoin.networks.regtest
          : bitcoin.networks.bitcoin
    ),
    mnemonic
  }
}

export const getWallet = () => wallet
export const setWallet = (wllt: bitcoin.bip32.BIP32Interface) => wallet = wllt

/**
 * @description Method to get the first address of account
 * @param wllt the HD wllt
 * @returns main address
 */
export const getMainAddress = (wllt: bitcoin.bip32.BIP32Interface) =>
  wllt.derivePath(`m/48'/${NETWORK === 'bitcoin' ? '0' : '1'}'/0'/0'`)

/**
 * @description Method to get the public key for the peach escrow
 * @param offerId offer id
 * @returns public key for escrow address
 */
export const getPublicKeyForEscrow = (offerId: string) =>
  wallet.derivePath(`m/48'/${NETWORK === 'bitcoin' ? '0' : '1'}'/0'/${offerId}'`).publicKey.toString('hex')