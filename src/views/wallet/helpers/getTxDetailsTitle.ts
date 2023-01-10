import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'

export const getTxDetailsTitle = (tx: TransactionSummary): string => {
  if (tx.offerId) {
    return i18n(tx.type === 'TRADE' ? 'wallet.stackedSats' : 'wallet.refund', offerIdToHex(tx.offerId))
  }
  return i18n(tx.type === 'WITHDRAWAL' ? 'wallet.withdrawal' : 'wallet.deposit')
}
