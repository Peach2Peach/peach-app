import BIP32Factory from 'bip32'
const ecc = require('tiny-secp256k1')
const bip32 = BIP32Factory(ecc)

export const createWalletFromBase58 = bip32.fromBase58
