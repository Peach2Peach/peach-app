import BIP32Factory, { BIP32Interface } from 'bip32'
import * as bip39 from 'bip39'
import { getNetwork } from './getNetwork'
const ecc = require('tiny-secp256k1')
const bip32 = BIP32Factory(ecc)

export let wallet: BIP32Interface

export const createWalletFromSeedPhrase = (mnemonic: string): PeachWallet => ({
  wallet: bip32.fromSeed(bip39.mnemonicToSeedSync(mnemonic), getNetwork()),
  mnemonic,
})
