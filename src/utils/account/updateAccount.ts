import { settingsStore } from '../../store/settingsStore'
import { setLocaleQuiet } from '../i18n'
import { getDeviceLocale } from '../system'
import { defaultAccount, setAccount } from './account'

export const updateAccount = (acc: Account, overwrite?: boolean) => {
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
}
