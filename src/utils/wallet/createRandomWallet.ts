import BIP32Factory from 'bip32'
import * as bip39 from 'bip39'
import { Network } from 'bitcoinjs-lib'
import { getRandom } from '../crypto/getRandom'
const ecc = require('tiny-secp256k1')
const bip32 = BIP32Factory(ecc)

/**
 * @description Method to randomly create a new wallet or from entropy
 * @returns bip32 HD wallet
 */
export const createRandomWallet = async (network: Network): Promise<PeachWallet> => {
  const mnemonic = bip39.entropyToMnemonic(await getRandom(16))
  const seed = bip39.mnemonicToSeedSync(mnemonic)

  return {
    wallet: bip32.fromSeed(seed, network),
    mnemonic,
  }
}
