import { sha256 } from 'bitcoinjs-lib/src/crypto'
import { createWalletFromPrivateKey, getMainAddress, getNetwork } from '../wallet'

export const signMessageWithPrivateKey = (message: string, privateKey: string) => {
  const wallet = createWalletFromPrivateKey(privateKey, getNetwork())
  const firstAddress = getMainAddress(wallet)
  return firstAddress.sign(sha256(Buffer.from(message))).toString('hex')
}
