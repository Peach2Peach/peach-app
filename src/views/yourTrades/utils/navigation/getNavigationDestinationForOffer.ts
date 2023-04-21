import { shouldGoToFundEscrow } from './shouldGoToFundEscrow'
import { shouldGoToOfferSummary } from './shouldGoToOfferSummary'
import { shouldGoToSearch } from './shouldGoToSearch'

type Destination =
  | ['offer' | 'setRefundWallet' | 'fundEscrow' | 'search', { offerId: string }]
  | ['yourTrades', undefined]

export const getNavigationDestinationForOffer = ({
  tradeStatus,
  id: offerId,
}: {
  tradeStatus: OfferSummary['tradeStatus']
  id: OfferSummary['id']
}): Destination => {
  if (shouldGoToOfferSummary(tradeStatus)) {
    return ['offer', { offerId }]
  }
  if (tradeStatus === 'refundAddressRequired') {
    return ['setRefundWallet', { offerId }]
  }

  if (shouldGoToFundEscrow(tradeStatus)) {
    return ['fundEscrow', { offerId }]
  }
  if (shouldGoToSearch(tradeStatus)) {
    return ['search', { offerId }]
  }

  return ['yourTrades', undefined]
}
