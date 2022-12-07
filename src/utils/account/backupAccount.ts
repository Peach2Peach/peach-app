import { NETWORK } from '@env'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { writeFile } from '../file'
import { error, info } from '../log'
import { sessionStorage } from '../session'
import { parseError } from '../system'
import { account } from './account'
import { getAccountBackup } from './getAccountBackup'

type BackupAccountProps = {
  onSuccess: () => void
  onCancel: () => void
  onError: () => void
}

/**
 * @description Method to backup account
 * Will open share dialogue on mobile or automatically download the file on web
 * @param onSuccess callback function on success
 * @param onError callback function on error
 */
export const backupAccount = async ({ onSuccess, onCancel, onError }: BackupAccountProps) => {
  info('Backing up account')
  try {
    const destinationFileName
      = NETWORK === 'bitcoin'
        ? `peach-account-${account.publicKey.substring(0, 8)}.json`
        : `peach-account-${NETWORK}-${account.publicKey.substring(0, 8)}.json`

    await writeFile(
      '/' + destinationFileName,
      JSON.stringify(getAccountBackup(account)),
      sessionStorage.getString('password') || undefined,
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
        }
        onError()
      })
  } catch (e) {
    error(e)
    onError()
  }
}
