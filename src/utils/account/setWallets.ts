import { BIP32Interface } from 'bip32'
import { peachAPI } from '../peachAPI'
import { setPeachAccount } from '../peachAPI/peachAccount'
import { setWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { setPeachWallet } from '../wallet/setWallet'
import { createPeachAccount } from './createPeachAccount'

export const setWallets = async (wallet: BIP32Interface, seedPhrase: string) => {
  setWallet(wallet)
  const peachAccount = createPeachAccount(wallet)
  setPeachAccount(peachAccount)
  peachAPI.setPeachAccount(peachAccount)
  await peachAPI.authenticate()

  const peachWallet = new PeachWallet({ wallet })
  peachWallet.loadWallet(seedPhrase)
  setPeachWallet(peachWallet)
}
