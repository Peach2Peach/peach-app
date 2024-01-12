import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { OfferSummary } from '../../../peach-api/src/@types/offer'

export const getTransactionType = (
  { received, sent }: Pick<TransactionDetails, 'received' | 'sent'>,
  offer?: Pick<OfferSummary, 'type'>,
): TransactionType => {
  if (offer) {
    if (received > 0 && sent === 0) return offer.type === 'ask' ? 'REFUND' : 'TRADE'
    if (sent > 0 && offer.type === 'ask') return 'ESCROWFUNDED'
  }

  return sent === 0 ? 'DEPOSIT' : 'WITHDRAWAL'
}
