import analytics from '@react-native-firebase/analytics'

import { defaultAccount, setAccount } from '.'
import { info } from '../log'
import { logoutUser } from '../peachAPI'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { sessionStorage } from '../session'
import { clearStorage } from '../storage'
import { accountStorage, chatStorage, contractStorage, offerStorage } from './accountStorage'

interface DeleteAccountProps {
  onSuccess?: Function
}

/**
 * @description Method to delete account
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const deleteAccount = async ({ onSuccess }: DeleteAccountProps) => {
  info('Deleting account')

  setAccount(defaultAccount, true)
  ;[accountStorage, offerStorage, contractStorage, chatStorage, sessionStorage].forEach(clearStorage)

  logoutUser({})

  deleteAccessToken()
  deletePeachAccount()
  if (onSuccess) onSuccess()
  analytics().logEvent('account_deleted')
}
