import { exists } from 'react-native-fs'
import { APPVERSION } from '../../constants'
import { mkdir, writeFile } from '../file'
import { info } from '../log'

/**
 * @description Method to save account settings
 * @param settings settings
 * @param password secret
 * @returns promise resolving to encrypted settings
 */
export const storeIdentity = async (acc: Account, password: string): Promise<void> => {
  if (!acc.publicKey) throw new Error('error.ERROR_SAVE_ACCOUNT')

  info('Storing identity')
  await writeFile('/peach-account-identity.json', JSON.stringify({
    publicKey: acc.publicKey,
    privKey: acc.privKey,
    mnemonic: acc.mnemonic,
    pgp: acc.pgp,
  }), password)
}

/**
 * @description Method to save account settings
 * @param settings settings
 * @param password secret
 * @returns promise resolving to encrypted settings
 */
export const storeSettings = async (settings: Account['settings'], password: string): Promise<void> => {
  info('Storing settings')

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
  info('Storing trading limit')

  await writeFile('/peach-account-tradingLimit.json', JSON.stringify(tradingLimit), password)
}

/**
 * @description Method to save payment data
 * @param paymentData payment data
 * @param password secret
 * @returns promise resolving to encrypted payment data
 */
export const storePaymentData = async (paymentData: Account['paymentData'], password: string): Promise<void> => {
  info('Storing payment data')

  await writeFile('/peach-account-paymentData.json', JSON.stringify(paymentData), password)
}

/**
 * @description Method to save offer
 * @param offer offer
 * @param password secret
 * @returns promise resolving to encrypted offer
 */
export const storeOffer = async (offer: SellOffer|BuyOffer, password: string): Promise<void> => {
  info('Storing offer')

  if (!await exists('/peach-account-offers')) await mkdir('/peach-account-offers')
  await writeFile(`/peach-account-offers/${offer.id}.json`, JSON.stringify(offer), password)
}


/**
 * @description Method to save offers
 * @param offers offers
 * @param password secret
 * @returns promise resolving to encrypted offers
 */
export const storeOffers = async (offers: Account['offers'], password: string): Promise<void> => {
  info('Storing offers', offers.length)

  if (!await exists('/peach-account-offers')) await mkdir('/peach-account-offers')
  await Promise.all(offers.map(offer =>
    writeFile(`/peach-account-offers/${offer.id}.json`, JSON.stringify(offer), password)
  ))
}

/**
 * @description Method to save contract
 * @param contract contract
 * @param password secret
 * @returns promise resolving to encrypted contract
 */
export const storeContract = async (contract: Contract, password: string): Promise<void> => {
  info('Storing contract')

  if (!await exists('/peach-account-contracts')) await mkdir('/peach-account-contracts')
  await writeFile(`/peach-account-contracts/${contract.id}.json`, JSON.stringify(contract), password)
}

/**
 * @description Method to save contracts
 * @param contracts contracts
 * @param password secret
 * @returns promise resolving to encrypted contracts
 */
export const storeContracts = async (contracts: Account['contracts'], password: string): Promise<void> => {
  info('Storing contracts', contracts.length)

  if (!await exists('/peach-account-contracts')) await mkdir('/peach-account-contracts')
  await Promise.all(contracts.map(contract =>
    writeFile(`/peach-account-contracts/${contract.id}.json`, JSON.stringify(contract), password)
  ))
}


/**
 * @description Method to save chats
 * @param offers offers
 * @param password secret
 * @returns promise resolving to encrypted chats
 */
export const storeChats = async (chats: Account['chats'], password: string): Promise<void> => {
  info('Storing chats')

  await writeFile('/peach-account-chats.json', JSON.stringify(chats), password)
}


/**
 * @description Method to save account
 * @param account peach account
 * @param password secret
 * @returns promise resolving to encrypted account
 */
export const storeAccount = async (acc: Account, password: string): Promise<void> => {
  info('Storing account')

  if (!acc.publicKey) throw new Error('error.ERROR_SAVE_ACCOUNT')

  await Promise.all([
    storeIdentity(acc, password),
    storeSettings(acc.settings, password),
    storeTradingLimit(acc.tradingLimit, password),
    storePaymentData(acc.paymentData, password),
    storeOffers(acc.offers, password),
    storeContracts(acc.contracts, password),
    storeChats(acc.chats, password),
  ])
}