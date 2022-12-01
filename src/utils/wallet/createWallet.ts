import BIP32Factory from 'bip32'
import * as bip39 from 'bip39'
import { getRandom } from '../crypto'
import { getNetwork } from './getNetwork'
const ecc = require('tiny-secp256k1')

const bip32 = BIP32Factory(ecc)

/**
 * @description Method to randomly create a new wallet or from seed phrase
 * @param mnemonic bitcoin seed phrase
 * @returns bip32 HD wallet
 * @deprecated
 */
export const createWallet = async (mnemonic?: string): Promise<PeachWallet> => {
  mnemonic = mnemonic || bip39.entropyToMnemonic(await getRandom(16))
  const seed = bip39.mnemonicToSeedSync(mnemonic)

  return {
    wallet: bip32.fromSeed(seed, getNetwork()),
    mnemonic,
  }
}
