import { setAccount } from '.'
import { settingsStore } from '../../store/settingsStore'
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
    const accountBackup = JSON.parse(decrypt(encryptedAccount, password)) as AccountBackup
    settingsStore.getState().updateSettings(accountBackup.settings)
    await setAccount(accountBackup)
    return [account, null]
  } catch (e) {
    return [null, 'WRONG_PASSWORD']
  }
}
