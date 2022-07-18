import RNFS from '../fileSystem/RNFS'
import Share from '../fileSystem/Share'
import { error, info } from '../log'
import { isMobile } from '../system'
import { account } from './account'

type BackupAccountProps = {
  onSuccess: Function,
  onError: Function,
}

/**
 * @description Method to backup account
 * Will open share dialogue on mobile or automatically download the file on web
 * @param onSuccess callback function on success
 * @param onError callback function on error
 */
export const backupAccount = async ({ onSuccess, onError }: BackupAccountProps) => {
  info('Backing up account')
  try {
    const result = await Share.open({
      title: 'peach-account.json',
      url: isMobile() ? 'file://' + RNFS.DocumentDirectoryPath + '/peach-account.json' : '/peach-account.json',
      subject: 'peach-account.json',
    })
    info(result)
    onSuccess()
  } catch (e) {
    error(e)
    onError()
  }
}