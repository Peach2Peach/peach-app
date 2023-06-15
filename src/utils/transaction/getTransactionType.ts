import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

export const getTransactionType = (tx: TransactionDetails, offer?: OfferSummary): TransactionType => {
  if (tx.received > 0 && offer) {
    return offer.type === 'ask' ? 'REFUND' : 'TRADE'
  }
  return tx.received === 0 ? 'WITHDRAWAL' : 'DEPOSIT'
}
