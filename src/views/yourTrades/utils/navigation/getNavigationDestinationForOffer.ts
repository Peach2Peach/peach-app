import { shouldGoToFundEscrow } from './shouldGoToFundEscrow'
import { shouldGoToSearch } from './shouldGoToSearch'
import { shouldGoToWrongFundingAmount } from './shouldGoToWrongFundingAmount'

type Destination =
  | ['offer' | 'fundEscrow' | 'search' | 'wrongFundingAmount', { offerId: string }]
  | ['yourTrades', undefined]

export const getNavigationDestinationForOffer = ({
  tradeStatus,
  id: offerId,
}: {
  tradeStatus: OfferSummary['tradeStatus']
  id: OfferSummary['id']
}): Destination => {
  if (tradeStatus === 'offerCanceled') {
    return ['offer', { offerId }]
  }

  if (shouldGoToFundEscrow(tradeStatus)) return ['fundEscrow', { offerId }]
  if (shouldGoToSearch(tradeStatus)) return ['search', { offerId }]
  if (shouldGoToWrongFundingAmount(tradeStatus)) return ['wrongFundingAmount', { offerId }]

  return ['yourTrades', undefined]
}
