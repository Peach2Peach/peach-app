import { setAccount } from '.'
import { dataMigrationAfterLoadingAccount } from '../../init/dataMigration'
import { decrypt } from '../crypto'
import { info } from '../log'
import { account } from './account'

interface DecryptAccountProps {
  encryptedAccount: string
  password: string
}

export const decryptAccount = async ({
  encryptedAccount,
  password = '',
}: DecryptAccountProps): Promise<[Account | null, string | null]> => {
  info('Decrypting account')

  try {
    await setAccount(JSON.parse(decrypt(encryptedAccount, password)))
    await dataMigrationAfterLoadingAccount()
    return [account, null]
  } catch (e) {
    return [null, 'WRONG_PASSWORD']
  }
}
