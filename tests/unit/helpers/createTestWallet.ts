import BIP32Factory from 'bip32'
import { networks } from 'bitcoinjs-lib'
const ecc = require('tiny-secp256k1')
const bip32 = BIP32Factory(ecc)

const defaultBase58
  = 'tprv8ZgxMBicQKsPdu44Gqd9eC643bSfshHN7SBGaZopL1ynn6Zj4FX4E3t4WTKsS8BVafKeKXSyeQPpwUNQTJXwDHYdq5adc5NomoYTPwiYYMH'
export const createTestWallet = (base58 = defaultBase58) => bip32.fromBase58(base58, networks.regtest)
