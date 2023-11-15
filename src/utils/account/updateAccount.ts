import { dataMigrationAfterLoadingWallet } from '../../init/dataMigration/dataMigrationAfterLoadingWallet'
import { useSettingsStore } from '../../store/settingsStore'
import i18n from '../i18n'
import { getDeviceLocale } from '../system'
import { defaultAccount, useAccountStore } from './account'
import { loadWalletFromAccount } from './loadWalletFromAccount'
import { setWallets } from './setWallets'

export const updateAccount = (acc: Account, overwrite?: boolean) => {
  const newAccount = overwrite
    ? acc
    : {
      ...defaultAccount,
      ...acc,
      tradingLimit: defaultAccount.tradingLimit,
    }
  useAccountStore.setState({ account: newAccount })

  i18n.setLocale(useSettingsStore.getState().locale || getDeviceLocale() || 'en')
  const account = useAccountStore.getState().account
  if (account.mnemonic) {
    const wallet = loadWalletFromAccount(account)
    setWallets(wallet, account.mnemonic)
    if (!account.base58) {
      dataMigrationAfterLoadingWallet(wallet, account)
    }
  }
}
