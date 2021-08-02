import { error, info } from './logUtils'
import { isMobile, isWeb } from './systemUtils'
import * as db from './dbUtils'
import { download } from './webUtils'

const { RNFS, DocumentPicker, Share } = global

/**
 * @description Method to create a new or existing account
 * @param {object} account account object
 */
export const createAccount = async account => {
  info('Create account')
  if (!account) {
    account = JSON.stringify({ id: 'Peach of Cake' })
    // TODO send message to server about account creation
  }
  if (isMobile()) {
    info('Writing file')
    await RNFS.writeFile(RNFS.DocumentDirectoryPath + '/account.json', account, 'utf8')
    info('Success')
  } else if (isWeb()) {
    await db.set('account', account)
  }
}

/**
 * @description Method to get account
 * @return {object} account
 */
export const getAccount = async () => {
  let account = null

  info('Get account')

  if (isMobile()) {
    try {
      account = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/account.json', 'utf8')
    } catch (e) {
      error('File could not be read', e.message)
    }
  } else if (isWeb()) {
    account = await db.get('account')
  }
  return JSON.parse(account)
}


/**
 * @description Method to backup account
 * Will open share dialogue on mobile or automatically download the file on web
 */
export const backupAccount = async () => {
  info('Backing up account')
  if (isMobile()) {
    try {
      const result = await Share.open({
        title: 'Peach Account',
        url: 'file://' + RNFS.DocumentDirectoryPath + '/account.json',
        subject: 'Peach Account',
      })
      info(result)
    } catch (e) {
      error('Error =>', e)
    }
  } else if (isWeb()) {
    const account = await db.get('account')
    download('account.json', JSON.stringify(account))
  }
}

/**
 * @description Method to recover account
 * Prompts file select dialogue and imports account from file
 */
export const recoverAccount = async () => {
  info('Recovering account')

  if (isMobile()) {
    try {
      const result = await DocumentPicker.pick({
        // type: 'application/json' // TODO fixme
      })
      try {
        const account = await RNFS.readFile(result.uri, 'utf8')
        createAccount(account)
      } catch (e) {
        error('File could not be read', e.message)
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  } else if (isWeb()) {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = e => {
      const reader = new window.FileReader()
      const [file] = e.target.files
      reader.readAsText(file, 'UTF-8')

      reader.onload = readerEvent => {
        const content = readerEvent.target.result
        info(content)
      }
    }
    input.click()
  }
}
