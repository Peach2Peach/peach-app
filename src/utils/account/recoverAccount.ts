import { setAccount } from '.'
import { decrypt } from '../crypto'
import { info } from '../log'
import { setSession } from '../session'
import { account } from './account'

interface RecoverAccountProps {
  encryptedAccount: string,
  password: string,
}

/**
 * @description Method to recover account
 * @param props.encryptedAccount the account but password encrypted
 * @param [props.password] secret
 */
export const recoverAccount = async ({
  encryptedAccount,
  password = ''
}: RecoverAccountProps): Promise<[Account|null, Error|null]> => {
  info('Recovering account')

  try {
    await setAccount(JSON.parse(decrypt(encryptedAccount, password)))
    await setSession({ password })
    return [account, null]
  } catch (e) {
    return [null, e as Error]
  }
}