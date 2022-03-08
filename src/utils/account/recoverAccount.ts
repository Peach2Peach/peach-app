import { setAccount } from '.'
import { decrypt } from '../crypto'
import { info } from '../logUtils'

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
  info('Recovering account', encryptedAccount)

  try {
    await setAccount(decrypt(encryptedAccount, password))
    onSuccess()
  } catch (e) {
    onError(e)
  }
}