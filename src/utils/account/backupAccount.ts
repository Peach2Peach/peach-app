import RNFS from '../fileSystem/RNFS'
import Share from '../fileSystem/Share'
import { error, info } from '../log'
import { isMobile } from '../system'

/**
 * @description Method to backup account
 * Will open share dialogue on mobile or automatically download the file on web
 * @param onSuccess callback function on success
 */
export const backupAccount = async (onSuccess: Function) => {
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
  }
}