import analytics from '@react-native-firebase/analytics'

import { defaultAccount } from '.'
import { notificationStorage, notificationStore } from '../../components/footer/notificationsStore'
import { useConfigStore } from '../../store/configStore'
import { settingsStorage, useSettingsStore } from '../../store/settingsStore'
import { info } from '../log'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { sessionStorage } from '../session'
import { walletStorage, useWalletState } from '../wallet/walletStore'
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
    sessionStorage,
    settingsStorage,
    notificationStorage,
  ].forEach((storage) => storage.clearStore())
  ;[notificationStore, useConfigStore, useWalletState, useSettingsStore].forEach((store) => store.getState().reset())

  deleteAccessToken()
  deletePeachAccount()
  analytics().logEvent('account_deleted')
}
