import { setPeachAccount } from '../peachAPI/peachAccount'
import { createWalletFromSeedPhrase, getNetwork, setWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { setPeachWallet } from '../wallet/setWallet'
import { createPeachAccount } from './createPeachAccount'

export const loadAccountFromSeedPhrase = (seedPhrase: string) => {
  const { wallet } = createWalletFromSeedPhrase(seedPhrase, getNetwork())
  setWallet(wallet)
  setPeachAccount(createPeachAccount(wallet))

  const peachWallet = new PeachWallet({ wallet })
  peachWallet.loadWallet(seedPhrase)
  setPeachWallet(peachWallet)
}
