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
 */
export const storeAccount = async (acc: Account): Promise<void> => {
  info('storeAccount - Storing account')

  if (!acc.publicKey) throw new Error('ERROR_SAVE_ACCOUNT')

  await Promise.all([
    storeIdentity(acc),
    storeSettings(acc.settings),
    storeTradingLimit(acc.tradingLimit),
    storePaymentData(acc.paymentData),
    storeOffers(acc.offers),
    storeContracts(acc.contracts),
    storeChats(acc.chats),
  ])
}
