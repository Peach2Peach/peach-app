import BIP32Factory from 'bip32'
import * as bip39 from 'bip39'
import { getNetwork } from './getNetwork'
const ecc = require('tiny-secp256k1')

const bip32 = BIP32Factory(ecc)

export const createWalletFromSeed = (seed: Buffer): PeachWallet => ({
  wallet: bip32.fromSeed(seed, getNetwork()),
  mnemonic: bip39.entropyToMnemonic(seed),
})
