import BIP32Factory from 'bip32'
import { Network } from 'bitcoinjs-lib'
const ecc = require('tiny-secp256k1')
const bip32 = BIP32Factory(ecc)

/**
 * @deprecated
 */
export const createWalletFromPrivateKey = (privateKey: string, network: Network) =>
  bip32.fromPrivateKey(Buffer.from(privateKey, 'hex'), undefined, network)
