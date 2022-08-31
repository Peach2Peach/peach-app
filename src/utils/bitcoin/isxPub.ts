import BIP32Factory from 'bip32'
import * as ecc from 'tiny-secp256k1'
import { network } from '../wallet'

const bip32 = BIP32Factory(ecc)

/**
 * @description Method to check whether string is an xpub
 * @param xpub xpub
 */
export const isxpub = (xpub?: string) => {
  let valid = false

  if (!xpub) return false

  try {
    // is xpub
    bip32.fromBase58(xpub, network)
    valid = true
  } catch (e) { }

  return valid
}