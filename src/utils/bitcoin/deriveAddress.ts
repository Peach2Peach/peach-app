import BIP32Factory from 'bip32'
import { payments } from 'bitcoinjs-lib'
import { account } from '../account'
import { getNetwork } from '../wallet'
const ecc = require('tiny-secp256k1')

const bip32 = BIP32Factory(ecc)

/**
 * @description Method to check whether string is an xpub
 * @param xpub xpub
 */
export const deriveAddress = (xpub: string, index: number) => {
  const network = getNetwork()
  const wallet = bip32.fromBase58(xpub, network)
  const p2wsh = payments.p2wpkh({
    network,
    pubkey: wallet.derivePath(account.settings.derivationPath + `/0/${index}`).publicKey,
  })
  return p2wsh.address
}
