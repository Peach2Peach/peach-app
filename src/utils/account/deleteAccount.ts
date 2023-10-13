import analytics from '@react-native-firebase/analytics'

import { defaultAccount } from '.'
import { notificationStorage, useNotificationStore } from '../../components/footer/notificationsStore'
import { useConfigStore } from '../../store/configStore'
import { useSessionStore } from '../../store/sessionStore'
import { settingsStorage, useSettingsStore } from '../../store/settingsStore'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { info } from '../log'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { useWalletState, walletStorage } from '../wallet/walletStore'
import { accountStorage } from './accountStorage'
import { chatStorage } from './chatStorage'
import { contractStorage } from './contractStorage'
import { offerStorage } from './offerStorage'
import { updateAccount } from './updateAccount'

export const deleteAccount = () => {
  info('Deleting account')

  updateAccount(defaultAccount, true)
  ;[
    accountStorage,
    walletStorage,
    offerStorage,
    contractStorage,
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

  deleteAccessToken()
  deletePeachAccount()
  analytics().logEvent('account_deleted')
}
