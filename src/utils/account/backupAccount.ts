import { NETWORK } from '@env'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { writeFile } from '../file/writeFile'
import { error } from '../log/error'
import { info } from '../log/info'
import { parseError } from '../result/parseError'
import { useAccountStore } from './account'

type BackupAccountProps = {
  password: string
  onSuccess: () => void
  onCancel: () => void
  onError: () => void
}

export const backupAccount = async ({ password, onSuccess, onCancel, onError }: BackupAccountProps) => {
  info('Backing up account')
  const account = useAccountStore.getState().account
  try {
    const destinationFileName
      = NETWORK === 'bitcoin'
        ? `peach-account-${account.publicKey.substring(0, 8)}.json`
        : `peach-account-${NETWORK}-${account.publicKey.substring(0, 8)}.json`

    await writeFile(
      `/${destinationFileName}`,
      JSON.stringify({
        ...account,
        paymentData: usePaymentDataStore.getState().getPaymentDataArray(),
        settings: useSettingsStore.getState().getPureState(),
        offers: [],
        chats: {},
      }),
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
