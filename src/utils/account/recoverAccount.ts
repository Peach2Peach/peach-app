import { setAccount } from '.'
import { decrypt } from '../crypto'
import { info } from '../log'
import { setSession } from '../session'
import { account } from './account'

interface RecoverAccountProps {
  encryptedAccount: string,
  password: string,
  onSuccess: Function,
  onError: Function
}

/**
 * @description Method to recover account
 * @param props.encryptedAccount the account but password encrypted
 * @param [props.password] secret
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const recoverAccount = async ({ encryptedAccount, password = '', onSuccess, onError }: RecoverAccountProps) => {
  info('Recovering account')

  try {
    await setAccount(JSON.parse(decrypt(encryptedAccount, password)))
    await setSession({ password })
    onSuccess(account)
  } catch (e) {
    onError(e)
  }
}