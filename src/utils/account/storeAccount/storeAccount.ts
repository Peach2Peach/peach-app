import { info } from '../../log'
import { storeIdentity } from './storeIdentity'
import { storeTradingLimit } from './storeTradingLimit'
import { storePaymentData } from './storePaymentData'
import { storeOffers } from './storeOffers'
import { storeContracts } from './storeContracts'
import { storeChats } from './storeChats'
import { useAccountStore } from '../../../store/accountStore'

/**
 * @description Method to save whole account
 */
export const storeAccount = async (acc: Account): Promise<void> => {
  info('storeAccount - Storing account')

  if (!acc.publicKey) throw new Error('ERROR_SAVE_ACCOUNT')

  const identity: Identity = {
    publicKey: acc.publicKey,
    privKey: acc.privKey,
    mnemonic: acc.mnemonic,
    pgp: acc.pgp,
  }
  useAccountStore.getState().setIdentity(identity)

  await Promise.all([
    storeIdentity(identity),
    storeTradingLimit(acc.tradingLimit),
    storePaymentData(acc.paymentData),
    storeOffers(acc.offers),
    storeContracts(acc.contracts),
    storeChats(acc.chats),
  ])
}
