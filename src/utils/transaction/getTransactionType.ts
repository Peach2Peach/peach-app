import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

export const getTransactionType = (tx: TransactionDetails, offer?: OfferSummary): TransactionType => {
  if (offer) {
    return offer.type === 'ask' ? 'REFUND' : 'TRADE'
  }
  return tx.received === 0 ? 'WITHDRAWAL' : 'DEPOSIT'
}
