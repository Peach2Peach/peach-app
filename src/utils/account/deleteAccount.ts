import analytics from '@react-native-firebase/analytics'

import { defaultAccount, setAccount } from '.'
import { info } from '../log'
import { logoutUser } from '../peachAPI'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { sessionStorage } from '../session'
import { clearStorage } from '../storage'
import { accountStorage, chatStorage, contractStorage, offerStorage } from './accountStorage'

export const deleteAccount = async () => {
  info('Deleting account')

  setAccount(defaultAccount, true)
  ;[accountStorage, offerStorage, contractStorage, chatStorage, sessionStorage].forEach(clearStorage)

  logoutUser({})

  deleteAccessToken()
  deletePeachAccount()

  analytics().logEvent('account_deleted')
}
