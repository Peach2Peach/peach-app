import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'

export const getTxSummaryTitle = (tx: TransactionSummary): string => {
  if (tx.contractId) return i18n(tx.type === 'TRADE' ? 'wallet.trade' : 'wallet.refund', contractIdToHex(tx.contractId))
  if (tx.offerId) return i18n(tx.type === 'TRADE' ? 'wallet.trade' : 'wallet.refund', offerIdToHex(tx.offerId))
  return i18n(tx.type === 'WITHDRAWAL' ? 'wallet.withdrawal' : 'wallet.deposit')
}
