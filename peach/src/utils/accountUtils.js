import { error, info } from './logUtils'
import { isMobile, isWeb } from './systemUtils'
import * as db from './dbUtils'
import { download } from './webUtils'
import CryptoJS, { AES } from 'react-native-crypto-js'

const { RNFS, DocumentPicker, Share } = global

/**
 * @description Method to create a new or existing account
 * @param {object} account account object
 * @param {string} password secret
 */
export const createAccount = async (account, password) => {
  let ciphertext = null

  info('Create account')
  if (!account) {
    account = { id: 'Peach of Cake' }
    // TODO send message to server about account creation
  }

  account = JSON.stringify(account)
  ciphertext = AES.encrypt(account, password).toString()

  if (isMobile()) {
    info('Writing file')
    await RNFS.writeFile(RNFS.DocumentDirectoryPath + '/account.json', ciphertext, 'utf8')
    info('Success')
  } else if (isWeb()) {
    await db.set('account', ciphertext)
  }
}

/**
 * @description Method to get account
 * @param {string} password secret
 * @return {object} account
 */
export const getAccount = async password => {
  let account = null
  let bytes = null
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

  bytes = AES.decrypt(account, password)
  account = bytes.toString(CryptoJS.enc.Utf8)

  try {
    return JSON.parse(account)
  } catch (e) {
    error('Incorrect password', e.message)
    return null
  }
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
 * @param {string} password secret
 */
export const recoverAccount = async password => {
  let account = null

  info('Recovering account')

  if (isMobile()) {
    try {
      const result = await DocumentPicker.pick({
        // type: 'application/json' // TODO fixme
      })
      try {
        account = await RNFS.readFile(result.uri, 'utf8')
        createAccount(JSON.parse(account), password)
      } catch (e) {
        error('File could not be read', e.message)
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        throw err
      }
    }
  } else if (isWeb()) {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = event => {
      const reader = new window.FileReader()
      const [file] = event.target.files
      reader.readAsText(file, 'UTF-8')

      reader.onload = readerEvent => {
        account = readerEvent.target.result

        try {
          createAccount(JSON.parse(account), password)
        } catch (e) {
          error('Incorrect password', e.message)
        }
      }
    }
    input.click()
  }
}
