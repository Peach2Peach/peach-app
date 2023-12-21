import { createWalletFromSeedPhrase } from '../wallet/createWalletFromSeedPhrase'
import { getNetwork } from '../wallet/getNetwork'

export const loadAccountFromSeedPhrase = (seedPhrase: string) => {
  const { wallet } = createWalletFromSeedPhrase(seedPhrase, getNetwork())
  return wallet
}
