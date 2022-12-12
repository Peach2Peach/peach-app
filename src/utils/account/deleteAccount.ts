import analytics from '@react-native-firebase/analytics'

import { defaultAccount, setAccount } from '.'
import { info } from '../log'
import { logoutUser } from '../peachAPI'
import { deleteAccessToken } from '../peachAPI/accessToken'
import { deletePeachAccount } from '../peachAPI/peachAccount'
import { sessionStorage } from '../session'
import { accountStorage, chatsStorage, clearStorage, contractsStorage, offersStorage } from '../storage'

interface DeleteAccountProps {
  onSuccess: Function
}

/**
 * @description Method to delete account
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const deleteAccount = async ({ onSuccess }: DeleteAccountProps) => {
  info('Deleting account')

  // setAccount(defaultAccount, true) // TODO how to update all useStorage?
  ;[accountStorage, offersStorage, contractsStorage, chatsStorage, sessionStorage].forEach(clearStorage)

  logoutUser({})

  deleteAccessToken()
  deletePeachAccount()
  onSuccess()
  analytics().logEvent('account_deleted')
}
