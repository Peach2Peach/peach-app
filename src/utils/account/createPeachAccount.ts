import { createWalletFromSeedPhrase, getMainAddress, getNetwork } from '../wallet'

export const createPeachAccount = (mnemonic: string) => {
  const { wallet } = createWalletFromSeedPhrase(mnemonic, getNetwork())
  return getMainAddress(wallet)
}
