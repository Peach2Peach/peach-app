import { error, info } from './logUtils'
import { isMobile } from './systemUtils'
import CryptoJS from 'react-native-crypto-js'
import RNFS from './fileSystem/RNFS'
import Share from './fileSystem/Share'
import EncryptedStorage from 'react-native-encrypted-storage'
import { createWallet, setWallet } from './walletUtils'
import * as peachAPI from './peachAPI'
import { getSession, session } from './sessionUtils'

type Settings = {
  skipTutorial?: boolean,
  amount?: number,
  currencies?: Currency[],
  premium?: number,
  kyc?: boolean,
  kycType?: KYCType,
}

export type Account = {
  publicKey?: string,
  privKey?: string,
  mnemonic?: string,
  settings: Settings,
  paymentData: PaymentData[],
  offers: SellOffer[],
}

const defaultAccount: Account = {
  settings: {},
  paymentData: [],
  offers: [],
}

export let account = defaultAccount

interface CreateAccountProps {
  acc?: Account|null,
  password: string,
  onSuccess: Function,
  onError: Function
}

/**
 * @description Method to set account for app session
 * @param acc account
 */
const setAccount = async (acc: Account) => {
  account = {
    ...defaultAccount,
    ...acc
  }

  const { wallet } = await createWallet(account.mnemonic) // TODO add error handling
  setWallet(wallet)

  const firstAddress = wallet.derivePath("m/48'/0'/0'/0'") // eslint-disable-line quotes

  const [result, apiError] = await peachAPI.userAuth(firstAddress)

  if (apiError?.error) {
    info('Create account APIERROR', acc, apiError.error)
  }
}

/**
 * @description Method to get account
 * @param password secret
 * @return account
 */
export const getAccount = async (password: string): Promise<Account> => {
  info('Get account')

  if (account.publicKey) return account

  let acc = ''

  try {
    acc = await RNFS.readFile(RNFS.DocumentDirectoryPath + '/peach-account.json', 'utf8') as string
    acc = CryptoJS.AES.decrypt(acc, password).toString(CryptoJS.enc.Utf8)
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }
    error('File could not be read', err)
  }

  try {
    if (acc) setAccount(JSON.parse(acc))
    return account
  } catch (e) {
    let err = 'UNKOWN_ERROR'
    if (typeof e === 'string') {
      err = e.toUpperCase()
    } else if (e instanceof Error) {
      err = e.message
    }
    error('Incorrect password', err)
    return account
  }
}


/**
 * @description Method to create a new or existing account
 * @param [account] account object
 * @param [password] secret
 * @param onSuccess callback on success
 * @param onError callback on error
 * @returns promise resolving to encrypted account
 */
// eslint-disable-next-line max-statements
export const createAccount = async ({
  acc,
  password = '',
  onSuccess,
  onError
}: CreateAccountProps): Promise<string|null|void> => {
  let ciphertext = null

  info('Create account', acc, password)
  if (!acc || typeof acc !== 'object') {
    const { wallet, mnemonic } = await createWallet() // TODO add error handling
    setWallet(wallet)
    const firstAddress = wallet.derivePath("m/48'/0'/0'/0'") // eslint-disable-line quotes

    account = {
      ...defaultAccount,
      publicKey: firstAddress.publicKey.toString('hex'),
      privKey: (wallet.privateKey as Buffer).toString('hex'),
      mnemonic,
    }

    const [result, apiError] = await peachAPI.userAuth(firstAddress)

    info('Create account RESULT', result)

    if (apiError?.error) {
      info('Create account APIERROR', acc, password, apiError.error)

      return onError(apiError.error)
    }
  } else {
    account = acc
  }

  try {
    ciphertext = CryptoJS.AES.encrypt(JSON.stringify(account), password).toString()
    await RNFS.writeFile(RNFS.DocumentDirectoryPath + '/peach-account.json', ciphertext, 'utf8')
    await EncryptedStorage.setItem(
      'session',
      JSON.stringify({
        ...getSession(),
        password
      })
    )
  } catch (e) {
    onError(e)
    return null
  }

  onSuccess()
  return ciphertext
}

/**
 * @description Method to save account
 * @param password secret
 * @returns promise resolving to encrypted account
 */
export const saveAccount = async (password: string): Promise<void> => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(account), password).toString()
    await RNFS.writeFile(RNFS.DocumentDirectoryPath + '/peach-account.json', ciphertext, 'utf8')
  } catch (e) {
    // TODO add error handling
  }
}

/**
 * @description Method to update app settings
 * @param options settings to update
 */
export const updateSettings = (options: Settings): void => {
  account.settings = {
    ...account.settings,
    ...options
  }
  if (session.password) saveAccount(session.password)
}

/**
 * @description Method to check whether offer exists in account
 * @param offer the offer
 * @returns true if offer exists
 */
const offerExists = (id: number): boolean => account.offers.some(o => o.offerId === id)

/**
 * @description Method to add offer to offer list
 * @param offer the offer
 */
export const saveOffer = (offer: SellOffer): void => {
  if (!offer.offerId) throw new Error('offerId is required')

  if (offerExists(offer.offerId)) {
    const index = account.offers.findIndex(o => o.offerId === offer.offerId)
    account.offers[index] = offer
  } else {
    account.offers.push(offer)
  }
  if (session.password) saveAccount(session.password)
}

/**
 * @description Method to update account payment data
 * @param paymentData settings to update
 */
export const updatePaymentData = (paymentData: PaymentData[]): void => {
  account.paymentData = paymentData
  if (session.password) saveAccount(session.password)
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
      url: isMobile() ? 'file://' + RNFS.DocumentDirectoryPath + '/peach-account.json' : '/peach-account.json',
      subject: 'peach-account.json',
    })
    info(result)
  } catch (e) {
    error('Error =>', e)
  }
}

interface RecoverAccountProps {
  encryptedAccount: string,
  password: string,
  onSuccess: Function,
  onError: Function
}

/**
 * @description Method to recover account
 * @param props.encryptedAccount the account but password encrypted
 * @param [props.password] secret
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const recoverAccount = ({ encryptedAccount, password = '', onSuccess, onError }: RecoverAccountProps) => {
  info('Recovering account', encryptedAccount, password)

  try {
    const acc = CryptoJS.AES.decrypt(encryptedAccount, password).toString(CryptoJS.enc.Utf8)
    createAccount({
      acc,
      password,
      onSuccess,
      onError
    })
  } catch (e) {
    onError(e)
  }
}


interface DeleteAccountProps {
  onSuccess: Function,
  onError: Function
}

/**
 * @description Method to delete account
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const deleteAccount = async ({ onSuccess, onError }: DeleteAccountProps) => {
  info('Deleting account')

  try {
    await RNFS.unlink(RNFS.DocumentDirectoryPath + '/peach-account.json')
    onSuccess()
  } catch (e) {
    onError(e)
  }
}