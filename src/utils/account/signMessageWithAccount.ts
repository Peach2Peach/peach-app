import { sha256 } from 'bitcoinjs-lib/src/crypto'
import { createWalletFromSeedPhrase, getMainAddress, getNetwork } from '../wallet'

export const signMessageWithAccount = (message: string, account: Account) => {
  const { wallet } = createWalletFromSeedPhrase(account.mnemonic!, getNetwork())
  const firstAddress = getMainAddress(wallet)
  return firstAddress.sign(sha256(Buffer.from(message))).toString('hex')
}
