import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { offerIdToHex } from '../../../utils/offer'

export const getTxDetailsTitle = ({
  contractId,
  offerId,
  type,
}: Pick<TransactionSummary, 'contractId' | 'offerId' | 'type'>) => {
  if (contractId) {
    return i18n(type === 'TRADE' ? 'wallet.stackedSats' : 'wallet.refund.long', contractIdToHex(contractId))
  }
  if (offerId) {
    return i18n(type === 'TRADE' ? 'wallet.stackedSats' : 'wallet.refund.long', offerIdToHex(offerId))
  }
  return i18n(type === 'WITHDRAWAL' ? 'wallet.withdrawal' : 'wallet.deposit')
}
