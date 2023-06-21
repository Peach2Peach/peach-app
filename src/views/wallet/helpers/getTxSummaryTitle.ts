import i18n from '../../../utils/i18n'

export const getTxSummaryTitle = ({
  contractId,
  offerId,
  type,
}: Pick<TransactionSummary, 'contractId' | 'offerId' | 'type'>) => {
  if (type === 'ESCROWFUNDED') return i18n('wallet.transaction.type.escrowFunded')
  if (offerId || contractId) return i18n(type === 'TRADE' ? 'wallet.trade' : 'wallet.refund')
  return i18n(type === 'WITHDRAWAL' ? 'wallet.withdrawal' : 'wallet.deposit')
}
