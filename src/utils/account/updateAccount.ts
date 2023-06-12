import { dataMigrationAfterLoadingWallet } from '../../init/dataMigration/dataMigrationAfterLoadingWallet'
import { settingsStore } from '../../store/settingsStore'
import { setLocaleQuiet } from '../i18n'
import { getDeviceLocale } from '../system'
import { account, defaultAccount, setAccount } from './account'
import { loadWalletFromAccount } from './loadWalletFromAccount'
import { setWallets } from './setWallets'

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

  setLocaleQuiet(settingsStore.getState().locale || getDeviceLocale() || 'en')

  if (account.mnemonic) {
    const wallet = loadWalletFromAccount(account)
    setWallets(wallet, account.mnemonic)
    if (!account.base58) {
      dataMigrationAfterLoadingWallet(wallet, account)
    }
  }
}
