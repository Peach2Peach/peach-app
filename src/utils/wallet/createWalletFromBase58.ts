import BIP32Factory, { BIP32Interface } from 'bip32'
import { Network } from 'bitcoinjs-lib'
const ecc = require('tiny-secp256k1')
const bip32 = BIP32Factory(ecc)

export const createWalletFromBase58 = (base58: string, network: Network): BIP32Interface =>
  bip32.fromBase58(base58, network)
