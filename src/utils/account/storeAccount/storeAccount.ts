import { info } from '../../log'
import { storeIdentity } from './storeIdentity'
import { storeSettings } from './storeSettings'
import { storeTradingLimit } from './storeTradingLimit'
import { storePaymentData } from './storePaymentData'
import { storeOffers } from './storeOffers'
import { storeContracts } from './storeContracts'
import { storeChats } from './storeChats'

/**
 * @description Method to save whole account
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
