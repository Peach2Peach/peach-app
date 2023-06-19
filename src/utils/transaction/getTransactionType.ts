import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'

export const getTransactionType = (
  { received, sent }: Pick<TransactionDetails, 'received' | 'sent'>,
  offer?: Pick<OfferSummary, 'type'>,
): TransactionType => {
  if (received > 0 && offer) {
    return offer.type === 'ask' ? 'REFUND' : 'TRADE'
  }
  return sent === 0 ? 'DEPOSIT' : 'WITHDRAWAL'
}
