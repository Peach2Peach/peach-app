import { ConfirmedTransaction, PendingTransaction } from 'bdk-rn/lib/lib/interfaces'

export const getTransactionType = (
  tx: ConfirmedTransaction | PendingTransaction,
  offer?: BuyOffer | SellOffer,
): TransactionType => {
  if (offer?.id) {
    return offer.refunded ? 'REFUND' : 'TRADE'
  }
  return tx.received === 0 ? 'WITHDRAWAL' : 'DEPOSIT'
}
