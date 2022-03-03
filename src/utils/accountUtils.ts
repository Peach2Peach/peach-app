import { error, info } from './logUtils'
import { isMobile } from './systemUtils'
import RNFS from './fileSystem/RNFS'
import Share from './fileSystem/Share'
import { createWallet, getMainAddress, setWallet, getWallet } from './walletUtils'
import { session, setSession } from './sessionUtils'
import * as peachAPI from './peachAPI'
import { deleteFile, readFile, writeFile } from './fileUtils'
import { decrypt } from './cryptoUtils'

type Settings = {
  skipTutorial?: boolean,
  amount?: number,
  currencies?: Currency[],
  paymentMethods?: PaymentMethod[],
  premium?: number,
  kyc?: boolean,
  kycType?: KYCType,
}

export const defaultAccount: Account = {
  settings: {},
  paymentData: [],
  offers: [],
}

export let account = defaultAccount

interface CreateAccountProps {
  password: string,
  onSuccess: Function,
  onError: Function
}


/**
 * @description Method to set account for app session
 * @param acc account
 */
export const setAccount = async (acc: Account) => {
  account = {
    ...defaultAccount,
    ...acc
  }

  setWallet((await createWallet(account.mnemonic)).wallet) // TODO add error handling
  peachAPI.setPeachAccount(getWallet())
}

/**
 * @description Method to create a new or existing account
 * @param [password] secret
 * @param onSuccess callback on success
 * @param onError callback on error
 * @returns promise resolving to encrypted account
 */
export const createAccount = async ({
  password = '',
  onSuccess,
  onError
}: CreateAccountProps): Promise<void> => {
  info('Create account')
  const { wallet, mnemonic } = await createWallet() // TODO add error handling
  const firstAddress = getMainAddress(wallet)

  await setSession({ password })
  setAccount({
    ...defaultAccount,
    publicKey: firstAddress.publicKey.toString('hex'),
    privKey: (wallet.privateKey as Buffer).toString('hex'),
    mnemonic,
  })

  onSuccess()
}

/**
 * @description Method to get account
 * @param password secret
 * @return account
 */
export const loadAccount = async (password: string): Promise<Account> => {
  if (account.publicKey) return account

  info('Loading account from file')

  let acc

  try {
    acc = JSON.parse(await readFile('/peach-account.json', password)) as Account
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

  await setAccount(acc)
  return account
}

/**
 * @description Method to save account
 * @param password secret
 * @returns promise resolving to encrypted account
 */
export const saveAccount = async (acc: Account, password: string): Promise<void> => {
  if (!account.publicKey) throw new Error('Error saving account: Account has no public key!')
  const result = writeFile('/peach-account.json', JSON.stringify(account), password)
  if (!result) {
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
  if (session.password) saveAccount(account, session.password)
}

/**
 * @description Method to check whether offer exists in account
 * @param offer the offer
 * @returns true if offer exists
 */
const offerExists = (id: string): boolean => account.offers.some(o => o.id === id)

/**
 * @description Method to add offer to offer list
 * @param offer the offer
 */
export const saveOffer = (offer: SellOffer|BuyOffer): void => {
  info('saveOffer', offer)
  if (!offer.id) throw new Error('offerId is required')

  if (offerExists(offer.id)) {
    const index = account.offers.findIndex(o => o.id === offer.id)
    account.offers[index] = offer
  } else {
    account.offers.push(offer)
  }
  if (session.password) saveAccount(account, session.password)
}

/**
 * @description Method to update account payment data
 * @param paymentData settings to update
 */
export const updatePaymentData = (paymentData: PaymentData[]): void => {
  account.paymentData = paymentData
  if (session.password) saveAccount(account, session.password)
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
  info('Recovering account', encryptedAccount)

  try {
    setAccount(decrypt(encryptedAccount, password))
    onSuccess()
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

  if (await deleteFile('/peach-account.json')) {
    onSuccess()
  } else {
    onError()
  }
}