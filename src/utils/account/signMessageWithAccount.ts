import { sha256 } from 'bitcoinjs-lib/src/crypto'
import { createWalletFromSeedPhrase, getNetwork } from '../wallet'
import { getMainAccount } from './getMainAccount'
import { NETWORK } from '@env'

export const signMessageWithAccount = (message: string, account: Account & { mnemonic: string }) => {
  const { wallet } = createWalletFromSeedPhrase(account.mnemonic, getNetwork())
  const firstAddress = getMainAccount(wallet, NETWORK)
  return firstAddress.sign(sha256(Buffer.from(message))).toString('hex')
}
