import { settingsStore } from '../../store/settingsStore'
import { decrypt } from '../crypto'
import { info } from '../log'

interface DecryptAccountProps {
  encryptedAccount: string
  password: string
}

export const decryptAccount = ({ encryptedAccount, password = '' }: DecryptAccountProps) => {
  info('Decrypting account')

  try {
    const accountBackup = JSON.parse(decrypt(encryptedAccount, password)) as AccountBackup
    settingsStore.getState().updateSettings(accountBackup.settings)
    return [accountBackup, null]
  } catch (e) {
    return [null, 'WRONG_PASSWORD']
  }
}
