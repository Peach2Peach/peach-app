import { setAccount, defaultAccount } from '.'
import { deleteFile } from '../file'
import { info } from '../log'
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

  if (await deleteFile('/peach-account.json')) {
    await setSession({ password: null })
    setAccount(defaultAccount)
    onSuccess()
  } else {
    onError()
  }
}