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
  
  info('Default set')
  if (await exists('/peach-account.json')) {
    info('File exists')
    await deleteFile('/peach-account.json')
    info('File deleted')
    await setSession({ password: null })
    info('Session restored')
    deleteAccessToken()
    info('Token deleted')
    deletePeachAccount()
    info('Peach account deleted')
    onSuccess()
  } else {
    info('File does not exist')
    onError()
  }
}