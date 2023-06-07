import { createWalletFromSeedPhrase, getNetwork } from '../wallet'

export const loadAccountFromSeedPhrase = (seedPhrase: string) => {
  const { wallet } = createWalletFromSeedPhrase(seedPhrase, getNetwork())
  return wallet
}
