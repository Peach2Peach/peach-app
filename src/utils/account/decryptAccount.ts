import { useSettingsStore } from '../../store/settingsStore'
import { decrypt } from '../crypto/decrypt'
import { info } from '../log/info'

interface DecryptAccountProps {
  encryptedAccount: string
  password: string
}

export const decryptAccount = ({
  encryptedAccount,
  password = '',
}: DecryptAccountProps): [AccountBackup | null, null | 'WRONG_PASSWORD'] => {
  info('Decrypting account')

  try {
    const accountBackup = JSON.parse(decrypt(encryptedAccount, password)) as AccountBackup
    useSettingsStore.getState().updateSettings(accountBackup.settings)
    return [accountBackup, null]
  } catch (e) {
    return [null, 'WRONG_PASSWORD']
  }
}
