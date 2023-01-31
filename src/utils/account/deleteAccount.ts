import analytics from '@react-native-firebase/analytics'

import { defaultAccount, setAccount } from '.'
import { settingsStorage } from '../../store/settingsStore'
import { info } from '../log'
import { logoutUser } from '../peachAPI'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { sessionStorage } from '../session'
import { accountStorage, chatStorage, contractStorage, offerStorage } from './accountStorage'

export const deleteAccount = async () => {
  info('Deleting account')

  setAccount(defaultAccount, true)
  ;[accountStorage, offerStorage, contractStorage, chatStorage, sessionStorage, settingsStorage].forEach((storage) =>
    storage.clearStore(),
  )

  logoutUser({})

  deleteAccessToken()
  deletePeachAccount()
  analytics().logEvent('account_deleted')
}
