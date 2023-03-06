import { NETWORK } from '@env'
import { BIP32Interface } from 'bip32'

/**
 * @description Method to get the first address of account
 * @param wallet the HD wallet
 * @returns main address
 * @deprecated
 */
export const getMainAddress = (wallet: BIP32Interface) =>
  wallet.derivePath(`m/48'/${NETWORK === 'bitcoin' ? '0' : '1'}'/0'/0'`)
