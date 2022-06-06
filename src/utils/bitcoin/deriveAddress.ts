import * as bitcoin from 'bitcoinjs-lib'
import { account } from '../account'
import { network } from '../wallet'

/**
 * @description Method to check whether string is an xpub
 * @param xpub xpub
 */
export const deriveAddress = (xpub: string, index: number) => {
  const wallet = bitcoin.bip32.fromBase58(xpub, network)
  const p2wsh = bitcoin.payments.p2wpkh({
    network,
    pubkey: wallet.derivePath(account.settings.derivationPath + `/0/${index}`).publicKey
  })
  return p2wsh.address
}
