import { error, info } from './logUtils'
import { isMobile } from './systemUtils'
import CryptoJS from 'react-native-crypto-js'
import RNFS from './fileSystem/RNFS'
import DocumentPicker from './fileSystem/DocumentPicker'
import Share from './fileSystem/Share'

/**
 * @description Method to create a new or existing account
 * @param {object|null} [account] account object
 * @param {string} [password] secret
 * @returns {promise} promise resolving to encrypted account
 */
export const createAccount = async (account: object | null, password = ''): Promise<string> => {
  let ciphertext = null

  if (typeof account === 'object') {}
  info('Create account')
  if (!account) {
    account = { id: 'Peach of Cake' } // TODO replace with actual data
    // TODO send message to server about account creation
  }

  ciphertext = CryptoJS.AES.encrypt(JSON.stringify(account), password).toString()

  await RNFS.writeFile(RNFS.DocumentDirectoryPath + '/account.json', ciphertext, 'utf8')

  return ciphertext
}

/**
 * @description Method to get account
 * @param {string} [password] secret
 * @return {object} account
 */
export const getAccount = async (password = '') => {
  let account = null

  info('Get account')

  try {
    account = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/account.json', 'utf8')
  } catch (e) {
    error('File could not be read', e.message)
  }

  account = CryptoJS.AES.decrypt(account, password).toString(CryptoJS.enc.Utf8)

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
  try {
    const result = await Share.open({
      title: 'Peach Account',
      url: isMobile() ? 'file://' + RNFS.DocumentDirectoryPath + '/account.json' : '/account.json',
      subject: 'Peach Account',
    })
    info(result)
  } catch (e) {
    error('Error =>', e)
  }
}

/**
 * @description Method to recover account
 * Prompts file select dialogue and imports account from file
 * @param {string} [password] secret
 */
export const recoverAccount = async (password = '') => {
  info('Recovering account')

  try {
    const result = await DocumentPicker.pick()
    try {
      let account = ''
      if (result.content) {
        account = result.content
      } else if (result.uri) {
        account = await RNFS.readFile(result.uri, 'utf8') as string
      }
      account = CryptoJS.AES.decrypt(account, password).toString(CryptoJS.enc.Utf8)

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
}