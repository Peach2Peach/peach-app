import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

export const getTransactionType = (
  { received }: Pick<TransactionDetails, 'received'>,
  offer?: Pick<OfferSummary, 'type'>,
): TransactionType => {
  if (received > 0 && offer) {
    return offer.type === 'ask' ? 'REFUND' : 'TRADE'
  }
  return received === 0 ? 'WITHDRAWAL' : 'DEPOSIT'
}
