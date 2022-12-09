import { setAccount } from '.'
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
}: DecryptAccountProps): Promise<[Account | null, Error | null]> => {
  info('Decrypting account')

  try {
    await setAccount(JSON.parse(decrypt(encryptedAccount, password)))
    return [account, null]
  } catch (e) {
    return [null, e as Error]
  }
}
