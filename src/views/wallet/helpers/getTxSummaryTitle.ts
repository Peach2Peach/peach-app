import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'

export const getTxSummaryTitle = ({ contractId, offerId, type }: TransactionSummary) => {
  if (contractId) return i18n(type === 'TRADE' ? 'wallet.trade' : 'wallet.refund', contractIdToHex(contractId))
  if (offerId) return i18n(type === 'TRADE' ? 'wallet.trade' : 'wallet.refund', offerIdToHex(offerId))
  return i18n(type === 'WITHDRAWAL' ? 'wallet.withdrawal' : 'wallet.deposit')
}
