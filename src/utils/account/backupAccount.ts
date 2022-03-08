import RNFS from '../fileSystem/RNFS'
import Share from '../fileSystem/Share'
import { error, info } from '../log'
import { isMobile } from '../systemUtils'

/**
 * @description Method to backup account
 * Will open share dialogue on mobile or automatically download the file on web
 */
export const backupAccount = async () => {
  info('Backing up account')
  try {
    const result = await Share.open({
      title: 'peach-account.json',
      url: isMobile() ? 'file://' + RNFS.DocumentDirectoryPath + '/peach-account.json' : '/peach-account.json',
      subject: 'peach-account.json',
    })
    info(result)
  } catch (e) {
    error('Error =>', e)
  }
}