import { error, info } from './logUtils'
import { isMobile } from './systemUtils'
import CryptoJS from 'react-native-crypto-js'
import RNFS from './fileSystem/RNFS'
import Share from './fileSystem/Share'


interface CreateAccountProps {
  account?: object|null,
  password: string,
  onSuccess?: Function,
  onError?: Function
}
interface RecoverAccountProps {
  encryptedAccount: string,
  password: string,
  onSuccess?: Function,
  onError?: Function
}

/**
 * @description Method to create a new or existing account
 * @param [account] account object
 * @param [password] secret
 * @param [onSuccess] callback on success
 * @param [onError] callback on error
 * @returns promise resolving to encrypted account
 */
export const createAccount = async ({
  account,
  password = '',
  onSuccess,
  onError
}: CreateAccountProps): Promise<string|null> => {
  let ciphertext = null

  info('Create account', account, password)
  if (!account || typeof account !== 'object') {
    account = { id: 'Peach of Cake' } // TODO replace with actual data
    // TODO send message to server about account creation
  }

  try {
    ciphertext = CryptoJS.AES.encrypt(JSON.stringify(account), password).toString()
    await RNFS.writeFile(RNFS.DocumentDirectoryPath + '/account.json', ciphertext, 'utf8')
  } catch (e) {
    if (onError) onError(e)
    return null
  }

  if (onSuccess) onSuccess()
  return ciphertext
}

/**
 * @description Method to get account
 * @param [password] secret
 * @return account
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
      title: 'peach-account.json',
      url: isMobile() ? 'file://' + RNFS.DocumentDirectoryPath + '/account.json' : '/account.json',
      subject: 'peach-account.json',
    })
    info(result)
  } catch (e) {
    error('Error =>', e)
  }
}

/**
 * @description Method to recover account
 * @param encryptedAccount the account but password encrypted
 * @param [password] secret
 * @param [onSuccess] callback on success
 * @param [onError] callback on error
 */
export const decryptAccount = (encryptedAccount: string, password = '') => {
  info('Decrypting account', encryptedAccount, password)

  try {
    const account = CryptoJS.AES.decrypt(encryptedAccount, password).toString(CryptoJS.enc.Utf8)
    return JSON.parse(account)
  } catch (e) {
    info('Account cannot be decrypted', e)
  }
  return encryptedAccount
}

/**
 * @description Method to recover account
 * @param props.encryptedAccount the account but password encrypted
 * @param [props.password] secret
 * @param [props.onSuccess] callback on success
 * @param [props.onError] callback on error
 */
export const recoverAccount = ({ encryptedAccount, password = '', onSuccess, onError }: RecoverAccountProps) => {
  info('Recovering account', encryptedAccount, password)

  try {
    const account = decryptAccount(encryptedAccount, password)
    createAccount({
      account,
      password,
      onSuccess,
      onError
    })
  } catch (e) {
    if (onError) onError(e)
  }
}