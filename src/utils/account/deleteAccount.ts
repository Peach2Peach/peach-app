import analytics from '@react-native-firebase/analytics'

import { setAccount, defaultAccount } from '.'
import { deleteFile, exists } from '../file'
import { info } from '../log'
import { deleteAccessToken, deletePeachAccount } from '../peachAPI'
import { setSession } from '../session'

interface DeleteAccountProps {
  onSuccess: Function,
  onError: Function
}

/**
 * @description Method to delete account
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const deleteAccount = async ({ onSuccess, onError }: DeleteAccountProps) => {
  info('Deleting account')

  setAccount(defaultAccount, true)

  if (await exists('/peach-account.json')) {
    await deleteFile('/peach-account.json')
    await setSession({ password: null })
    deleteAccessToken()
    deletePeachAccount()
    onSuccess()
    analytics().logEvent('account_deleted')
  } else {
    onError()
  }
}