import { ConfirmedTransaction, PendingTransaction } from 'bdk-rn/lib/lib/interfaces'

export const getTransactionType = (
  tx: ConfirmedTransaction | PendingTransaction,
  offer?: OfferSummary,
): TransactionType => {
  if (tx.received > 0 && offer) {
    return offer.type === 'ask' ? 'REFUND' : 'TRADE'
  }
  return tx.received === 0 ? 'WITHDRAWAL' : 'DEPOSIT'
}
