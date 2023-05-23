import { settingsStore } from '../../store/settingsStore'
import { setLocaleQuiet } from '../i18n'
import { setPeachAccount } from '../peachAPI/peachAccount'
import { createWalletFromSeedPhrase, getNetwork, setWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { setPeachWallet } from '../wallet/setWallet'
import { createPeachAccount } from './createPeachAccount'
import { account, defaultAccount, setAccount } from './account'

export const updateAccount = async (acc: Account, overwrite?: boolean) => {
  setAccount(
    overwrite
      ? acc
      : {
        ...defaultAccount,
        ...acc,
        tradingLimit: defaultAccount.tradingLimit,
      },
  )

  setLocaleQuiet('en' || settingsStore.getState().locale)

  if (account.mnemonic) {
    const { wallet } = createWalletFromSeedPhrase(account.mnemonic, getNetwork())
    setWallet(wallet)
    setPeachAccount(createPeachAccount(account.mnemonic))

    const peachWallet = new PeachWallet({ wallet })
    peachWallet.loadWallet(account.mnemonic)
    setPeachWallet(peachWallet)
  }
}
