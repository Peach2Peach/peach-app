import { NETWORK } from '@env'
import { BIP32Interface } from 'bip32'

/**
 * @description Method to get the public key for the peach escrow
 * @param offerId offer id
 * @returns public key for escrow address
 * @deprecated
 */
export const getPublicKeyForEscrow = (wallet: BIP32Interface, offerId: string) =>
  wallet.derivePath(`m/48'/${NETWORK === 'bitcoin' ? '0' : '1'}'/0'/${offerId}'`).publicKey.toString('hex')
