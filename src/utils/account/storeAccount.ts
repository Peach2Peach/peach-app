import { account } from '.'
import { APPVERSION } from '../../constants'
import { writeFile } from '../file'
import { info } from '../log'

/**
 * @description Method to save account settings
 * @param settings settings
 * @param password secret
 * @returns promise resolving to encrypted settings
 */
export const storeSettings = async (settings: Account['settings'], password: string): Promise<void> => {
  info('Saving account')

  settings.appVersion = APPVERSION
  await writeFile('/peach-account-settings.json', JSON.stringify(settings), password)
}

/**
 * @description Method to save account trading limit
 * @param tradingLimit trading limit
 * @param password secret
 * @returns promise resolving to encrypted trading limit
 */
export const storeTradingLimit = async (tradingLimit: Account['tradingLimit'], password: string): Promise<void> => {
  info('Saving account')

  await writeFile('/peach-account-tradingLimit.json', JSON.stringify(tradingLimit), password)
}

/**
 * @description Method to save payment data
 * @param paymentData payment data
 * @param password secret
 * @returns promise resolving to encrypted payment data
 */
export const storePaymentData = async (paymentData: Account['paymentData'], password: string): Promise<void> => {
  info('Saving payment data')

  await writeFile('/peach-account-paymentData.json', JSON.stringify(paymentData), password)
}


/**
 * @description Method to save offers
 * @param offers offers
 * @param password secret
 * @returns promise resolving to encrypted offers
 */
export const storeOffers = async (offers: Account['offers'], password: string): Promise<void> => {
  info('Saving offers')

  await writeFile('/peach-account-offers.json', JSON.stringify(offers), password)
}

/**
 * @description Method to save contracts
 * @param offers offers
 * @param password secret
 * @returns promise resolving to encrypted contracts
 */
export const storeContracts = async (contracts: Account['contracts'], password: string): Promise<void> => {
  info('Saving contracts')

  await writeFile('/peach-account-contracts.json', JSON.stringify(contracts), password)
}


/**
 * @description Method to save chats
 * @param offers offers
 * @param password secret
 * @returns promise resolving to encrypted chats
 */
export const storeChats = async (chats: Account['chats'], password: string): Promise<void> => {
  info('Saving chats')

  await writeFile('/peach-account-chats.json', JSON.stringify(chats), password)
}


/**
 * @description Method to save account
 * @param account peach account
 * @param password secret
 * @returns promise resolving to encrypted account
 */
export const storeAccount = async (acc: Account, password: string): Promise<void> => {
  info('Saving account')

  account.settings.appVersion = APPVERSION
  if (!acc.publicKey) throw new Error('error.ERROR_SAVE_ACCOUNT')
  await writeFile('/peach-account.json', JSON.stringify(account), password)
  await writeFile('/peach-account-identity.json', JSON.stringify({
    publicKey: account.publicKey,
    privKey: account.privKey,
    mnemonic: account.mnemonic,
    pgp: account.pgp,
  }), password)

  storeSettings(account.settings, password)
  storeTradingLimit(account.tradingLimit, password)
  storePaymentData(account.paymentData, password)
  storeOffers(account.offers, password)
  storeContracts(account.contracts, password)
  storeChats(account.chats, password)
}