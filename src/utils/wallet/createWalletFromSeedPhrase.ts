import BIP32Factory from 'bip32'
import * as bip39 from 'bip39'
import { Network } from 'bitcoinjs-lib'
const ecc = require('tiny-secp256k1')
const bip32 = BIP32Factory(ecc)

/**
 * @deprecated
 */
export const createWalletFromSeedPhrase = (mnemonic: string, network: Network): PeachWallet => ({
  wallet: bip32.fromSeed(bip39.mnemonicToSeedSync(mnemonic), network),
  mnemonic,
})
