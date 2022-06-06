import * as bitcoin from 'bitcoinjs-lib'
import { network } from '../wallet'

/**
 * @description Method to check whether string is an xpub
 * @param xpub xpub
 */
export const isxpub = (xpub?: string) => {
  let valid = false

  if (!xpub) return false

  try {
    // is xpub
    bitcoin.bip32.fromBase58(xpub, network)
    valid = true
  } catch (e) { }

  return valid
}