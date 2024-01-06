import analytics from '@react-native-firebase/analytics'
import { useConfigStore } from '../../store/configStore/configStore'
import { offerPreferencesStorage } from '../../store/offerPreferenes/useOfferPreferences'
import { useSessionStore } from '../../store/sessionStore'
import { settingsStorage, useSettingsStore } from '../../store/settingsStore'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { notificationStorage, useNotificationStore } from '../../views/home/notificationsStore'
import { info } from '../log/info'
import { peachAPI } from '../peachAPI'
import { useWalletState, walletStorage } from '../wallet/walletStore'
import { defaultAccount } from './account'
import { accountStorage } from './accountStorage'
import { chatStorage } from './chatStorage'
import { offerStorage } from './offerStorage'
import { updateAccount } from './updateAccount'

export const deleteAccount = () => {
  info('Deleting account')

  updateAccount(defaultAccount, true)
  ;[
    accountStorage,
    walletStorage,
    offerPreferencesStorage,
    offerStorage,
    chatStorage,
    settingsStorage,
    notificationStorage,
  ].forEach((storage) => storage.clearStore())
  ;[
    useNotificationStore,
    useConfigStore,
    useWalletState,
    useSettingsStore,
    usePaymentDataStore,
    useSessionStore,
  ].forEach((store) => store.getState().reset())

  peachAPI.setPeachAccount(null)
  analytics().logEvent('account_deleted')
}
