import { NETWORK } from '@env'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { settingsStore } from '../../store/settingsStore'
import { writeFile } from '../file'
import { error, info } from '../log'
import { parseError } from '../system'
import { account } from './account'
import { getAccountBackup } from './getAccountBackup'

type BackupAccountProps = {
  password: string
  onSuccess: () => void
  onCancel: () => void
  onError: () => void
}

/**
 * @description Method to backup account
 * Will open share dialogue on mobile or automatically download the file on web
 */
export const backupAccount = async ({ password, onSuccess, onCancel, onError }: BackupAccountProps) => {
  info('Backing up account')
  try {
    const destinationFileName
      = NETWORK === 'bitcoin'
        ? `peach-account-${account.publicKey.substring(0, 8)}.json`
        : `peach-account-${NETWORK}-${account.publicKey.substring(0, 8)}.json`

    await writeFile(
      '/' + destinationFileName,
      JSON.stringify(getAccountBackup(account, settingsStore.getState().getPureState())),
      password,
    )

    Share.open({
      title: destinationFileName,
      url: `file://${RNFS.DocumentDirectoryPath}/${destinationFileName}`,
      subject: destinationFileName,
    })
      .then(({ message, success, dismissedAction }) => {
        info('Backed up account', message, success)
        if (dismissedAction) {
          info('User dismissed share dialog')
          onCancel()
        } else if (success) {
          info('Shared successfully', message)
          onSuccess()
        } else {
          error(message)
          onError()
        }
      })
      .catch((e) => {
        if (parseError(e) === 'User did not share') {
          info('User dismissed share dialog')
          onCancel()
        } else {
          error(e)
          onError()
        }
      })
  } catch (e) {
    error(e)
    onError()
  }
}
