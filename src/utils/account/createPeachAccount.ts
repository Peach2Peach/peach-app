import { NETWORK } from '@env'
import { createWalletFromSeedPhrase, getNetwork } from '../wallet'
import { getMainAccount } from './getMainAccount'

export const createPeachAccount = (mnemonic: string) => {
  const { wallet } = createWalletFromSeedPhrase(mnemonic, getNetwork())
  return getMainAccount(wallet, NETWORK)
}
